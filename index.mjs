import crypto from 'crypto';

const algorithm = 'aes-256-cbc'; // Tetap menggunakan AES-256
const keyLength = 32; // Panjang kunci untuk AES-256
const ivLength = 16; // Panjang IV untuk AES-256-CBC

// Fungsi untuk generate token
export function generateToken(key, salt, minutes) {
  const now = Math.floor(Date.now() / 1000); // Waktu saat ini dalam detik
  const expiryTime = now + minutes * 60; // Hitung waktu habis dalam detik

  // Pad atau potong key menjadi 32 bytes (256 bits)
  const keyBuffer = Buffer.alloc(keyLength, key); 

  // Buat IV acak dengan panjang 16 bytes
  const iv = crypto.randomBytes(ivLength); 

  const tokenData = `${key}.${salt}.${expiryTime}`;

  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
  let encrypted = cipher.update(tokenData, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Gabungkan IV dengan hasil enkripsi
  const encryptedToken = `${iv.toString('hex')}:${encrypted}`;
  return encryptedToken;
}

// Fungsi untuk ekstrak dan validasi token
export function validateToken(encryptedToken, key, salt) {
  try {
    // Pecah IV dan ciphertext dari token terenkripsi
    const [ivHex, encrypted] = encryptedToken.split(':');
    const iv = Buffer.from(ivHex, 'hex');

    // Pad atau potong key menjadi 32 bytes (256 bits)
    const keyBuffer = Buffer.alloc(keyLength, key);

    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    const [tokenKey, tokenSalt, tokenExpiryTime] = decrypted.split('.');

    // Validasi key dan salt
    if (tokenKey !== key || tokenSalt !== salt) {
      return false;
    }

    // Validasi waktu
    const now = Math.floor(Date.now() / 1000);
    return now <= parseInt(tokenExpiryTime, 10);
  } catch (error) {
    // Tangani semua kesalahan dekripsi dengan mengembalikan false
    return false;
  }
}
