'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const patientNavItems = [
    { name: 'Dashboard', href: '/patient', icon: '📊' },
    { name: 'Find Doctors', href: '/patient/doctors', icon: '👨‍⚕️' },
    { name: 'My Appointments', href: '/patient/appointments', icon: '📅' },
    { name: 'History', href: '/patient/history', icon: '📋' },
  ];

  const doctorNavItems = [
    { name: 'Dashboard', href: '/doctor', icon: '📊' },
    { name: 'Patient Queue', href: '/doctor/queue', icon: '👥' },
    { name: 'Availability', href: '/doctor/availability', icon: '🗓️' },
  ];

  const navItems = user?.role === 'doctor' ? doctorNavItems : patientNavItems;

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
      </div>
      <nav className="flex-1 px-4 pb-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
