'use client';

import { useState } from 'react';
import { authenticateUser } from '@/actions/dbActions';
import { useAuth } from '@/context/AuthContext';
import { Building2 } from 'lucide-react';

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Auto-seed on first login attempt if DB is empty
    await fetch('/api/seed');
    
    try {
      const user = await authenticateUser(username, password);
      if (user) {
        // @ts-ignore
        login(user);
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
      <div className="mb-8 text-center">
        <div className="bg-blue-600 p-4 rounded-full inline-block mb-4">
          <Building2 className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Go2Roofing Command</h1>
        <p className="text-slate-500 mt-2">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
          <input 
            type="text" 
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-8 text-xs text-slate-500 text-center space-y-1">
        <p><strong>Employee:</strong> EMP1 / EMP123</p>
        <p><strong>Contractor:</strong> Cont1 / Cont1</p>
      </div>
    </div>
  );
}
