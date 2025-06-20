import React, { useState, useEffect } from 'react';
import { Shield, Hash, Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { analyticsAPI } from '../../services/api';

export function DashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getDashboard();
      setStats(response.data);
    } catch (error) {
      setError('Failed to fetch dashboard statistics');
      console.error('Dashboard stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 animate-pulse">
            <div className="h-4 bg-slate-700 rounded mb-4"></div>
            <div className="h-8 bg-slate-700 rounded mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Password Analyses',
      value: stats?.passwordAnalysis?.total || 0,
      change: '+12%',
      icon: Shield,
      color: 'emerald',
      description: 'Total password security checks'
    },
    {
      title: 'Hash Operations',
      value: stats?.hashOperations?.total || 0,
      change: '+8%',
      icon: Hash,
      color: 'blue',
      description: 'Cryptographic operations performed'
    },
    {
      title: 'Security Events',
      value: stats?.security?.totalEvents || 0,
      change: stats?.security?.highSeverityCount > 0 ? `${stats.security.highSeverityCount} high` : 'All clear',
      icon: Activity,
      color: stats?.security?.highSeverityCount > 0 ? 'red' : 'green',
      description: 'Security monitoring alerts'
    },
    {
      title: 'Security Score',
      value: Math.round(stats?.passwordAnalysis?.averageScore || 0),
      change: 'Good',
      icon: TrendingUp,
      color: 'purple',
      description: 'Average password strength'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const colorClasses = {
          emerald: 'text-emerald-400 bg-emerald-500/20',
          blue: 'text-blue-400 bg-blue-500/20',
          red: 'text-red-400 bg-red-500/20',
          green: 'text-green-400 bg-green-500/20',
          purple: 'text-purple-400 bg-purple-500/20'
        };

        return (
          <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${colorClasses[stat.color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-sm font-medium ${
                stat.change.includes('+') ? 'text-green-400' : 
                stat.change.includes('high') ? 'text-red-400' : 
                'text-slate-400'
              }`}>
                {stat.change}
              </span>
            </div>
            
            <div className="mb-2">
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-300">{stat.title}</p>
            </div>
            
            <p className="text-xs text-slate-400">{stat.description}</p>
          </div>
        );
      })}
    </div>
  );
}