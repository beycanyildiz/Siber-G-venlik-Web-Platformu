import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Header } from './components/Header';
import { PasswordAnalyzer } from './components/PasswordAnalyzer';
import { PasswordGenerator } from './components/PasswordGenerator';
import { HashGenerator } from './components/HashGenerator';
import { DashboardStats } from './components/Dashboard/DashboardStats';

function AuthWrapper() {
  const [authMode, setAuthMode] = useState('login');
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <LoginForm onToggleMode={() => setAuthMode('register')} />
    ) : (
      <RegisterForm onToggleMode={() => setAuthMode('login')} />
    );
  }

  return <MainApp />;
}

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PasswordAnalyzer />
              <PasswordGenerator />
            </div>
          </div>
        );
      case 'analyzer':
        return <PasswordAnalyzer />;
      case 'generator':
        return <PasswordGenerator />;
      case 'hash':
        return <HashGenerator />;
      default:
        return <PasswordAnalyzer />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Security Dashboard';
      case 'analyzer':
        return 'Password Security Analyzer';
      case 'generator':
        return 'Secure Password Generator';
      case 'hash':
        return 'Cryptographic Hash Tools';
      default:
        return 'Security Dashboard';
    }
  };

  const getPageDescription = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Monitor your security activities and get insights into your cybersecurity posture';
      case 'analyzer':
        return 'Analyze password strength and security vulnerabilities in real-time';
      case 'generator':
        return 'Generate cryptographically secure passwords with custom parameters';
      case 'hash':
        return 'Generate and verify cryptographic hashes for security applications';
      default:
        return 'Professional cybersecurity tools for security professionals';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{getPageTitle()}</h2>
          <p className="text-slate-400">{getPageDescription()}</p>
        </div>

        {renderActiveTab()}

        {/* Security Tips */}
        <div className="mt-12 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">🔒 Security Best Practices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-emerald-400 font-medium">Password Security</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Use unique passwords for each account</li>
                <li>• Enable two-factor authentication</li>
                <li>• Use a password manager</li>
                <li>• Avoid personal information in passwords</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-blue-400 font-medium">Hash Security</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Use salt with password hashes</li>
                <li>• Prefer SHA-256+ or bcrypt</li>
                <li>• Never use MD5 for passwords</li>
                <li>• Implement key stretching techniques</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">
              © 2025 CyberSec Suite - Professional Security Tools
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>Built with React & Node.js</span>
              <span>•</span>
              <span>Secured by Design</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}

export default App;