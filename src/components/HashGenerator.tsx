import React, { useState } from 'react';
import { Hash, Copy, CheckCircle } from 'lucide-react';
import { generateHashes, verifyHash } from '../utils/hashGenerator';
import { HashResult } from '../types';

export function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<HashResult | null>(null);
  const [verificationInput, setVerificationInput] = useState('');
  const [verificationHash, setVerificationHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleGenerate = () => {
    if (input.trim()) {
      setHashes(generateHashes(input));
    }
  };

  const handleVerify = () => {
    const result = verifyHash(verificationInput, verificationHash, 'sha256');
    setVerificationResult(result);
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedHash(type);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center gap-3 mb-6">
        <Hash className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-semibold text-white">Hash Generator</h2>
      </div>

      <div className="space-y-6">
        {/* Hash Generation */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Input Text
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to hash..."
              className="flex-1 bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-colors"
            />
            <button
              onClick={handleGenerate}
              disabled={!input.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Generate
            </button>
          </div>
        </div>

        {/* Hash Results */}
        {hashes && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300">Generated Hashes</h3>
            
            {[
              { label: 'MD5', value: hashes.md5, type: 'md5' },
              { label: 'SHA-256', value: hashes.sha256, type: 'sha256' },
              { label: 'SHA-512', value: hashes.sha512, type: 'sha512' },
              { label: 'Bcrypt (simulated)', value: hashes.bcrypt, type: 'bcrypt' }
            ].map(({ label, value, type }) => (
              <div key={type} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-400">{label}</span>
                  <button
                    onClick={() => copyToClipboard(value, type)}
                    className="p-2 text-slate-400 hover:text-purple-400 transition-colors"
                  >
                    {copiedHash === type ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <code className="text-xs font-mono text-slate-300 break-all block bg-slate-800/50 p-2 rounded">
                  {value}
                </code>
              </div>
            ))}
          </div>
        )}

        {/* Hash Verification */}
        <div className="border-t border-slate-700 pt-6">
          <h3 className="text-sm font-medium text-slate-300 mb-4">Hash Verification</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Original Text
              </label>
              <input
                type="text"
                value={verificationInput}
                onChange={(e) => setVerificationInput(e.target.value)}
                placeholder="Enter original text..."
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Hash to Verify (SHA-256)
              </label>
              <input
                type="text"
                value={verificationHash}
                onChange={(e) => setVerificationHash(e.target.value)}
                placeholder="Enter hash to verify..."
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-colors font-mono"
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={!verificationInput.trim() || !verificationHash.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Verify Hash
            </button>

            {verificationResult !== null && (
              <div className={`p-4 rounded-lg flex items-center gap-3 ${
                verificationResult 
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  {verificationResult ? 'Hash verification successful!' : 'Hash verification failed!'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}