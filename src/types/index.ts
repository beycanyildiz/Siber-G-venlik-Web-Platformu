export interface PasswordAnalysis {
  score: number;
  entropy: number;
  strength: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  feedback: string[];
  estimatedTime: string;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSpecialChars: boolean;
  length: number;
  commonPatterns: string[];
}

export interface GeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSpecialChars: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

export interface HashResult {
  original: string;
  md5: string;
  sha256: string;
  sha512: string;
  bcrypt: string;
}