import React, { useState } from 'react';
import { Key, Copy, RefreshCw, CheckCircle, Settings } from 'lucide-react';
import { generatePassword, generateMultiplePasswords } from '../utils/passwordGenerator';
import { GeneratorOptions } from '../types';
import { analyzePassword } from '../utils/passwordAnalyzer';

export function PasswordGenerator() {
  const [options, setOptions] = useState<GeneratorOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecialChars: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  });

  const [generatedPasswords, setGeneratedPasswords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleGenerate = (count: number = 1) => {
    try {
      const passwords = generateMultiplePasswords(options, count);
      setGeneratedPasswords(passwords);
    } catch (error) {
      console.error('Generation error:', error);
    }
  };

  const copyToClipboard = async (password: string, index: number) => {
    await navigator.clipboard.writeText(password);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const updateOption = (key: keyof GeneratorOptions, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Key className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Password Generator</h2>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-slate-900/50 rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Length: {options.length}
              </label>
              <input
                type="range"
                min="4"
                max="64"
                value={options.length}
                onChange={(e) => updateOption('length', parseInt(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>4</span>
                <span>64</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeUppercase}
                  onChange={(e) => updateOption('includeUppercase', e.target.checked)}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Uppercase (A-Z)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeLowercase}
                  onChange={(e) => updateOption('includeLowercase', e.target.checked)}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Lowercase (a-z)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeNumbers}
                  onChange={(e) => updateOption('includeNumbers', e.target.checked)}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Numbers (0-9)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeSpecialChars}
                  onChange={(e) => updateOption('includeSpecialChars', e.target.checked)}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Special (!@#$)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.excludeSimilar}
                  onChange={(e) => updateOption('excludeSimilar', e.target.checked)}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Exclude Similar (il1Lo0O)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.excludeAmbiguous}
                  onChange={(e) => updateOption('excludeAmbiguous', e.target.checked)}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Exclude Ambiguous</span>
              </label>
            </div>
          </div>
        )}

        {/* Generate Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => handleGenerate(1)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Generate Password
          </button>
          <button
            onClick={() => handleGenerate(5)}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Generate 5
          </button>
        </div>

        {/* Generated Passwords */}
        {generatedPasswords.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-300">Generated Passwords</h3>
            {generatedPasswords.map((password, index) => {
              const analysis = analyzePassword(password);
              return (
                <div key={index} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600/50">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm font-mono text-white break-all flex-1 mr-4">
                      {password}
                    </code>
                    <button
                      onClick={() => copyToClipboard(password, index)}
                      className="p-2 text-slate-400 hover:text-emerald-400 transition-colors flex-shrink-0"
                    >
                      {copiedIndex === index ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className={`px-2 py-1 rounded ${
                      analysis.strength === 'Very Strong' ? 'bg-emerald-500/20 text-emerald-400' :
                      analysis.strength === 'Strong' ? 'bg-green-500/20 text-green-400' :
                      analysis.strength === 'Good' ? 'bg-blue-500/20 text-blue-400' :
                      analysis.strength === 'Fair' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {analysis.strength}
                    </span>
                    <span className="text-slate-400">
                      Entropy: {analysis.entropy.toFixed(1)} bits
                    </span>
                    <span className="text-slate-400">
                      Crack time: {analysis.estimatedTime}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}