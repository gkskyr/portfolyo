const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Public klasörünü dışarıya aç
app.use(express.static(path.join(__dirname, 'public')));

// Root isteği geldiğinde index.html'i gönder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
