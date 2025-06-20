import CryptoJS from 'crypto-js';
import { HashResult } from '../types';

export function generateHashes(input: string): HashResult {
  return {
    original: input,
    md5: CryptoJS.MD5(input).toString(),
    sha256: CryptoJS.SHA256(input).toString(),
    sha512: CryptoJS.SHA512(input).toString(),
    bcrypt: generateBcryptLike(input) // Simulated bcrypt for demo
  };
}

// Simulated bcrypt-like hash for demo purposes
function generateBcryptLike(input: string): string {
  const salt = CryptoJS.lib.WordArray.random(16).toString();
  const hash = CryptoJS.PBKDF2(input, salt, { keySize: 256/32, iterations: 4096 }).toString();
  return `$2b$12$${salt.substring(0, 22)}${hash.substring(0, 31)}`;
}

export function verifyHash(input: string, hash: string, type: string): boolean {
  switch (type.toLowerCase()) {
    case 'md5':
      return CryptoJS.MD5(input).toString() === hash;
    case 'sha256':
      return CryptoJS.SHA256(input).toString() === hash;
    case 'sha512':
      return CryptoJS.SHA512(input).toString() === hash;
    default:
      return false;
  }
}