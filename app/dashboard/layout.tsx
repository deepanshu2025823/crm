// app/dashboard/layout.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Bot, 
  GraduationCap, 
  Settings, 
  LogOut, 
  Menu, 
  Bell,
  Search,
  Zap,
  X,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { name: "CRM Leads", icon: Users, href: "/dashboard/crm" },
    { name: "Manee AI", icon: Bot, href: "/dashboard/manee" },
    { name: "EduX Exams", icon: GraduationCap, href: "/dashboard/edux" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  const sidebarVariants: Variants = {
    open: { width: 280, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
    closed: { width: 88, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[40] md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        variants={sidebarVariants}
        animate={isSidebarOpen ? "open" : "closed"}
        className={`fixed md:relative z-[50] h-screen bg-[#0F172A] text-white flex flex-col border-r border-slate-800 transition-all 
          ${isMobileMenuOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3 overflow-hidden">
             <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2 shadow-lg shadow-blue-500/20 flex-shrink-0">
                <img src="https://www.careerlabconsulting.com/favicon.ico" alt="CLC" className="w-full h-full object-contain brightness-0 invert" />
             </div>
             {(isSidebarOpen || isMobileMenuOpen) && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col whitespace-nowrap">
                 <span className="font-black text-lg tracking-tighter uppercase">Career Lab</span>
                 <span className="text-[9px] text-blue-400 font-black tracking-[0.2em] uppercase leading-none">Enterprise OS</span>
               </motion.div>
             )}
          </div>
        </div>

        <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all cursor-pointer relative overflow-hidden ${
                  isActive 
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}>
                  <item.icon size={isActive ? 22 : 20} className={isActive ? "text-white" : "group-hover:scale-110 transition-transform"} />
                  {(isSidebarOpen || isMobileMenuOpen) && (
                    <span className="text-sm font-bold tracking-wide">{item.name}</span>
                  )}
                  {isActive && (
                    <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-white rounded-full" />
                  )}
                </div>
              </Link>
            )
          })}

          <div className="pt-6 mt-6 border-t border-slate-800/50">
            <button 
              onClick={() => router.push('/dashboard/manee')}
              className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl hover:shadow-blue-500/40 transition-all active:scale-95 group"
            >
              <Zap size={18} className="fill-white group-hover:animate-pulse" />
              {(isSidebarOpen || isMobileMenuOpen) && <span className="text-xs font-black uppercase tracking-widest">Ask Manee AI</span>}
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
          <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-800 transition-colors group cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 uppercase">
              {session?.user?.name?.[0] || "U"}
            </div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black truncate">{session?.user?.name || "Neural User"}</p>
                <div className="flex items-center gap-1">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">{session?.user?.role || "Operator"}</p>
                </div>
              </div>
            )}
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-8 z-[30] sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)} 
              className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-600 hidden md:block transition-all"
            >
              <Menu size={20} />
            </button>
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-600 md:hidden"
            >
              <Menu size={22} />
            </button>
            <div className="flex flex-col">
               <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">System Node</h2>
               <p className="text-sm font-black text-slate-900 leading-none">Career Lab CLC Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="relative hidden lg:block group">
                <Search className="absolute left-4 top-3 text-slate-400 w-4 h-4 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  placeholder="Neural Search..." 
                  className="bg-slate-100/50 border border-slate-200 pl-11 pr-6 py-2.5 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white w-72 transition-all"
                />
             </div>

             <div className="flex items-center gap-3">
               <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>
               <button className="relative p-3 bg-slate-100/50 hover:bg-slate-100 rounded-2xl text-slate-600 transition-all group">
                  <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                  <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
               </button>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}