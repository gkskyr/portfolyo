const express = require('express');
const path = require('path');
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

// Contact form endpoint
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Log the received data
        console.log('Received contact form submission:', { name, email, message });
        
        // Here you would typically send an email or save to database
        // For now, we'll just send back a success response
        
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
