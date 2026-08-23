'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const patientNavItems = [
    { name: 'Home', href: '/patient', icon: '🏠' },
    { name: 'Doctors', href: '/patient/doctors', icon: '👨‍⚕️' },
    { name: 'Appointments', href: '/patient/appointments', icon: '📅' },
    { name: 'History', href: '/patient/history', icon: '📋' },
  ];

  const doctorNavItems = [
    { name: 'Dashboard', href: '/doctor', icon: '📊' },
    { name: 'Queue', href: '/doctor/queue', icon: '👥' },
    { name: 'Availability', href: '/doctor/availability', icon: '🗓️' },
  ];

  const navItems = user?.role === 'doctor' ? doctorNavItems : patientNavItems;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}