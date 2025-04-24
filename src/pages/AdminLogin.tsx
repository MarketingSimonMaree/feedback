import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AngularButton from '../components/AngularButton';

const AdminLogin: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error } = await login(email, password);
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <motion.div 
        className="max-w-md w-full bg-white shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-black text-white p-6 flex items-center justify-center">
          <Lock className="mr-2" size={24} />
          <h1 className="text-xl font-bold">Admin Login</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 mb-4">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 focus:border-black focus:outline-none"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 focus:border-black focus:outline-none"
              required
              disabled={isLoading}
            />
          </div>
          
          <AngularButton
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </AngularButton>
        </form>
      </motion.div>
      
      <p className="mt-4 text-gray-600 text-sm">
        Access to Simon Maree admin dashboard
      </p>
    </div>
  );
};

export default AdminLogin;