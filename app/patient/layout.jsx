'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function PatientLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('opd_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'patient') {
        setUser(parsedUser);
      } else {
        router.push('/doctor');
      }
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('opd_user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/patient' },
    { name: 'Find Doctors', href: '/patient/doctors' },
    { name: 'Appointments', href: '/patient/appointments' },
    { name: 'History', href: '/patient/history' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">O</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">OPD Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-2 ${
                pathname === item.href ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
