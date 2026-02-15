// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
      } else {
        router.push("/login?success=true");
      }
    } catch (err) {
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
            <UserPlus className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Request Access</h1>
          <p className="text-slate-400 text-sm mt-2">Join the Career Lab Ecosystem.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-3.5 text-slate-500 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="text" 
                placeholder="John Doe"
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-slate-600"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Email Identity</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-slate-500 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="email" 
                placeholder="name@company.com"
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-slate-600"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Create Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-slate-500 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-slate-600"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-purple-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 mt-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Already have access? <Link href="/login" className="text-purple-400 hover:text-purple-300 hover:underline transition-colors">Login Here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}