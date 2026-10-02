import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Eye, EyeOff } from 'lucide-react';
import { useData } from '../contexts/DataContext';

// --- AUTHENTICATION VIEWS (Strictly Email/Password) ---
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

export default AuthScreen;
