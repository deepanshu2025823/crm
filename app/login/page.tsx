// app/login/page.tsx

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, KeyRound, X } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  
  const [show2FA, setShow2FA] = useState(false);
  const [otpToken, setOtpToken] = useState("");
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (res?.error) {
        setError("Access Denied: Invalid Credentials");
        setLoading(false);
      } else {
        setShow2FA(true);
        setLoading(false);
      }
    } catch (err) {
      setError("System Error. Please try again.");
      setLoading(false);
    }
  };

  const handle2FAVerify = async () => {
    if (otpToken.length !== 6) return;
    setIsVerifying2FA(true);
    
    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: otpToken })
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError("Invalid Neural Code. Access Revoked.");
        setShow2FA(false); 
        setOtpToken("");
      }
    } catch (err) {
      setError("Verification failed.");
    } finally {
      setIsVerifying2FA(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl"
      >
        <AnimatePresence mode="wait">
          {!show2FA ? (
            <motion.div key="login" exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                  <Lock className="text-white w-8 h-8" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight uppercase">System Access</h1>
                <p className="text-slate-400 text-sm mt-2">Enter credentials to unlock the OS.</p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-xs text-center font-bold uppercase tracking-widest">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Email Identity</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                    <input 
                      type="email" 
                      placeholder="admin@careerlab.com"
                      className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Security Key</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-3.5 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                      value={form.password}
                      onChange={(e) => setForm({...form, password: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-4 rounded-2xl hover:shadow-xl hover:shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-[10px] uppercase tracking-[0.2em]"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>Authenticate <ArrowRight size={18} /></>}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div key="2fa" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
               <div className="text-center mb-10">
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="text-emerald-400 w-8 h-8" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight uppercase">Neural Guard</h1>
                <p className="text-slate-400 text-sm mt-2">Enter 6-digit synchronization code.</p>
              </div>

              <div className="space-y-8">
                <input 
                  type="text" 
                  maxLength={6}
                  value={otpToken}
                  onChange={(e) => setOtpToken(e.target.value)}
                  className="w-full bg-slate-800/60 border-2 border-slate-700 text-white text-center text-4xl font-black tracking-[0.4em] py-6 rounded-3xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-700"
                  placeholder="000000"
                  autoFocus
                />
                
                <div className="space-y-4">
                  <button 
                    onClick={handle2FAVerify} 
                    disabled={isVerifying2FA || otpToken.length !== 6} 
                    className="w-full bg-emerald-500 text-slate-900 font-black py-4 rounded-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {isVerifying2FA ? <Loader2 className="animate-spin" /> : "Verify Neural Identity"}
                  </button>
                  
                  <button 
                    onClick={() => setShow2FA(false)} 
                    className="w-full text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors"
                  >
                    Back to Credentials
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            {show2FA ? "Multi-Factor Authentication Active" : "Apply for Access Identity"}
          </p>
        </div>
      </motion.div>

      <div className="absolute bottom-6 text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
        Secured by CLC EduX Protocol • 256-bit Encryption
      </div>
    </div>
  );
}