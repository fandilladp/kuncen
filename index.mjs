import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const algorithm = 'aes-256-cbc'; // Tetap menggunakan AES-256
const keyLength = 32; // Panjang kunci untuk AES-256
const ivLength = 16; // Panjang IV untuk AES-256-CBC

/**
 * ----------------------------------------------------------------------
 * FUNGSI: GENERATE TOKEN (Custom AES-256-CBC)
 * ----------------------------------------------------------------------
 * Fungsi ini akan membuat token terenkripsi dengan algoritma AES-256-CBC
 * Format token:  IV (hex) : DATA terenkripsi (hex)
 * DATA yang terenkripsi = key.salt.expiryTime
 */
export function generateToken(key, salt, minutes) {
  const now = Math.floor(Date.now() / 1000); // Waktu saat ini (UTC) dalam detik
  const expiryTime = now + minutes * 60;     // Waktu kadaluarsa (UTC) dalam detik
  
  // Pad atau potong key menjadi 32 bytes (256 bits)
  const keyBuffer = Buffer.alloc(keyLength, key);

  // Buat IV random (16 bytes)
  const iv = crypto.randomBytes(ivLength);

  // Data yang mau dienkripsi
  const tokenData = `${key}.${salt}.${expiryTime}`;

  // Enkripsi data dengan AES-256-CBC
  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
  let encrypted = cipher.update(tokenData, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Gabungkan IV dengan hasil enkripsi
  // IV diubah ke hex agar mudah disimpan
  const encryptedToken = `${iv.toString('hex')}:${encrypted}`;
  return encryptedToken;
}

/**
 * ----------------------------------------------------------------------
 * FUNGSI: VALIDATE TOKEN (Custom AES-256-CBC)
 * ----------------------------------------------------------------------
 * Melakukan dekripsi untuk mengecek:
 *   1. Apakah kunci & salt cocok.
 *   2. Apakah token sudah expired.
 */
export function validateToken(encryptedToken, key, salt) {
  try {
    // Pecah string token menjadi IV dan ciphertext
    const [ivHex, encrypted] = encryptedToken.split(':');
    const iv = Buffer.from(ivHex, 'hex');

    // Pad atau potong key menjadi 32 bytes (256 bits)
    const keyBuffer = Buffer.alloc(keyLength, key);

    // Dekripsi
    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    // Hasil dekripsi berupa string: "key.salt.expiryTime"
    const [tokenKey, tokenSalt, tokenExpiryTime] = decrypted.split('.');

    // Validasi key & salt
    if (tokenKey !== key || tokenSalt !== salt) {
      return false;
    }

    // Validasi apakah token sudah kadaluarsa
    const now = Math.floor(Date.now() / 1000);
    return now <= parseInt(tokenExpiryTime, 10);
  } catch (error) {
    // Jika ada error (token rusak, salah kunci, dsb), return false
    return false;
  }
}

/**
 * ----------------------------------------------------------------------
 * FUNGSI: GENERATE JWT
 * ----------------------------------------------------------------------
 * @param {string} key     -> bagian kunci
 * @param {string} salt    -> bagian salt
 * @param {object} data    -> payload/data yang ingin disimpan di dalam JWT
 * @param {number} minutes -> durasi token dalam menit
 * 
 * JWT akan menggunakan key+salt sebagai "secret" dan HS256 sebagai algoritma.
 */
export function generateJwtToken(key, salt, data, minutes) {
  const secret = key + salt;                // Gabungan key & salt jadi secret
  const expiresIn = `${minutes}m`;          // Format waktu kadaluarsa -> "10m", "60m", dsb.
  
  // Buat token JWT
  // payload (data) boleh Anda tambah/ubah sesuai kebutuhan.
  const token = jwt.sign(
    { 
      data, // data tambahan Anda
    }, 
    secret, 
    {
      algorithm: 'HS256',
      expiresIn, // token akan kadaluarsa dalam x menit
    }
  );

  return token;
}

/**
 * ----------------------------------------------------------------------
 * FUNGSI: VALIDATE JWT
 * ----------------------------------------------------------------------
 * Melakukan verifikasi JWT menggunakan key+salt.
 * 
 * @return 
 *   - Jika valid, return objek `decoded` (payload JWT).
 *   - Jika tidak valid, return false.
 */
export function validateJwtToken(token, key, salt) {
  try {
    const secret = key + salt;
    // Verifikasi token dengan secret
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
    return decoded; // Payload dari JWT (misalnya { data, iat, exp, ... })
  } catch (error) {
    // Jika token invalid, expired, atau salah secret -> error
    return false;
  }
}
