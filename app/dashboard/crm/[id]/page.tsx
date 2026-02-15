// app/dashboard/crm/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Mail, Phone, Sparkles, Loader2, Send, 
  History, BrainCircuit, Target, Zap, AlertCircle 
} from "lucide-react";
import { motion } from "framer-motion";

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sendingAI, setSendingAI] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/leads/${id}`);
      if (!res.ok) throw new Error("Database connection timed out");
      const data = await res.json();
      setLead(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetails(); }, [id]);

  const analyzeLead = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/leads/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: id })
      });
      if (res.ok) {
        alert("Manee has analyzed the lead persona!");
        fetchDetails(); 
      } else {
        alert("AI Analysis failed. Check your Gemini API key.");
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const triggerManee = async () => {
    setSendingAI(true);
    try {
      const res = await fetch('/api/ai-sdr/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: id }) 
      });
      if (res.ok) {
        alert("Manee has analyzed the lead and sent a personalized email!");
        fetchDetails(); 
      }
    } finally {
      setSendingAI(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      <p className="text-slate-400 font-medium animate-pulse">Syncing with Neural Core...</p>
    </div>
  );

  if (error) return (
    <div className="h-[60vh] flex items-center justify-center p-6 text-center">
      <div className="bg-red-50 border border-red-100 p-8 rounded-[2rem] max-w-md">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-900 mb-2">Network Error (P1001)</h2>
        <p className="text-red-700 text-sm mb-6">Manee cannot reach the TiDB database. Ensure your IP is whitelisted in TiDB Cloud.</p>
        <button onClick={fetchDetails} className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-red-700">Retry Link</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> Back to CRM
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg uppercase">
                  {lead?.name?.[0] || "?"}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{lead?.name || "Unknown"}</h1>
                  <div className="flex gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md border border-blue-100 uppercase">
                      {lead?.status}
                    </span>
                    {lead?.persona && (
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-md border border-purple-100 uppercase">
                        {lead.persona}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Score</p>
                <p className={`text-3xl font-black ${lead?.score > 70 ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {lead?.score || 0}<span className="text-sm text-slate-300">/100</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <div className="p-2 bg-slate-50 rounded-lg"><Mail size={14} className="text-blue-500" /></div>
                {lead?.email}
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <div className="p-2 bg-slate-50 rounded-lg"><Phone size={14} className="text-emerald-500" /></div>
                {lead?.phone || "No phone linked"}
              </div>
            </div>

            {lead?.aiSummary && (
              <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 border-dashed">
                <div className="flex items-center gap-2 mb-2 text-blue-700 font-bold text-xs uppercase tracking-tight">
                  <BrainCircuit size={14} /> Manee's Intel Summary
                </div>
                <p className="text-sm text-slate-600 italic">"{lead.aiSummary}"</p>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <History size={18} className="text-slate-400" /> Interaction Timeline
            </h2>
            <div className="space-y-4">
              {lead?.communications?.length > 0 ? (
                lead.communications.map((comm: any, i: number) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between mb-2">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{comm.type} SENT</span>
                      <span className="text-[10px] text-slate-400">{new Date(comm.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed italic">"{comm.content}"</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 text-sm italic underline decoration-slate-200">No follow-ups recorded yet.</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5"><Zap size={100}/></div>
             <h3 className="font-bold mb-4 flex items-center gap-2 font-sans tracking-tight text-lg">
               <Sparkles size={18} className="text-yellow-400" /> Neural Control
             </h3>
             <div className="space-y-3">
               <button onClick={triggerManee} disabled={sendingAI} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-50 active:scale-95">
                 {sendingAI ? <Loader2 className="animate-spin" size={18}/> : <><Send size={16}/> Manee Follow-up</>}
               </button>
               <button onClick={analyzeLead} disabled={analyzing} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 border border-slate-700">
                 {analyzing ? <Loader2 className="animate-spin" size={18}/> : <><Target size={16}/> Analyze Lead Intel</>}
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}