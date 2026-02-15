// app/exam/[id]/page.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { 
  ShieldCheck, Camera, Clock, AlertTriangle, Send, 
  Loader2, User, Mail, Phone, ChevronRight, CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TakeExamPage() {
  const { id } = useParams();
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [studentInfo, setStudentInfo] = useState({ name: "", email: "", whatsapp: "" });
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [flags, setFlags] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    fetch(`/api/edux/public/${id}`).then(res => res.json()).then(data => {
      setExam(data);
      setTimeLeft(data.timeLimit * 60);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!started) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam(); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const handleVisibility = () => {
      if (document.hidden) {
        const time = new Date().toLocaleTimeString();
        setFlags(prev => [...prev, `Tab Switch at ${time}`]);
        alert("CRITICAL ALERT: Tab switching detected. Manee AI has logged this violation.");
      }
    };

    const blockInspect = (e: KeyboardEvent | MouseEvent) => {
        if (e instanceof MouseEvent && e.button === 2) e.preventDefault(); 
        if (e instanceof KeyboardEvent && (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)))) {
            e.preventDefault(); 
        }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    window.addEventListener("keydown", blockInspect);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("contextmenu", (e) => e.preventDefault());
      window.removeEventListener("keydown", blockInspect);
    };
  }, [started]);

  const startExam = async () => {
    if (!studentInfo.name || !studentInfo.email) {
      alert("Verification Failed: Credentials Required.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setStarted(true);
    } catch (err) {
      alert("Neural Feed Error: Camera access is mandatory for proctored sessions.");
    }
  };

  const submitExam = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/edux/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: id,
          studentName: studentInfo.name,
          email: studentInfo.email,
          whatsapp: studentInfo.whatsapp,
          answers: userAnswers,
          flags: flags 
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        alert(`Assessment Complete! Manee AI Score: ${data.score}%`);
        window.location.href = "/dashboard"; 
      }
    } catch (error) {
      alert("Connection Failure: Failed to sync result with core.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-4 text-white">
      <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
      <p className="font-bold tracking-widest text-xs uppercase opacity-50 animate-pulse">Establishing Secure Link...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30">
      <header className="fixed top-0 inset-x-0 h-20 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 z-50 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 text-white">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-tighter leading-none">{exam?.title}</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{exam?.collegeName}</p>
          </div>
        </div>

        {started && (
          <div className="flex items-center gap-6">
             <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Questions Remaining</p>
                <p className="text-sm font-black text-white">{Object.keys(userAnswers).length} / {exam?.questions?.length}</p>
             </div>
             <div className={`px-5 py-2.5 rounded-2xl border flex items-center gap-3 transition-all ${timeLeft < 300 ? 'bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-white/5 border-white/10 text-white'}`}>
                <Clock size={18} className={timeLeft < 300 ? "animate-pulse" : ""} />
                <span className="font-mono font-bold text-xl">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
             </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto pt-32 px-8 pb-20">
        {!started ? (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center py-10">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                <ShieldCheck size={12} /> SECURE ASSESSMENT PROTOCOL
              </div>
              <h2 className="text-6xl font-black text-white leading-none mb-6">Verification Phase <span className="text-blue-500">.</span></h2>
              <p className="text-slate-400 leading-relaxed mb-8 text-lg">Manee AI requires identity confirmation to proceed. Please ensure your camera is uncovered and you are in a well-lit environment.</p>
              
              <div className="space-y-4 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                <div className="grid grid-cols-1 gap-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input placeholder="Full Name" className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 pl-12 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600" 
                      value={studentInfo.name} onChange={e => setStudentInfo({...studentInfo, name: e.target.value})} />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input placeholder="Email Address" type="email" className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 pl-12 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600" 
                      value={studentInfo.email} onChange={e => setStudentInfo({...studentInfo, email: e.target.value})} />
                  </div>
                </div>
                <button onClick={startExam} className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-blue-500 hover:text-white transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 mt-4 shadow-xl">
                  Synchronize & Begin <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
               <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
               <div className="relative bg-[#0f172a] rounded-[3rem] border border-white/10 p-12 text-center aspect-square flex flex-col justify-center shadow-2xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 animate-pulse" />
                  <ShieldCheck size={100} className="text-blue-500 mx-auto mb-8 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                  <h3 className="text-2xl font-bold text-white mb-2">Autonomous Proctoring</h3>
                  <p className="text-slate-400 text-sm leading-relaxed px-4">Facial recognition, audio analysis, and browser monitoring enabled by Manee Neural Core.</p>
               </div>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-10">
              {exam?.questions?.map((q: any, i: number) => (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="bg-white/5 rounded-[3rem] border border-white/5 p-12 relative overflow-hidden group hover:bg-white/[0.07] transition-all">
                  <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-all shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                  <p className="text-2xl font-bold text-white mb-10 leading-relaxed">
                    <span className="text-blue-500 font-black mr-6 opacity-40">0{i+1}</span> {q.question}
                  </p>
                  
                  <div className="grid gap-4">
                    {q.options?.map((opt: string) => {
                      const isSelected = userAnswers[i] === opt;
                      return (
                        <button key={opt} onClick={() => setUserAnswers({...userAnswers, [i]: opt})}
                          className={`w-full text-left p-7 rounded-3xl border-2 transition-all flex items-center justify-between group/btn ${isSelected ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]' : 'bg-slate-900/50 border-white/5 hover:border-white/20 text-slate-400'}`}>
                          <span className="font-semibold text-lg">{opt}</span>
                          {isSelected ? (
                              <CheckCircle2 size={24} className="text-blue-400" />
                          ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-white/10 group-hover/btn:border-white/30" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
              
              <button disabled={isSubmitting} onClick={submitExam} className="w-full group bg-blue-600 hover:bg-blue-500 py-8 rounded-[2.5rem] text-white font-black uppercase tracking-[0.3em] shadow-3xl shadow-blue-600/30 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50">
                {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : (
                    <>
                    COMPLETE ASSESSMENT <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </>
                )}
              </button>
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                <div className="bg-slate-900 rounded-[3rem] overflow-hidden border-2 border-white/5 aspect-square relative shadow-3xl group">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1] opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Telemetry: Synchronized</span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black to-transparent opacity-60" />
                </div>
                
                <div className="bg-red-500/[0.02] rounded-[3rem] border border-red-500/10 p-10 shadow-3xl relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/5 rounded-full blur-3xl" />
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-red-500 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3">
                      <AlertTriangle size={20} /> Integrity Logs
                    </h3>
                    <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-lg leading-none shadow-lg shadow-red-500/20">{flags.length}</span>
                  </div>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-3 custom-scrollbar">
                    {flags.length === 0 ? (
                      <div className="flex flex-col items-center gap-4 py-10 opacity-30">
                        <CheckCircle2 size={40} className="text-slate-500" />
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-center">Zero Deviations Detected</p>
                      </div>
                    ) : (
                      flags.map((f, i) => (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={i} className="bg-red-500/10 p-4 rounded-2xl border border-red-500/10 text-[11px] font-bold text-red-400 flex items-start gap-3">
                          <span className="opacity-40 font-mono">#{i.toString().padStart(2,'0')}</span>
                          <span>{f}</span>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}