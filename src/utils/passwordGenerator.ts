import { GeneratorOptions } from '../types';

const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const similarChars = 'il1Lo0O';
const ambiguousChars = '{}[]()/\\\'"`~,;.<>';

export function generatePassword(options: GeneratorOptions): string {
  let charset = '';
  
  if (options.includeUppercase) charset += uppercase;
  if (options.includeLowercase) charset += lowercase;
  if (options.includeNumbers) charset += numbers;
  if (options.includeSpecialChars) charset += specialChars;

  // Remove similar/ambiguous characters if requested
  if (options.excludeSimilar || options.excludeAmbiguous) {
    const toExclude = (options.excludeSimilar ? similarChars : '') + 
                     (options.excludeAmbiguous ? ambiguousChars : '');
    charset = charset.split('').filter(char => !toExclude.includes(char)).join('');
  }

  if (!charset) {
    throw new Error('No character types selected');
  }

  // Generate password
  let password = '';
  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);

  for (let i = 0; i < options.length; i++) {
    password += charset[array[i] % charset.length];
  }

  // Ensure at least one character from each selected type
  let requiredChars = '';
  if (options.includeUppercase) requiredChars += getRandomChar(uppercase, options);
  if (options.includeLowercase) requiredChars += getRandomChar(lowercase, options);
  if (options.includeNumbers) requiredChars += getRandomChar(numbers, options);
  if (options.includeSpecialChars) requiredChars += getRandomChar(specialChars, options);

  // Replace random positions with required characters
  if (requiredChars.length > 0) {
    const positions = new Set<number>();
    while (positions.size < Math.min(requiredChars.length, options.length)) {
      positions.add(Math.floor(Math.random() * options.length));
    }
    
    const posArray = Array.from(positions);
    for (let i = 0; i < requiredChars.length && i < posArray.length; i++) {
      password = password.substring(0, posArray[i]) + 
                requiredChars[i] + 
                password.substring(posArray[i] + 1);
    }
  }

  return password;
}

function getRandomChar(charset: string, options: GeneratorOptions): string {
  let filteredCharset = charset;
  
  if (options.excludeSimilar) {
    filteredCharset = filteredCharset.split('').filter(char => !similarChars.includes(char)).join('');
  }
  if (options.excludeAmbiguous) {
    filteredCharset = filteredCharset.split('').filter(char => !ambiguousChars.includes(char)).join('');
  }
  
  return filteredCharset[Math.floor(Math.random() * filteredCharset.length)];
}

export function generateMultiplePasswords(options: GeneratorOptions, count: number): string[] {
  const passwords: string[] = [];
  for (let i = 0; i < count; i++) {
    passwords.push(generatePassword(options));
  }
  return passwords;
}