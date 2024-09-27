require('dotenv').config(); // Load environment variables from .env
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { readQRCodeFromBuffer } = require('./qrCodeReader');

// Mengambil token dari file .env
const token = process.env.TELEGRAM_BOT_TOKEN;

// Cek apakah token tersedia
if (!token) {
  throw new Error("Token Telegram bot tidak ditemukan di file .env");
}

// Inisialisasi bot Telegram
const bot = new TelegramBot(token, { polling: true });

// Perintah ketika pengguna memulai chat dengan bot
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name;

  bot.sendMessage(chatId, `Halo, ${name}! Selamat datang di chatbot saya yang terintegrasi dengan Express.js! Anda bisa menggunakan perintah /upload untuk mengunggah gambar berisi QR code.`);
});

// Menangani unggahan gambar
bot.onText(/\/upload/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Silakan unggah gambar yang berisi QR code.');
});

// Menangani pesan berupa gambar
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const fileId = msg.photo[msg.photo.length - 1].file_id;

  // Dapatkan URL file dari Telegram
  const fileUrl = await bot.getFileLink(fileId);

  try {
    // Unduh gambar
    const response = await axios({
      url: fileUrl,
      responseType: 'arraybuffer'
    });
    
    const imageBuffer = Buffer.from(response.data, 'binary');

    // Proses gambar dan baca QR code
    const qrCodeData = await readQRCodeFromBuffer(imageBuffer);

    if (qrCodeData) {
      bot.sendMessage(chatId, `QR code ditemukan: ${qrCodeData}`);
    } else {
      bot.sendMessage(chatId, 'Tidak ada QR code yang ditemukan dalam gambar.');
    }
  } catch (error) {
    console.error('Error saat memproses gambar:', error);
    bot.sendMessage(chatId, 'Terjadi kesalahan saat membaca gambar. Coba unggah gambar lagi.');
  }
});

module.exports = bot;
