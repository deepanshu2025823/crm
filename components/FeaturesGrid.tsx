// components/FeaturesGrid.tsx
'use client';

import { motion } from 'framer-motion';
import { Globe2, ShieldCheck, Zap } from 'lucide-react';

const features = [
  {
    icon: <Zap size={24} />,
    title: "Manee AI",
    desc: "Your Autonomous 'PRO'. She handles emails, chats, and calls 24/7 with human-like memory.",
    color: "blue"
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "EduX Security",
    desc: "Military-grade exam proctoring with 'Prison Mode' security. Zero cheating, 100% integrity.",
    color: "purple"
  },
  {
    icon: <Globe2 size={24} />,
    title: "Autonomous CRM",
    desc: "Deep data enrichment. The system finds the lead's photo, location, and job before you even say hello.",
    color: "indigo"
  }
];

export default function FeaturesGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">One OS. Infinite Possibilities.</h2>
          <p className="text-slate-600 mt-4 text-lg">The only platform that combines Education, Sales, and Support into one brain.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -8 }}
              className={`p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-2xl transition-all group cursor-pointer ${
                feature.color === 'blue' ? 'hover:border-blue-100 hover:shadow-blue-900/5' : 
                feature.color === 'purple' ? 'hover:border-purple-100 hover:shadow-purple-900/5' : 
                'hover:border-indigo-100 hover:shadow-indigo-900/5'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                 feature.color === 'blue' ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 
                 feature.color === 'purple' ? 'bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white' : 
                 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
              }`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}