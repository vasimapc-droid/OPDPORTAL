'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('patient@example.com');
  const [password, setPassword] = useState('patient123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    if (newRole === 'patient') {
      setEmail('patient@example.com');
      setPassword('patient123');
    } else {
      setEmail('doctor@example.com');
      setPassword('doctor123');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (role === 'patient' && email === 'patient@example.com' && password === 'patient123') {
        localStorage.setItem('opd_user', JSON.stringify({
          id: 'PAT001',
          name: 'Patient User',
          email: 'patient@example.com',
          role: 'patient',
        }));
        router.push('/patient');
      } else if (role === 'doctor' && email === 'doctor@example.com' && password === 'doctor123') {
        localStorage.setItem('opd_user', JSON.stringify({
          id: 'DOC001',
          name: 'Dr. Priya Sharma',
          email: 'doctor@example.com',
          role: 'doctor',
        }));
        router.push('/doctor');
      } else {
        setError('Invalid email or password');
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl mb-4 shadow-lg shadow-teal-500/30"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your OPD Portal account</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-xl shadow-teal-100/50 sm:rounded-2xl sm:px-10 border border-teal-100">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Login as</label>
            <div className="grid grid-cols-2 gap-3 bg-teal-50 p-1 rounded-xl">
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRoleChange('patient')}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  role === 'patient'
                    ? 'bg-white shadow-md text-teal-700'
                    : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                Patient
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRoleChange('doctor')}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  role === 'doctor'
                    ? 'bg-white shadow-md text-teal-700'
                    : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                Doctor
              </motion.button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field mt-1"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field mt-1"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-3"
              >
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-teal-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                <p className="font-medium text-teal-800">Patient:</p>
                <p className="text-gray-600">patient@example.com / patient123</p>
              </div>
              <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                <p className="font-medium text-teal-800">Doctor:</p>
                <p className="text-gray-600">doctor@example.com / doctor123</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => router.push('/register')}
                className="text-teal-600 font-medium hover:text-teal-700"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
