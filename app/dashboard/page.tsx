// app/dashboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, TrendingUp, DollarSign, Activity, Loader2, 
  AlertCircle, ShieldCheck, Zap, ArrowUpRight, 
  Sparkles, BrainCircuit, Globe 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/analytics')
        ]);
        
        if (!statsRes.ok || !analyticsRes.ok) throw new Error("Connection Failed");

        const statsJson = await statsRes.json();
        const analyticsJson = await analyticsRes.json();
        
        setData(statsJson);
        setAnalytics(Array.isArray(analyticsJson) ? analyticsJson : []);
        setDbError(false);
      } catch (error) {
        setDbError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <Loader2 className="animate-spin w-16 h-16 text-blue-600 opacity-20" />
        <BrainCircuit className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
      </div>
      <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Synchronizing Neural Core...</p>
    </div>
  );

  if (dbError) return (
    <div className="h-[60vh] flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-red-50 border border-red-100 p-12 rounded-[3rem] max-w-md text-center shadow-2xl shadow-red-100">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black text-red-900 mb-2 uppercase tracking-tighter">Neural Link Severed</h2>
        <p className="text-red-700 text-sm mb-8 leading-relaxed italic font-medium">Manee cannot establish a handshake with the TiDB Cloud node. Verify your secure gateway credentials.</p>
        <button onClick={() => window.location.reload()} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-200">Attempt Re-link</button>
      </motion.div>
    </div>
  );

  const stats = [
    { title: "Neural Leads", value: data?.stats?.leads || 0, change: "Live", icon: Users, color: "blue", glow: "shadow-blue-200" },
    { title: "Est. Revenue", value: data?.stats?.revenue || "₹0", change: "Hot", icon: DollarSign, color: "green", glow: "shadow-emerald-200" },
    { title: "Avg. AI Score", value: data?.stats?.avgScore || "0%", change: "Neural", icon: Zap, color: "orange", glow: "shadow-orange-200" },
    { title: "Integrity Rate", value: data?.stats?.integrity || "100%", change: "Secure", icon: ShieldCheck, color: "purple", glow: "shadow-purple-200" },
  ];

  return (
    <div className="space-y-10 pb-20 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-200"><Globe size={16}/></div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Career Lab Labs OS v2.5</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Command Center <span className="text-blue-600">.</span></h1>
          <p className="text-slate-400 font-medium italic mt-1">Autonomous telemetry for Career Lab Consulting ecosystem.</p>
        </div>
        <div className="bg-white border border-slate-100 p-2 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="px-4 py-2 bg-slate-900 rounded-xl flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Link: Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:${stat.glow} transition-all group cursor-default relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] opacity-50 -mr-8 -mt-8 group-hover:scale-110 transition-transform"></div>
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform shadow-sm`}>
                <stat.icon size={28} />
              </div>
              <span className="text-[10px] font-black text-slate-400 border border-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1 relative z-10">{stat.title}</h3>
            <p className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Inflow Velocity</h2>
              <p className="text-sm text-slate-400 font-medium italic">Lead acquisition and integrity growth telemetry.</p>
            </div>
            <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 rounded-xl hover:bg-slate-100 transition-all">Export Report</button>
                <button className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><ArrowUpRight size={20}/></button>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={6} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="lg:col-span-4 space-y-8 flex flex-col">
            <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform"><Sparkles size={120}/></div>
                <div className="relative">
                    <h3 className="text-2xl font-black tracking-tighter mb-4 flex items-center gap-3">
                        <Zap className="fill-white" size={20} /> Manee Audit
                    </h3>
                    <p className="text-blue-50 text-sm leading-relaxed font-medium mb-8 opacity-90">
                        {data?.stats?.integrity === "100%" 
                          ? "Manee Intelligence confirms 0 security violations. System health is optimal." 
                          : "Audit required: Performance levels are stable but lead conversion velocity has spiked."}
                    </p>
                    <button onClick={() => window.location.href='/dashboard/manee'} className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-blue-600 transition-all">
                        Execute AI Commands
                    </button>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex-1 flex flex-col"
            >
                <div className="absolute top-0 right-0 p-8 opacity-5"><Activity size={180}/></div>
                <h2 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3 relative z-10">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div> Activity Pulse
                </h2>
                
                <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                    {data?.recentActivity?.length > 0 ? (
                      data.recentActivity.map((user: any, index: number) => (
                        <div key={index} className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-black text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg shadow-black/20 uppercase text-sm">
                                {user.name?.[0]}
                            </div>
                            <div>
                                <p className="text-sm font-black tracking-tight">{user.name}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">{user.role} Identity Authorized</p>
                            </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-xs italic text-center py-20">Monitoring incoming telemetry...</p>
                    )}
                </div>
                <button onClick={() => window.location.href='/dashboard/crm'} className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-900/40">
                    View CRM Records
                </button>
            </motion.div>
        </div>
      </div>
    </div>
  );
}