"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = ['Products', 'Solutions', 'Enterprise', 'Pricing'];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
              <img 
                src="https://www.careerlabconsulting.com/favicon.ico" 
                alt="CLC Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight leading-none group-hover:text-blue-600 transition-colors">
              Career Lab Consulting
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            {navLinks.map((item) => (
              <Link key={item} href="#" className="hover:text-blue-600 transition-colors">
                {item}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Log in
            </Link>
            <Link href="/register">
              <button className="text-sm font-medium bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95">
                Get Started
              </button>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 w-full bg-white border-b border-slate-200 z-40 md:hidden shadow-xl"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((item) => (
                <Link 
                  key={item} 
                  href="#" 
                  className="text-base font-medium text-slate-700 hover:text-blue-600 py-2 border-b border-slate-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <div className="flex flex-col gap-3 mt-4">
                <Link 
                  href="/login" 
                  className="text-center text-sm font-medium text-slate-600 py-2 border border-slate-200 rounded-xl hover:bg-slate-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                   <button className="text-sm font-medium bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800 shadow-lg w-full">
                     Get Started
                   </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}