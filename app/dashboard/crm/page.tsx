// app/dashboard/crm/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, Search, Filter, Phone, Mail, 
  MoreHorizontal, Loader2, Zap, Sparkles,
  ArrowUpRight, Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CRMPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isOutreachLoading, setIsOutreachLoading] = useState(false);
  
  const [form, setForm] = useState({ name: "", email: "", phone: "", status: "NEW" });
  const [submitting, setSubmitting] = useState(false);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const triggerNeuralOutreach = async () => {
    setIsOutreachLoading(true);
    try {
      const res = await fetch('/api/ai-sdr/process', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        alert(`Neural Success: Manee has autonomously engaged ${data.processed?.length || 0} leads!`);
        fetchLeads(); 
      } else {
        alert(data.message || "Manee engine is currently idling.");
      }
    } catch (err) {
      alert("Neural Link Failure: Check SMTP/AI configurations.");
    } finally {
      setIsOutreachLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      if (res.ok) {
        setIsAddOpen(false);
        setForm({ name: "", email: "", phone: "", status: "NEW" });
        fetchLeads(); 
      }
    } catch (err) {
      alert("Database error: Failed to record identity.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-blue-600" size={16} />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Neural Lead Core</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">CRM Ecosystem <span className="text-blue-600">.</span></h1>
          <p className="text-slate-400 font-medium italic mt-1">Manee AI is currently scoring {leads.length} active neural signatures.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={triggerNeuralOutreach}
            disabled={isOutreachLoading || leads.filter(l => l.status === 'NEW').length === 0}
            className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
          >
            {isOutreachLoading ? <Loader2 className="animate-spin" size={14}/> : <Zap size={14} className="fill-blue-400 text-blue-400"/>}
            Activate Neural Outreach
          </button>
          
          <button 
            onClick={() => setIsAddOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-200 transition-all flex items-center gap-2"
          >
            <Plus size={16} /> New Entry
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 flex gap-4 items-center shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-3 text-slate-400 w-4 h-4 group-focus-within:text-blue-600 transition-colors" />
          <input placeholder="Search neural records..." className="pl-12 pr-4 py-3 w-full bg-slate-50 border-none rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium" />
        </div>
        <button className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 text-slate-600 transition-all">
          <Filter size={20} />
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-20 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Database Hub...</p>
           </div>
        ) : leads.length === 0 ? (
           <div className="p-20 text-center text-slate-400 italic font-medium">No neural signatures detected. Initialize an identity to begin.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6">Communication Link</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Neural Score</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <Link href={`/dashboard/crm/${lead.id}`}>
                      <div className="font-black text-slate-900 cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-black text-white flex items-center justify-center text-sm shadow-lg uppercase">{lead.name?.[0]}</div>
                        <div>
                          <p className="leading-tight">{lead.name || "Unknown"}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">SIG: {lead.id.slice(0,8)}</p>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1 text-slate-500">
                        <div className="flex items-center gap-2"><Mail size={12} className="text-blue-500"/> {lead.email}</div>
                        <div className="flex items-center gap-2"><Phone size={12} className="text-emerald-500"/> {lead.phone || "N/A"}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                      lead.status === 'NEW' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      lead.status === 'HOT' ? 'bg-orange-50 text-orange-600 border-orange-100 animate-pulse' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${lead.score}%` }}
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full"
                        ></motion.div>
                      </div>
                      <span className="text-xs font-black text-slate-900">{lead.score}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 shadow-sm transition-all opacity-0 group-hover:opacity-100"><ArrowUpRight size={20} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-black text-2xl text-slate-900 tracking-tighter uppercase">Initialize Identity</h3>
                <button onClick={() => setIsAddOpen(false)} className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 font-black text-xl shadow-sm">&times;</button>
              </div>
              <form onSubmit={handleCreate} className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Name</label>
                  <input required className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                  <input required type="email" className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="name@domain.com" />
                </div>
                <div className="pt-6">
                  <button disabled={submitting} className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200 uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3">
                    {submitting ? <Loader2 className="animate-spin" size={16}/> : <><Sparkles size={16} className="text-blue-400"/> Authenticate Entity</>}
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