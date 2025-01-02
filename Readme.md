# Kuncen NPM Package

`kuncen` is an NPM package designed to generate and validate dynamic tokens using AES encryption and expiration time. It provides a secure and efficient way to manage token-based authentication for both backend and frontend applications.

![kuncen Logo](./assets/kuncen.webp)

## Installation

To install this package, use npm or yarn:

```js
npm install kuncen

or

Usage
1. In Express (Backend)
You can use this package in an Express.js application to generate and validate tokens.

Example Code in Express:

const express = require('express');
const { generateToken, validateToken } = require('kuncen');

const app = express();
const key = 'your-secret-key';
const salt = 'your-salt-value';

app.use(express.json());

app.post('/generate-token', (req, res) => {
  const token = generateToken(key, salt, 3); // Token valid for 3 minutes (UTC)
  res.json({ token });
});

app.post('/validate-token', (req, res) => {
  const { token } = req.body;
  const isValid = validateToken(token, key, salt); // Validation without time parameter
  res.json({ valid: isValid });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

2. In React (Frontend)
In a React application, you can use this package to generate tokens before sending requests to the backend.

Example Code in React:


```js
import { generateToken } from 'kuncen';

const key = 'your-secret-key';
const salt = 'your-salt-value';

function sendRequest() {
  const token = generateToken(key, salt, 3); // Token valid for 3 minutes (UTC)

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
        console.log('Token is valid');
      } else {
        console.log('Token is not valid');
      }
    });
}
```
Features
generateToken(key, salt, minutes): Generates an AES encrypted token with a combination of key, salt, and expiration time.
validateToken(encryptedToken, key, salt): Validates the token based on key, salt, and time.
generateJwtToken(key, salt, data, minutes): Generates a JWT token using HS256 with key and salt as the secret.
validateJwtToken(token, key, salt): Validates the JWT and returns the payload if valid.
encryptPayload(payload, key, salt): Encrypts the payload using AES-256-CBC algorithm.
decryptPayload(encryptedPayload, key, salt): Decrypts the encrypted payload using AES-256-CBC algorithm.
Explanation of New Features
Generate Token Function (Custom AES-256-CBC)
This function uses the AES-256-CBC algorithm to encrypt data with the format:

Token Format: IV (hex) : Encrypted DATA (hex)
The encrypted data is a combination of key.salt.expiryTime.
Validate Token Function (Custom AES-256-CBC)
This function decrypts the AES-256-CBC token to check:

Whether the key (key) and salt (salt) match.
Whether the token has expired based on expiryTime.
Generate JWT Function
Generates a JWT token using the combination of key + salt as the secret and the HS256 algorithm.

Supports storing additional payload/data.
Expiration time format can be set in minutes, e.g., 10m or 60m.
Validate JWT Function
Verifies the JWT token to ensure:

The token was created using the correct secret.
The token has not expired.
If valid, this function returns the payload from the JWT (e.g., { data, iat, exp, ... }).

Encrypt Payload Function (Custom AES-256-CBC)
This function encrypts the payload using the AES-256-CBC algorithm with the format:

Encryption Format: IV (hex) : Encrypted DATA (hex)
The encrypted data is a JSON string of the payload.
Decrypt Payload Function (Custom AES-256-CBC)
This function decrypts the encrypted payload using the AES-256-CBC algorithm to check:

Whether the key (key) and salt (salt) match.
Returns the original payload as a JSON object.
Important Notes
Key and Salt Security: Ensure to use secure key and salt values and do not share them with unauthorized parties.
Time Synchronization: Ensure the server and client have synchronized time (UTC-based) for accurate token validation.

