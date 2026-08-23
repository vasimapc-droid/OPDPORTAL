'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">OPD Portal</h2>
          <p className="mt-2 text-sm text-gray-600">
            Doctor Appointment & OPD Management System
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login as
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange('patient')}
                className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                  role === 'patient'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('doctor')}
                className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                  role === 'doctor'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Doctor
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
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
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium">Patient:</p>
                <p>patient@example.com</p>
                <p>patient123</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium">Doctor:</p>
                <p>doctor@example.com</p>
                <p>doctor123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
