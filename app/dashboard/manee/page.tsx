"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Cpu, Paperclip, Mic, StopCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function ManeePage() {
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hello! I am **Manee Enterprise**. I have access to your CRM and Exam data. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("Professional"); 
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, context: "enterprise" }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", text: "Connection to Neural Core failed." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex h-[85vh] gap-6">
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white shadow-md">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                Manee Enterprise <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full">v2.5</span>
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online • Latency: 45ms
              </p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {["Professional", "Creative", "Coder"].map((m) => (
              <button 
                key={m}
                onClick={() => setMode(m)}
                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                  mode === m ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8f9fa]">
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user" ? "bg-slate-200" : "bg-red-100 text-red-600"
              }`}>
                {msg.role === "user" ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === "user" 
                  ? "bg-slate-900 text-white rounded-tr-none" 
                  : "bg-white text-slate-700 border border-slate-100 rounded-tl-none prose prose-sm"
              }`}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </motion.div>
          ))}
          
          {loading && (
             <div className="flex gap-4">
                <div className="w-8 h-8 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0 animate-pulse">
                   <Cpu size={16} />
                </div>
                <div className="flex items-center gap-1 bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100">
                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
             </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl flex items-center p-2 gap-2 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
              <Paperclip size={18} />
            </button>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask Manee to analyze leads, draft emails, or write code..." 
              className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
              disabled={loading}
            />
            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
              <Mic size={18} />
            </button>
            <button 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2">
            Manee can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>

      <div className="w-80 hidden xl:flex flex-col gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
             <Cpu size={16} className="text-blue-500"/> Neural Capabilities
           </h3>
           <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                 <span className="text-slate-500">Model</span>
                 <span className="font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded">Manee 2.5 Pro</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                 <span className="text-slate-500">Context Window</span>
                 <span className="font-semibold text-slate-700">1 Million Tokens</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                 <span className="text-slate-500">Knowledge Cutoff</span>
                 <span className="font-semibold text-slate-700">Real-time Web</span>
              </div>
           </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-5 rounded-2xl text-white shadow-lg">
           <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
             <Sparkles size={14} /> Try asking...
           </h3>
           <div className="space-y-2">
             <button onClick={() => setInput("Draft a cold email for a lead interested in Java.")} className="w-full text-left text-xs bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors border border-white/10">
               "Draft a cold email for a lead..."
             </button>
             <button onClick={() => setInput("Analyze the last 5 leads added to CRM.")} className="w-full text-left text-xs bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors border border-white/10">
               "Analyze last 5 CRM leads..."
             </button>
             <button onClick={() => setInput("Create a React component for a Navbar.")} className="w-full text-left text-xs bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors border border-white/10">
               "Create a React Navbar..."
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}