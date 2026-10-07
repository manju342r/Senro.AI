import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Target, Eye, EyeOff } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const AuthScreen = ({ isLogin }: { isLogin: boolean }) => {
  const navigate = useNavigate();
  const { supabase } = useData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      alert('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Error sending password reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      localStorage.setItem('userEmail', email);
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // On successful signup, push them to the onboarding wizard
        navigate('/onboarding/step-1');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-content flex items-center justify-center p-6 sm:p-8">
      <div className="w-full max-w-md space-y-8 bg-surface p-8 sm:p-10 rounded-2xl border border-line shadow-2xl">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-content p-2.5 rounded-xl shadow-md">
              <Target size={24} className="text-canvas" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-content">Senro.AI</h1>
          </div>
          <h2 className="text-xl font-semibold text-content tracking-tight">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
        </div>
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">Email address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-canvas border border-line rounded-lg p-3 text-content focus:border-content focus:outline-none focus:ring-1 focus:ring-content transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                minLength={8} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-canvas border border-line rounded-lg p-3 pr-10 text-content focus:border-content focus:outline-none focus:ring-1 focus:ring-content transition-all" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-content transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {isLogin && (
              <div className="flex justify-end mt-2">
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="text-xs text-muted hover:text-content font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-content text-canvas hover:opacity-90 disabled:opacity-50 font-semibold py-3 rounded-lg transition-all mt-6 shadow-md">
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <p className="text-center text-sm text-muted">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link to={isLogin ? "/signup" : "/login"} className="text-content hover:underline font-semibold transition-colors">
            {isLogin ? "Sign up" : "Log in"}
          </Link>
        </p>
      </div>
    </div>
  );
};


export default AuthScreen;
