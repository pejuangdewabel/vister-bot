const jsQR = require('jsqr');
const { createCanvas, loadImage } = require('canvas');

/**
 * Fungsi untuk membaca QR code dari buffer gambar
 * @param {Buffer} buffer - Buffer gambar yang akan diproses
 * @returns {Promise<string|null>} - Mengembalikan data QR code atau null jika tidak ditemukan
 */
async function readQRCodeFromBuffer(buffer) {
  try {
    // Memuat gambar ke dalam canvas
    const image = await loadImage(buffer);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Menggunakan jsQR untuk mendeteksi QR code dalam gambar
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

    if (qrCode) {
      return qrCode.data; // Mengembalikan data dari QR code
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error membaca QR code:', error);
    return null;
  }
}

module.exports = {
  readQRCodeFromBuffer,
};
