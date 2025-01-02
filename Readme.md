# Kuncen NPM Package

![kuncen Logo](./assets/kuncen.webp)

`kuncen` adalah package NPM yang digunakan untuk menghasilkan dan memvalidasi token dinamis dengan enkripsi AES dan waktu habis (expiry time).

## Instalasi

Untuk menginstal package ini, gunakan npm atau yarn:

```bash
npm install kuncen
```

atau

```bash
yarn add kuncen
```

## Penggunaan

### 1. Di Express (Backend)

Anda dapat menggunakan package ini di aplikasi Express.js untuk menghasilkan dan memvalidasi token.

#### Contoh Kode di Express:

```javascript
const express = require('express');
const { generateToken, validateToken } = require('kuncen');

const app = express();
const key = 'your-secret-key';
const salt = 'your-salt-value';

app.use(express.json());

app.post('/generate-token', (req, res) => {
  const token = generateToken(key, salt, 3); // Token berlaku selama 3 menit (UTC)
  res.json({ token });
});

app.post('/validate-token', (req, res) => {
  const { token } = req.body;
  const isValid = validateToken(token, key, salt); // Validasi tanpa parameter waktu
  res.json({ valid: isValid });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### 2. Di React (Frontend)

Di aplikasi React, Anda bisa menggunakan package ini untuk menghasilkan token sebelum mengirimkan request ke backend.

#### Contoh Kode di React:

```javascript
import { generateToken } from 'kuncen';

const key = 'your-secret-key';
const salt = 'your-salt-value';

function sendRequest() {
  const token = generateToken(key, salt, 3); // Token berlaku selama 3 menit (berbasis UTC)

  fetch('http://localhost:3000/validate-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.valid) {
        console.log('Token valid');
      } else {
        console.log('Token tidak valid');
      }
    });
}
```

## Fitur

- **`generateToken(key, salt, minutes)`**: Menghasilkan token enkripsi AES dengan kombinasi key, salt, dan waktu habis.
- **`validateToken(encryptedToken, key, salt)`**: Memvalidasi token berdasarkan key, salt, dan waktu.
- **`generateJwtToken(key, salt, data, minutes)`**: Menghasilkan token JWT menggunakan HS256 dengan key dan salt sebagai secret.
- **`validateJwtToken(token, key, salt)`**: Memvalidasi JWT dan mengembalikan payload jika valid.

## Penjelasan Fitur Baru

### Fungsi Generate Token (Custom AES-256-CBC)

Fungsi ini menggunakan algoritma AES-256-CBC untuk mengenkripsi data dengan format:

- **Format Token**: `IV (hex) : DATA terenkripsi (hex)`
- Data yang terenkripsi berupa kombinasi `key.salt.expiryTime`.

### Fungsi Validate Token (Custom AES-256-CBC)

Fungsi ini mendekripsi token AES-256-CBC untuk memeriksa:

1. Apakah kunci (`key`) dan salt (`salt`) cocok.
2. Apakah token telah kedaluwarsa berdasarkan `expiryTime`.

### Fungsi Generate JWT

Menghasilkan token JWT menggunakan kombinasi `key + salt` sebagai secret dan algoritma HS256.

- Mendukung penyimpanan payload/data tambahan.
- Format waktu kedaluwarsa dapat diatur dalam menit, misalnya `10m` atau `60m`.

### Fungsi Validate JWT

Memverifikasi token JWT untuk memastikan:

1. Token dibuat menggunakan secret yang benar.
2. Token belum kedaluwarsa.

Jika valid, fungsi ini mengembalikan payload dari JWT (misalnya `{ data, iat, exp, ... }`).

## Catatan Penting

- **Keamanan Key dan Salt**: Pastikan untuk menggunakan key dan salt yang aman dan tidak membagikannya ke pihak yang tidak berwenang.
- **Sinkronisasi Waktu**: Pastikan server dan client memiliki waktu yang sinkron (berbasis UTC) untuk validasi token yang akurat.
