// app/dashboard/edux/[id]/results/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, User, ShieldAlert, CheckCircle, XCircle, Trash2, 
  Loader2, AlertTriangle, ExternalLink, Sparkles, BrainCircuit, X 
} from "lucide-react";
import Link from "next/link"; 
import { motion, AnimatePresence } from "framer-motion";

export default function ExamResultsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<{name: string, text: string} | null>(null);

  const fetchResults = async () => {
    try {
      const res = await fetch(`/api/edux/results/${id}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResults(); }, [id]);

  const triggerManeeAnalysis = async (resObj: any) => {
    setAnalyzingId(resObj.id);
    try {
      const res = await fetch('/api/edux/analyze-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultId: resObj.id })
      });
      const data = await res.json();
      if (res.ok) {
        setAuditResult({ name: resObj.studentName, text: data.audit });
      }
    } finally {
      setAnalyzingId(null);
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-red-600" /></div>;

  return (
    <div className="space-y-8 pb-20">
      <AnimatePresence>
        {auditResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl relative">
              <button onClick={() => setAuditResult(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X size={24}/></button>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><BrainCircuit size={24}/></div>
                <h3 className="text-xl font-black text-slate-900">Manee Behavioral Audit</h3>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Subject: {auditResult.name}</p>
              <p className="text-slate-600 leading-relaxed italic text-lg">"{auditResult.text}"</p>
              <button onClick={() => setAuditResult(null)} className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest">Close Intelligence Report</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
        <ArrowLeft size={16} /> Neural Return
      </button>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Assessment Logs <span className="text-red-600">.</span></h1>
          <p className="text-slate-400 text-sm mt-2">Audit of AI Proctoring violations and student performance telemetry.</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Student Identity</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Manee Score</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Integrity Status</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Autonomous Audit</th>
              <th className="px-10 py-6 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {results.map((res) => (
              <tr key={res.id} className="group hover:bg-slate-50/80 transition-all">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-black text-white flex items-center justify-center font-black text-sm uppercase shadow-lg">{res.studentName[0]}</div>
                    <div>
                      <p className="font-black text-slate-900 text-base">{res.studentName}</p>
                      <p className="text-xs text-slate-400 font-medium">{res.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                   <div className="flex items-center gap-3">
                     <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full transition-all ${res.score >= 70 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${res.score}%` }} />
                     </div>
                     <span className="font-black text-slate-900 text-sm">{res.score}%</span>
                   </div>
                </td>
                <td className="px-10 py-8">
                   <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase border shadow-sm ${res.securityFlags?.length > 0 ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                     {res.securityFlags?.length > 0 ? <AlertTriangle size={14}/> : <ShieldAlert size={14}/>}
                     {res.securityFlags?.length || 0} Violations
                   </div>
                </td>
                <td className="px-10 py-8">
                   <button 
                     onClick={() => triggerManeeAnalysis(res)}
                     disabled={analyzingId === res.id}
                     className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100"
                   >
                     {analyzingId === res.id ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>}
                     Trigger Manee Audit
                   </button>
                </td>
                <td className="px-10 py-8 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/exam/${id}`} target="_blank">
                      <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all cursor-pointer"><ExternalLink size={18} /></div>
                    </Link>
                    <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-600 hover:border-red-200 shadow-sm transition-all"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}