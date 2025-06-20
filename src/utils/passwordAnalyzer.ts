import { PasswordAnalysis } from '../types';

const commonPasswords = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master'
];

const commonPatterns = [
  { regex: /(.)\1{2,}/, message: 'Contains repeated characters' },
  { regex: /123|234|345|456|567|678|789|890/, message: 'Contains sequential numbers' },
  { regex: /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i, message: 'Contains sequential letters' },
  { regex: /qwer|asdf|zxcv|hjkl/i, message: 'Contains keyboard patterns' }
];

export function analyzePassword(password: string): PasswordAnalysis {
  const analysis: PasswordAnalysis = {
    score: 0,
    entropy: 0,
    strength: 'Very Weak',
    feedback: [],
    estimatedTime: '',
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    length: password.length,
    commonPatterns: []
  };

  // Length scoring
  if (password.length < 6) {
    analysis.feedback.push('Password too short (minimum 6 characters)');
  } else if (password.length < 8) {
    analysis.score += 10;
    analysis.feedback.push('Consider using at least 8 characters');
  } else if (password.length < 12) {
    analysis.score += 20;
  } else if (password.length < 16) {
    analysis.score += 30;
  } else {
    analysis.score += 40;
  }

  // Character type scoring
  let charsetSize = 0;
  if (analysis.hasLowercase) {
    charsetSize += 26;
    analysis.score += 5;
  } else {
    analysis.feedback.push('Add lowercase letters');
  }

  if (analysis.hasUppercase) {
    charsetSize += 26;
    analysis.score += 5;
  } else {
    analysis.feedback.push('Add uppercase letters');
  }

  if (analysis.hasNumbers) {
    charsetSize += 10;
    analysis.score += 5;
  } else {
    analysis.feedback.push('Add numbers');
  }

  if (analysis.hasSpecialChars) {
    charsetSize += 32;
    analysis.score += 10;
  } else {
    analysis.feedback.push('Add special characters (!@#$%^&*)');
  }

  // Calculate entropy
  analysis.entropy = password.length * Math.log2(charsetSize);

  // Check for common passwords
  if (commonPasswords.includes(password.toLowerCase())) {
    analysis.score = Math.min(analysis.score, 10);
    analysis.feedback.push('This is a commonly used password');
  }

  // Check for patterns
  commonPatterns.forEach(pattern => {
    if (pattern.regex.test(password)) {
      analysis.score -= 10;
      analysis.commonPatterns.push(pattern.message);
    }
  });

  // Determine strength
  if (analysis.score < 20) {
    analysis.strength = 'Very Weak';
    analysis.estimatedTime = 'Instantly';
  } else if (analysis.score < 40) {
    analysis.strength = 'Weak';
    analysis.estimatedTime = 'Minutes';
  } else if (analysis.score < 60) {
    analysis.strength = 'Fair';
    analysis.estimatedTime = 'Hours';
  } else if (analysis.score < 80) {
    analysis.strength = 'Good';
    analysis.estimatedTime = 'Days';
  } else if (analysis.score < 100) {
    analysis.strength = 'Strong';
    analysis.estimatedTime = 'Years';
  } else {
    analysis.strength = 'Very Strong';
    analysis.estimatedTime = 'Centuries';
  }

  // Ensure minimum feedback
  if (analysis.feedback.length === 0 && analysis.score >= 80) {
    analysis.feedback.push('Excellent password strength!');
  }

  return analysis;
}

export function calculateCrackTime(entropy: number): string {
  const guessesPerSecond = 1e9; // Assume 1 billion guesses per second
  const possibleCombinations = Math.pow(2, entropy);
  const averageGuesses = possibleCombinations / 2;
  const secondsToCrack = averageGuesses / guessesPerSecond;

  if (secondsToCrack < 1) return 'Instantly';
  if (secondsToCrack < 60) return `${Math.round(secondsToCrack)} seconds`;
  if (secondsToCrack < 3600) return `${Math.round(secondsToCrack / 60)} minutes`;
  if (secondsToCrack < 86400) return `${Math.round(secondsToCrack / 3600)} hours`;
  if (secondsToCrack < 31536000) return `${Math.round(secondsToCrack / 86400)} days`;
  if (secondsToCrack < 31536000000) return `${Math.round(secondsToCrack / 31536000)} years`;
  return 'Centuries';
}