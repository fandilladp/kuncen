
// index.cjs (CommonJS)
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const algorithm = 'aes-256-cbc';
const keyLength = 32;
const ivLength = 16;

// FUNGSI: GENERATE TOKEN (Custom AES-256-CBC)
function generateToken(key, salt, minutes) {
  const now = Math.floor(Date.now() / 1000);
  const expiryTime = now + minutes * 60;

  const keyBuffer = Buffer.alloc(keyLength, key);
  const iv = crypto.randomBytes(ivLength);
  const tokenData = `${key}.${salt}.${expiryTime}`;

  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
  let encrypted = cipher.update(tokenData, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return `${iv.toString('hex')}:${encrypted}`;
}

// FUNGSI: VALIDATE TOKEN (Custom AES-256-CBC)
function validateToken(encryptedToken, key, salt) {
  try {
    const [ivHex, encrypted] = encryptedToken.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const keyBuffer = Buffer.alloc(keyLength, key);

    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    const [tokenKey, tokenSalt, tokenExpiryTime] = decrypted.split('.');
    if (tokenKey !== key || tokenSalt !== salt) return false;

    const now = Math.floor(Date.now() / 1000);
    return now <= parseInt(tokenExpiryTime, 10);
  } catch (error) {
    return false;
  }
}

// FUNGSI: GENERATE JWT
function generateJwtToken(key, salt, data, minutes) {
  const secret = key + salt;
  const expiresIn = `${minutes}m`;
  return jwt.sign({ data }, secret, { algorithm: 'HS256', expiresIn });
}

// FUNGSI: VALIDATE JWT
function validateJwtToken(token, key, salt) {
  try {
    const secret = key + salt;
    return jwt.verify(token, secret, { algorithms: ['HS256'] });
  } catch (error) {
    return false;
  }
}

// FUNGSI: ENCRYPT PAYLOAD (Custom AES-256-CBC)
function encryptPayload(payload, key, salt) {
  const jsonData = JSON.stringify(payload);
  const keyBuffer = Buffer.alloc(keyLength, key + salt);
  const iv = crypto.randomBytes(ivLength);

  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
  let encrypted = cipher.update(jsonData, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return `${iv.toString('hex')}:${encrypted}`;
}

// FUNGSI: DECRYPT PAYLOAD (Custom AES-256-CBC)
function decryptPayload(encryptedPayload, key, salt) {
  try {
    const [ivHex, encrypted] = encryptedPayload.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const keyBuffer = Buffer.alloc(keyLength, key + salt);

    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  } catch (error) {
    return null;
  }
}

// Ekspor semua fungsi
module.exports = {
  generateToken,
  validateToken,
  generateJwtToken,
  validateJwtToken,
  encryptPayload,
  decryptPayload
};
