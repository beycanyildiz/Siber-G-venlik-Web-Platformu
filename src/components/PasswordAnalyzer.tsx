import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Copy, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { analyzePassword } from '../utils/passwordAnalyzer';
import { PasswordAnalysis } from '../types';

export function PasswordAnalyzer() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (password) {
      setAnalysis(analyzePassword(password));
    } else {
      setAnalysis(null);
    }
  }, [password]);

  const copyToClipboard = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Very Weak': return 'text-red-400 bg-red-500/10';
      case 'Weak': return 'text-orange-400 bg-orange-500/10';
      case 'Fair': return 'text-yellow-400 bg-yellow-500/10';
      case 'Good': return 'text-blue-400 bg-blue-500/10';
      case 'Strong': return 'text-green-400 bg-green-500/10';
      case 'Very Strong': return 'text-emerald-400 bg-emerald-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getScoreBarColor = (score: number) => {
    if (score < 20) return 'bg-red-500';
    if (score < 40) return 'bg-orange-500';
    if (score < 60) return 'bg-yellow-500';
    if (score < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-emerald-400" />
        <h2 className="text-xl font-semibold text-white">Password Analyzer</h2>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password to analyze..."
            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 pr-20 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors font-mono"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {password && (
              <button
                onClick={copyToClipboard}
                className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {analysis && (
          <div className="space-y-6">
            {/* Strength Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`rounded-lg p-4 ${getStrengthColor(analysis.strength)}`}>
                <div className="text-sm font-medium opacity-80">Strength</div>
                <div className="text-lg font-bold">{analysis.strength}</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="text-sm font-medium text-slate-300">Entropy</div>
                <div className="text-lg font-bold text-white">{analysis.entropy.toFixed(1)} bits</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="text-sm font-medium text-slate-300">Crack Time</div>
                <div className="text-lg font-bold text-white">{analysis.estimatedTime}</div>
              </div>
            </div>

            {/* Score Bar */}
            <div>
              <div className="flex justify-between text-sm text-slate-300 mb-2">
                <span>Password Score</span>
                <span>{analysis.score}/100</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${getScoreBarColor(analysis.score)}`}
                  style={{ width: `${Math.min(analysis.score, 100)}%` }}
                />
              </div>
            </div>

            {/* Character Types */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className={`flex items-center gap-2 p-3 rounded-lg ${analysis.hasLowercase ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {analysis.hasLowercase ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span className="text-sm">Lowercase</span>
              </div>
              <div className={`flex items-center gap-2 p-3 rounded-lg ${analysis.hasUppercase ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {analysis.hasUppercase ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span className="text-sm">Uppercase</span>
              </div>
              <div className={`flex items-center gap-2 p-3 rounded-lg ${analysis.hasNumbers ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {analysis.hasNumbers ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span className="text-sm">Numbers</span>
              </div>
              <div className={`flex items-center gap-2 p-3 rounded-lg ${analysis.hasSpecialChars ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {analysis.hasSpecialChars ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span className="text-sm">Special</span>
              </div>
            </div>

            {/* Feedback */}
            {analysis.feedback.length > 0 && (
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-white">Recommendations</span>
                </div>
                <ul className="space-y-1">
                  {analysis.feedback.map((item, index) => (
                    <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-yellow-400 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Common Patterns */}
            {analysis.commonPatterns.length > 0 && (
              <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-red-400">Security Issues</span>
                </div>
                <ul className="space-y-1">
                  {analysis.commonPatterns.map((pattern, index) => (
                    <li key={index} className="text-sm text-red-300 flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span>
                      {pattern}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}