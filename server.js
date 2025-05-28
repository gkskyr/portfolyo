const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();

// CORS middleware ekle
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
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

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Log the received data and environment variables (mask sensitive data)
        console.log('Received contact form submission:', { name, email, message });
        console.log('Email configuration:', {
            emailUser: process.env.EMAIL_USER ? 'Set' : 'Not set',
            emailPass: process.env.EMAIL_PASS ? 'Set' : 'Not set'
        });
        
        // Email gönderme ayarları
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'goksukayar99@gmail.com',
            subject: `Portfolyo İletişim Formu: ${name}`,
            text: `İsim: ${name}\nEmail: ${email}\nMesaj: ${message}`,
            html: `
                <h3>Portfolyo İletişim Formu</h3>
                <p><strong>İsim:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mesaj:</strong> ${message}</p>
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
        console.error('Detailed error:', error);
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
