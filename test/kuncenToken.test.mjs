
import { generateToken, validateToken } from '../index.mjs';
import { expect } from 'chai';

describe('Kuncen Package', () => {
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
