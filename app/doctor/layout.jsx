'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DoctorLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('opd_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'doctor') {
        setUser(parsedUser);
      } else {
        router.push('/patient');
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/doctor' },
    { name: 'Queue', href: '/doctor/queue' },
    { name: 'Availability', href: '/doctor/availability' },
    { name: 'Profile', href: '/doctor/profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-teal-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                OPD Portal
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden md:block">{user?.name}</span>
              <button onClick={handleLogout} className="btn-secondary text-sm">Sign out</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="hidden lg:flex lg:flex-col w-64 bg-gradient-to-b from-teal-600 to-emerald-700 min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white">Navigation</h2>
          </div>
          <nav className="flex-1 px-4 pb-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  pathname === item.href
                    ? 'bg-white text-teal-700 shadow-lg'
                    : 'text-teal-100 hover:bg-teal-700 hover:text-white'
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

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-teal-600 border-t border-teal-500 z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${
                pathname === item.href ? 'text-white font-semibold' : 'text-teal-200'
              }`}
            >
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
