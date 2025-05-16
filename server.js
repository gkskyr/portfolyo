const express = require('express');
const path = require('path');
const app = express();

// Public klasöründeki dosyaları sun
app.use(express.static(path.join(__dirname, 'public')));

// Port belirle (Render'da process.env.PORT otomatik atanır)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});
