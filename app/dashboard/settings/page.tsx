// app/dashboard/settings/page.tsx

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { 
  User, Mail, Shield, Bell, Save, 
  BrainCircuit, Globe, Lock, CheckCircle2, 
  Loader2, Zap, Smartphone, Fingerprint, Eye, EyeOff, X, QrCode, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSaving, setIsSaving] = useState(false);
  const [autoFollowUp, setAutoFollowUp] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  const verifyAndActivate = async () => {
    if (verificationCode.length !== 6) {
      alert("Please enter a valid 6-digit synchronization code.");
      return;
    }

    const res = await fetch("/api/auth/2fa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: verificationCode })
    });
    
    const data = await res.json();

    if (res.ok) {
      alert("Neural Guard Active! Manee has locked your profile with 2FA.");
      setIs2FAModalOpen(false);
      setVerificationCode("");
    } else {
      alert(data.error || "Verification mismatch.");
    }
  };

  const setup2FA = async () => {
    setIsGeneratingQR(true);
    setIs2FAModalOpen(true);
    try {
      const res = await fetch("/api/auth/2fa/setup", { method: "POST" });
      const data = await res.json();
      if (data.qrCode) {
          setQrCodeUrl(data.qrCode);
      } else {
          alert("Neural pathways busy. Try again.");
          setIs2FAModalOpen(false);
      }
    } catch (err) {
      alert("Failed to initialize 2FA Link.");
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const tabs = [
    { id: "Profile", icon: User },
    { id: "Security", icon: Shield },
    { id: "Notifications", icon: Bell },
    { id: "AI Config", icon: BrainCircuit },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Neural parameters updated successfully!");
    }, 1500);
  };

  return (
    <div className="max-w-5xl space-y-10 pb-20 font-sans">
      <AnimatePresence>
        {is2FAModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl relative text-center">
              <button onClick={() => setIs2FAModalOpen(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900"><X size={24}/></button>
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <QrCode size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Neural Guard 2FA</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">Scan this QR with Google Authenticator to enable 2FA protection.</p>
              
              <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200 inline-block mb-8 relative group">
                {isGeneratingQR ? (
                    <div className="w-48 h-48 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>
                ) : (
                    <img src={qrCodeUrl} alt="2FA QR" className="w-44 h-44 mx-auto group-hover:scale-105 transition-transform duration-500 shadow-sm" />
                )}
              </div>

              <div className="space-y-4 text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Synchronization Code</label>
                <input 
                  value={verificationCode} 
                  onChange={(e) => setVerificationCode(e.target.value)} 
                  placeholder="000000" 
                  className="w-full bg-slate-100 border-none rounded-2xl p-4 text-center text-2xl font-black tracking-[0.5em] outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                  maxLength={6} 
                />
                <button onClick={verifyAndActivate} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">Verify & Activate Identity</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Configuration <span className="text-blue-600">.</span></h1>
        <p className="text-slate-500 font-medium italic">Manage your enterprise identity and Manee AI protocols.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                : "text-slate-500 hover:bg-white hover:text-slate-900"
              }`}
            >
              <tab.icon size={18} />
              {tab.id}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === "Profile" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-3xl font-black text-white shadow-lg uppercase">
                        {session?.user?.name?.[0] || "U"}
                     </div>
                     <div>
                        <h2 className="text-xl font-black text-slate-900">Neural Identity</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Public Enterprise Profile</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input defaultValue={session?.user?.name || ""} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                      <input disabled value={session?.user?.email || ""} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-400 cursor-not-allowed font-medium" />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
                      {isSaving ? <Loader2 className="animate-spin" size={18}/> : <><Save size={18} /> Save Identity</>}
                    </button>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><Zap size={20} /></div>
                      <div>
                         <h3 className="font-black text-slate-900 tracking-tight">AI SDR Autonomy</h3>
                         <p className="text-xs text-slate-400 font-medium">Enable Manee to engage leads via Neural SMTP.</p>
                      </div>
                   </div>
                   <button onClick={() => setAutoFollowUp(!autoFollowUp)} className={`w-14 h-8 rounded-full relative transition-all ${autoFollowUp ? 'bg-blue-600' : 'bg-slate-200'}`}>
                      <motion.div animate={{ x: autoFollowUp ? 26 : 4 }} className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md" />
                   </button>
                </div>
              </motion.div>
            )}

            {activeTab === "Security" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                  <div className="flex items-center gap-3 mb-2">
                    <Lock className="text-blue-600" size={24} />
                    <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">Access Control</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                      <div className="relative">
                        <input type={showPass ? "text" : "password"} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pr-12 focus:bg-white focus:border-blue-500 outline-none transition-all" placeholder="••••••••" />
                        <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-900">
                           {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg">Update Credentials</button>
                </div>
                
                <div className="bg-emerald-50 border-2 border-emerald-100 p-8 rounded-[3rem] flex items-center justify-between shadow-sm group">
                   <div className="flex items-center gap-6">
                      <div className="p-4 bg-white text-emerald-600 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-500"><Fingerprint size={32}/></div>
                      <div>
                         <p className="font-black text-emerald-900 text-xl tracking-tight leading-none">Two-Factor Authentication</p>
                         <p className="text-emerald-700 text-xs font-bold uppercase tracking-widest opacity-70 mt-2">Maximum protection for Career Lab OS</p>
                      </div>
                   </div>
                   <button onClick={setup2FA} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2">Enable Guard <ArrowRight size={14}/></button>
                </div>
              </motion.div>
            )}

            {activeTab === "Notifications" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 font-sans">
                   <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                     <Bell className="text-blue-600" size={24} /> Neural Alerts
                   </h2>
                   <div className="space-y-4">
                      {[
                        { title: "New Lead Intake", desc: "Notify when Manee detects a high-scoring lead." },
                        { title: "EduX Exam Submission", desc: "Alert when a student completes an assessment." },
                        { title: "Integrity Violations", desc: "Instant alert on suspicious activity during exams." },
                        { title: "System Heartbeat", desc: "Daily summary of enterprise neural health." }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all cursor-default">
                           <div>
                             <p className="text-sm font-black text-slate-900 tracking-tight">{item.title}</p>
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1">{item.desc}</p>
                           </div>
                           <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" />
                        </div>
                      ))}
                   </div>
                   <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Save Alert Matrix</button>
                </div>
              </motion.div>
            )}

            {activeTab === "AI Config" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5"><BrainCircuit size={200}/></div>
                <div className="relative space-y-8">
                   <div>
                     <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">Manee Engine v2.5</h2>
                     <p className="text-slate-400 text-sm italic">Synchronizing Career Lab Consulting custom knowledge base.</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] space-y-4">
                         <Globe size={24} className="text-blue-400" />
                         <h4 className="font-bold text-lg leading-none">Real-time Web Search</h4>
                         <p className="text-xs text-slate-500 leading-relaxed italic">Manee fetches latest industry trends for lead scoring.</p>
                         <div className="text-emerald-400 font-black text-[10px] uppercase flex items-center gap-2"><CheckCircle2 size={12}/> Connected</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] space-y-4">
                         <Smartphone size={24} className="text-purple-400" />
                         <h4 className="font-bold text-lg leading-none">Multimodal Telemetry</h4>
                         <p className="text-xs text-slate-500 leading-relaxed italic">Enables face-telemetry analysis during EduX assessments.</p>
                         <div className="text-emerald-400 font-black text-[10px] uppercase flex items-center gap-2"><CheckCircle2 size={12}/> Active</div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}