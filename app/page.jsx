'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();

  const stats = [
    { value: '50+', label: 'Specialist Doctors' },
    { value: '10+', label: 'Departments' },
    { value: '5000+', label: 'Patients Served' },
    { value: '24/7', label: 'Online Access' },
  ];

  const features = [
    { title: 'Find Specialists', description: 'Search from 50+ doctors across multiple departments.', color: 'bg-teal-100 text-teal-600', number: '01' },
    { title: 'Book Appointments', description: 'Choose your preferred doctor and time slot online.', color: 'bg-emerald-100 text-emerald-600', number: '02' },
    { title: 'Track Queue', description: 'Know your queue position and estimated wait time.', color: 'bg-cyan-100 text-cyan-600', number: '03' },
    { title: 'Manage OPD', description: 'Doctors can manage availability and patient queue.', color: 'bg-green-100 text-green-600', number: '04' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      
      {/* Animated Gradient Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-teal-300 rounded-full filter blur-3xl opacity-40"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, -40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-300 rounded-full filter blur-3xl opacity-40"
        />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-200 rounded-full filter blur-3xl opacity-30"
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -40, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-teal-400 opacity-50"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </motion.div>

        <motion.div
          animate={{ y: [0, 30, 0], rotate: [0, -180, -360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 text-emerald-400 opacity-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </motion.div>

        <motion.div
          animate={{ y: [0, -30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-60 left-20 text-cyan-400 opacity-60"
        >
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-teal-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  OPD Portal
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => router.push('/login')} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
                  Sign In
                </button>
                <button onClick={() => router.push('/register')} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </nav>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-teal-200">
                <span className="w-2 h-2 bg-teal-600 rounded-full animate-pulse"></span>
                Online OPD Appointment System
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Book Your Doctor
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600"> Appointment </span>
                Online
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Skip the queue and book your OPD appointment from home.
                Find the right specialist, choose your time slot, and track your queue position.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={() => router.push('/login')} 
                  className="px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all"
                >
                  Book Appointment Now
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={() => router.push('/register')} 
                  className="px-8 py-4 bg-white/80 backdrop-blur text-gray-700 border-2 border-teal-200 rounded-xl font-semibold hover:border-teal-400 hover:text-teal-600 transition-all"
                >
                  Register Now
                </motion.button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="hidden lg:block">
              <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 border border-teal-100">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-teal-100">
                    <div>
                      <p className="text-sm text-gray-500">Live OPD Status</p>
                      <p className="text-2xl font-bold text-gray-900">3 Doctors Available</p>
                    </div>
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                      <span className="w-3 h-3 bg-teal-500 rounded-full animate-pulse"></span>
                    </div>
                  </div>
                  {[
                    { name: 'Dr. Priya Sharma', dept: 'Cardiology' },
                    { name: 'Dr. Rajesh Kumar', dept: 'Dermatology' },
                    { name: 'Dr. Anjali Mehta', dept: 'Pediatrics' },
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-teal-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.dept}</p>
                      </div>
                      <span className="text-xs font-medium text-teal-600">Available</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-white/60 backdrop-blur border-y border-teal-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-teal-600">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose OPD Portal?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }} 
                whileHover={{ y: -5 }} 
                className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-teal-100 shadow-sm hover:shadow-xl transition-shadow"
              >
                <p className="text-4xl font-bold text-teal-100 mb-4">{feature.number}</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl shadow-teal-500/30">
            <h2 className="text-3xl font-bold mb-4">Ready to Book Your Appointment?</h2>
            <p className="text-teal-100 mb-8 max-w-xl mx-auto">Join thousands of patients who book their OPD appointments online.</p>
            <button onClick={() => router.push('/register')} className="px-8 py-4 bg-white text-teal-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
              Get Started Now
            </button>
          </div>
        </section>

        <footer className="bg-teal-900 text-white py-8">
          <div className="text-center">
            <p className="text-teal-200">2026 OPD Portal. All rights reserved.</p>
            <p className="text-teal-400 text-sm mt-2">Doctor Appointment & OPD Management System</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
