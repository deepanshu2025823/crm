// components/HeroSection.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Introducing Manee AI 2.0
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
            The First Autonomous <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              AI Operating System.
            </span>
          </h1>

          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Career Lab Consulting replaces manual work with autonomous agents. 
            Deploy <strong className="text-slate-900">Manee</strong>, <strong className="text-slate-900">EduX</strong>, and <strong className="text-slate-900">CRM</strong> to run your business on autopilot.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2">
              Explore The OS <ArrowRight size={18} />
            </button>
            <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all">
              Watch Demo
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}