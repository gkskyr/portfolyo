const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const axios = require('axios');
const app = express();

// Rate limiter for IPs
const ipRateLimiter = {
    attempts: new Map(),
    maxAttempts: 10, // Maximum attempts per IP per day
    timeWindow: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    
    checkLimit: function(ip) {
        const now = Date.now();
        const userAttempts = this.attempts.get(ip) || [];
        
        // Clean up old attempts
        const recentAttempts = userAttempts.filter(timestamp => 
            now - timestamp < this.timeWindow
        );
        
        // Check if limit exceeded
        if (recentAttempts.length >= this.maxAttempts) {
            const oldestAttempt = recentAttempts[0];
            const timeUntilReset = (oldestAttempt + this.timeWindow) - now;
            const hoursUntilReset = Math.ceil(timeUntilReset / (60 * 60 * 1000));
            
            return {
                allowed: false,
                message: `IP adresiniz için günlük limit aşıldı. Lütfen ${hoursUntilReset} saat sonra tekrar deneyin.`
            };
        }
        
        // Update attempts
        this.attempts.set(ip, [...recentAttempts, now]);
        return { 
            allowed: true,
            remainingAttempts: this.maxAttempts - (recentAttempts.length + 1)
        };
    }
};

// Clean up old IP records every hour
setInterval(() => {
    const now = Date.now();
    for (const [ip, attempts] of ipRateLimiter.attempts.entries()) {
        const validAttempts = attempts.filter(timestamp => 
            now - timestamp < ipRateLimiter.timeWindow
        );
        if (validAttempts.length === 0) {
            ipRateLimiter.attempts.delete(ip);
        } else {
            ipRateLimiter.attempts.set(ip, validAttempts);
        }
    }
}, 60 * 60 * 1000); // Run every hour

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Expose-Headers', 'X-RateLimit-Remaining');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// JSON body parser middleware
app.use(express.json());

// Public klasöründeki dosyaları sun
app.use(express.static(path.join(__dirname, 'public')));

// Email transporter oluştur
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Server is ready to send emails');
    }
});

// Rate limiting middleware
app.use('/api/contact', (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const limitCheck = ipRateLimiter.checkLimit(ip);

    if (!limitCheck.allowed) {
        return res.status(429).json({
            success: false,
            message: limitCheck.message
        });
    }

    // Add remaining attempts to response header
    res.header('X-RateLimit-Remaining', limitCheck.remainingAttempts.toString());
    next();
});

// reCAPTCHA verification function
async function verifyRecaptcha(token) {
    try {
        const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
            {
                params: {
                    secret: '6Lea1UwrAAAAANyRagViFE_r5X_pqj3SYqtdnmId',
                    response: token
                }
            }
        );
        
        return response.data.success;
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return false;
    }
}

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message, recaptchaToken } = req.body;
        const ip = req.ip || req.connection.remoteAddress;

        // Verify reCAPTCHA first
        const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
        if (!isRecaptchaValid) {
            return res.status(400).json({
                success: false,
                message: 'reCAPTCHA doğrulaması başarısız oldu. Lütfen tekrar deneyin.'
            });
        }
        
        console.log('Form submission from IP:', ip);
        console.log('Remaining attempts:', ipRateLimiter.attempts.get(ip)?.length || 0);
        
        // Log the received data and environment variables (mask sensitive data)
        console.log('Received contact form submission:', { name, email, message });
        console.log('Email configuration:', {
            emailUser: process.env.EMAIL_USER ? 'Set' : 'Not set',
            emailPass: process.env.EMAIL_PASS ? 'Set' : 'Not set'
        });
        
        // Email gönderme ayarları
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'goksukyr@gmail.com',
            subject: `Portfolyo İletişim Formu: ${name}`,
            text: `İsim: ${name}\nEmail: ${email}\nMesaj: ${message}\nIP: ${ip}`,
            html: `
                <h3>Portfolyo İletişim Formu</h3>
                <p><strong>İsim:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mesaj:</strong> ${message}</p>
                <p><strong>IP:</strong> ${ip}</p>
            `
        };

        try {
            // Email gönder
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', info.response);
            
            res.json({ 
                success: true, 
                message: 'Form başarıyla gönderildi' 
            });
        } catch (emailError) {
            console.error('Email sending error:', emailError);
            throw emailError;
        }
    } catch (error) {
        console.error('Request handling error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Form gönderilirken bir hata oluştu',
            error: error.message
        });
    }
});

// Port belirle (Render'da process.env.PORT otomatik atanır)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor...`);
    console.log('Environment check:', {
        NODE_ENV: process.env.NODE_ENV,
        emailConfigured: !!process.env.EMAIL_USER && !!process.env.EMAIL_PASS
    });
});
