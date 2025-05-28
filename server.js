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
        user: process.env.EMAIL_USER || 'your-email@gmail.com', // Gmail adresiniz
        pass: process.env.EMAIL_PASS || 'your-app-password' // Gmail uygulama şifreniz
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Log the received data
        console.log('Received contact form submission:', { name, email, message });
        
        // Email gönderme ayarları
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com', // Gönderen email
            to: 'goksukayar99@gmail.com', // Alıcı email
            subject: `Portfolyo İletişim Formu: ${name}`,
            text: `İsim: ${name}\nEmail: ${email}\nMesaj: ${message}`,
            html: `
                <h3>Portfolyo İletişim Formu</h3>
                <p><strong>İsim:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mesaj:</strong> ${message}</p>
            `
        };

        // Email gönder
        await transporter.sendMail(mailOptions);
        
        res.json({ 
            success: true, 
            message: 'Form başarıyla gönderildi' 
        });
    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Form gönderilirken bir hata oluştu' 
        });
    }
});

// Port belirle (Render'da process.env.PORT otomatik atanır)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});
