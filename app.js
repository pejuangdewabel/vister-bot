const express = require('express');
const bot = require('./bot');

// Inisialisasi aplikasi Express
const app = express();

// Endpoint HTTP dasar untuk memastikan server berjalan
app.get('/', (req, res) => {
  res.send('Bot Telegram dengan Express.js berjalan!');
});

// Endpoint untuk cek status bot
app.get('/status', (req, res) => {
  res.send({ status: 'Bot aktif', timestamp: new Date() });
});

// Menjalankan server Express
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
