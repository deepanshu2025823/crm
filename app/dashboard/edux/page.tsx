"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, BookOpen, Clock, Plus, Loader2, Sparkles, BrainCircuit, Zap, Trash2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation"; 

export default function EduXPage() {
  const router = useRouter(); 
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  
  const [form, setForm] = useState({ title: "", collegeName: "", timeLimit: "30" });
  const [submitting, setSubmitting] = useState(false);

  const fetchExams = async () => {
    try {
      const res = await fetch('/api/edux');
      const data = await res.json();
      setExams(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExams(); }, []);

  const triggerManeeAutonomous = async (examId: string, type: "MCQ" | "QA") => {
    const topic = prompt(`Enter specific topic for ${type} generation:`);
    if (!topic) return;

    setGeneratingId(examId);
    try {
      const res = await fetch('/api/edux/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId, topic, count: 5, type })
      });
      if (res.ok) {
        alert(`Manee has successfully generated ${type}s for this exam!`);
        fetchExams();
      }
    } finally {
      setGeneratingId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/edux', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setIsAddOpen(false);
        setForm({ title: "", collegeName: "", timeLimit: "30" });
        fetchExams();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="text-red-600" size={24} /> EduX Proctoring
          </h1>
          <p className="text-slate-500 text-sm italic font-sans">Empowering integrity via Manee Neural Engine.</p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-all active:scale-95"
        >
          <Plus size={18} /> Create New Exam
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-red-600 w-10 h-10" />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Exams...</p>
          </div>
        ) : exams.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-300">
            <p className="text-slate-400 font-medium font-sans">No active exams found. Deploy your first test.</p>
          </div>
        ) : (
          exams.map((exam) => (
            <motion.div 
              whileHover={{ y: -8 }}
              key={exam.id} 
              className="bg-white p-7 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group"
            >
              {generatingId === exam.id && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <Zap className="animate-bounce text-blue-600 mb-2" />
                  <p className="text-[10px] font-black text-slate-900 uppercase font-sans">Manee generating...</p>
                </div>
              )}
              
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-red-50 p-4 rounded-2xl text-red-600">
                    <BookOpen size={24} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-black uppercase tracking-tighter bg-slate-900 text-white px-3 py-1 rounded-full font-sans">
                      {exam.difficulty || "ACTIVE"}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase font-sans">{exam.questions?.length || 0} Questions</span>
                  </div>
                </div>
                
                <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1 font-sans">{exam.title}</h3>
                <p className="text-xs text-slate-400 font-medium mb-6 uppercase tracking-wider font-sans">{exam.collegeName}</p>
                
                <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-sans">
                  <span className="flex items-center gap-1"><Clock size={14} className="text-blue-500"/> {exam.timeLimit}m</span>
                  <span className="flex items-center gap-1"><ShieldAlert size={14} className="text-emerald-500"/> AI PROCTORING</span>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => triggerManeeAutonomous(exam.id, "MCQ")}
                  className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all font-sans"
                >
                  <Sparkles size={14}/> Generate MCQs
                </button>
                <button 
                  onClick={() => triggerManeeAutonomous(exam.id, "QA")}
                  className="flex items-center justify-center gap-2 bg-purple-50 text-purple-700 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-purple-600 hover:text-white transition-all font-sans"
                >
                  <BrainCircuit size={14}/> Generate Q&A
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-[10px] font-black uppercase font-sans">Submissions: {exam.results?.length || 0}</span>
                </div>
                <button 
                  onClick={() => router.push(`/dashboard/edux/${exam.id}/results`)}
                  className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1 font-sans"
                >
                  Analyze Data <ChevronRight size={12} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 relative">
              <button onClick={() => setIsAddOpen(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 font-bold font-sans">Close</button>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Zap size={30} className="fill-red-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-sans">New Deployment</h3>
                <p className="text-slate-400 text-sm font-sans">Configure parameters for assessment.</p>
              </div>

              <form onSubmit={handleCreate} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-sans">Exam Title</label>
                  <input required className="w-full border-2 border-slate-100 rounded-2xl p-4 mt-1 outline-none focus:border-red-600 transition-all font-sans text-sm" 
                    value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Java Certification" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-sans">Client/College</label>
                  <input required className="w-full border-2 border-slate-100 rounded-2xl p-4 mt-1 outline-none focus:border-red-600 transition-all font-sans text-sm" 
                    value={form.collegeName} onChange={e => setForm({...form, collegeName: e.target.value})} placeholder="e.g. CLC Institute" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-sans">Time (Min)</label>
                  <input required type="number" className="w-full border-2 border-slate-100 rounded-2xl p-4 mt-1 outline-none focus:border-red-600 transition-all font-sans text-sm" 
                    value={form.timeLimit} onChange={e => setForm({...form, timeLimit: e.target.value})} />
                </div>
                <div className="pt-4">
                  <button disabled={submitting} className="w-full bg-red-600 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-red-600/20 hover:bg-red-700 disabled:opacity-50 transition-all uppercase tracking-widest text-xs font-sans">
                    {submitting ? "Deploying..." : "Launch Active Test"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}