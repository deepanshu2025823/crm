// components/SocialProof.tsx
import { CheckCircle2, Globe2, ShieldCheck, Zap } from 'lucide-react';

export default function SocialProof() {
  return (
    <section className="border-y border-slate-100 bg-slate-50/50 py-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by Forward-Thinking Institutions</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="text-xl font-bold text-slate-800 flex items-center gap-2"><Globe2 size={24} className="text-blue-600"/> GlobalTech</div>
          <div className="text-xl font-bold text-slate-800 flex items-center gap-2"><Zap size={24} className="text-yellow-500"/> EduFuture</div>
          <div className="text-xl font-bold text-slate-800 flex items-center gap-2"><ShieldCheck size={24} className="text-purple-600"/> SecureCorp</div>
          <div className="text-xl font-bold text-slate-800 flex items-center gap-2"><CheckCircle2 size={24} className="text-emerald-600"/> VerifyU</div>
        </div>
      </div>
    </section>
  );
}