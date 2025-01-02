import {
  generateToken,
  validateToken,
  generateJwtToken,
  validateJwtToken,
} from '../index.mjs';
import { expect } from 'chai';

describe('Kuncen Package (Custom AES-256-CBC)', () => {
  const key = 'test-key';
  const salt = 'test-salt';
  const expiryMinutes = 1;

  it('should generate a valid token', () => {
    const token = generateToken(key, salt, expiryMinutes);
    expect(token).to.be.a('string');
    expect(token.length).to.be.greaterThan(0);
  });

  it('should validate a valid token within expiry time', () => {
    const token = generateToken(key, salt, expiryMinutes);
    const isValid = validateToken(token, key, salt);
    expect(isValid).to.be.true;
  });

  it('should not validate an expired token', function (done) {
    this.timeout(5000); // Set timeout to 5 seconds

    const token = generateToken(key, salt, 0); // Token expired immediately
    setTimeout(() => {
      const isValid = validateToken(token, key, salt);
      expect(isValid).to.be.false;
      done(); // Ensure done() is called to end async test
    }, 3000); // Wait 3 seconds to simulate token expiration
  });

  it('should not validate a token with incorrect key', () => {
    const token = generateToken(key, salt, expiryMinutes);
    const isValid = validateToken(token, 'wrong-key', salt);
    expect(isValid).to.be.false;
  });

  it('should not validate a token with incorrect salt', () => {
    const token = generateToken(key, salt, expiryMinutes);
    const isValid = validateToken(token, key, 'wrong-salt');
    expect(isValid).to.be.false;
  });
});

describe('Kuncen Package (JWT)', () => {
  const key = 'test-key';
  const salt = 'test-salt';
  const expiryMinutes = 1;
  const sampleData = { userId: 123, role: 'admin' };

  it('should generate a valid JWT token', () => {
    const token = generateJwtToken(key, salt, sampleData, expiryMinutes);
    expect(token).to.be.a('string');
    expect(token.length).to.be.greaterThan(0);
  });

  it('should validate a valid JWT token within expiry time', () => {
    const token = generateJwtToken(key, salt, sampleData, expiryMinutes);
    const decoded = validateJwtToken(token, key, salt);

    // decoded seharusnya mengembalikan object payload
    expect(decoded).to.be.an('object');
    expect(decoded).to.have.property('data');
    expect(decoded.data).to.deep.equal(sampleData);
  });

  it('should not validate an expired JWT token', function (done) {
    this.timeout(5000);
    // Menggenerate token yang langsung expired
    const token = generateJwtToken(key, salt, sampleData, 0);

    // Tunggu 3 detik lalu cek apakah sudah tidak valid
    setTimeout(() => {
      const decoded = validateJwtToken(token, key, salt);
      expect(decoded).to.be.false;
      done();
    }, 3000);
  });

  it('should not validate a JWT token with incorrect key', () => {
    const token = generateJwtToken(key, salt, sampleData, expiryMinutes);
    const decoded = validateJwtToken(token, 'wrong-key', salt);
    expect(decoded).to.be.false;
  });

  it('should not validate a JWT token with incorrect salt', () => {
    const token = generateJwtToken(key, salt, sampleData, expiryMinutes);
    const decoded = validateJwtToken(token, key, 'wrong-salt');
    expect(decoded).to.be.false;
  });
});
