import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; // Ensure this path is correct
import { ShieldAlert, Lock, Mail, ArrowRight, AlertCircle, User, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        // --- SIGN UP LOGIC ---
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username } // This metadata is used by your SQL trigger
          }
        });
        if (signUpError) throw signUpError;
        alert("Registration successful! You can now log in.");
        setIsRegistering(false);
      } else {
        // --- LOGIN LOGIC ---
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;

        if (data.user) {
          // Fetch the role from your 'profiles' table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          if (profileError) throw profileError;

          // Redirect based on role
          if (profile?.role === 'responder') {
            navigate('/admin');
          } else {
            navigate('/feed');
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (type: 'admin' | 'user') => {
    setIsRegistering(false);
    if (type === 'admin') {
      setEmail('admin@prometeo.com');
      setPassword('admin123');
    } else {
      setEmail('citizen@prometeo.com');
      setPassword('user123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-blue/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 backdrop-blur-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-slate-800 text-emergency-red mb-4">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-400 mt-2">
            {isRegistering ? 'Join the response network' : 'Sign in to coordinate response'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center text-red-400 text-sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 bg-slate-950 border border-slate-700 rounded-lg py-2.5 text-slate-200 focus:ring-2 focus:ring-electric-blue focus:border-transparent placeholder-slate-600"
                  placeholder="Your display name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 bg-slate-950 border border-slate-700 rounded-lg py-2.5 text-slate-200 focus:ring-2 focus:ring-electric-blue focus:border-transparent placeholder-slate-600"
                placeholder="name@agency.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 bg-slate-950 border border-slate-700 rounded-lg py-2.5 text-slate-200 focus:ring-2 focus:ring-electric-blue focus:border-transparent placeholder-slate-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" fullWidth size="lg" disabled={isLoading}>
            {isLoading ? (isRegistering ? 'Creating...' : 'Signing in...') : (isRegistering ? 'Register' : 'Sign In')}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-electric-blue hover:underline"
          >
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-xs text-center text-slate-500 mb-4 uppercase tracking-wider">Quick Fill Demo</p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => fillCredentials('admin')} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-300">
              <strong className="block text-electric-blue">Responder</strong>
              admin@prometeo.com
            </button>
            <button onClick={() => fillCredentials('user')} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-300">
              <strong className="block text-emerald-500">Citizen</strong>
              citizen@prometeo.com
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};