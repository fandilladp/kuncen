
# Kuncen NPM Package

![Rockib Logo](./assets/kuncen.webp)

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

app.post('/generate-token', (req, res) => {
  const token = generateToken(key, salt, 3); // Token berlaku selama 3 menit
  res.json({ token });
});

app.post('/validate-token', (req, res) => {
  const { token } = req.body;
  const isValid = validateToken(token, key, salt);
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
  const token = generateToken(key, salt, 3); // Token berlaku selama 3 menit
  
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

- **generateToken(key, salt, minutes)**: Menghasilkan token enkripsi AES dengan kombinasi key, salt, dan waktu habis.
- **validateToken(encryptedToken, key, salt)**: Memvalidasi token berdasarkan key, salt, dan waktu.

## License

ISC
# kuncen
