// components/ChatWidget.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation"; 
import { createPortal } from "react-dom";
import { Send, X, Minus, UserCheck, Volume2, VolumeX, Mic, MicOff, Loader2, Sparkles, MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWidget() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false); 
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null); 

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-IN'; 

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };
        recognitionRef.current.onerror = () => setIsListening(false);
        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) recognitionRef.current?.stop();
    else { setIsListening(true); recognitionRef.current?.start(); }
  };

  const speak = (text: string) => {
    if (!isVoiceEnabled || typeof window === "undefined") return;
    window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text.replace(/[#*]/g, ''));
    utterance.lang = 'en-IN'; 
    utterance.rate = 1.0;
    utterance.pitch = 1.1; 
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    setMounted(true);
    const storedName = localStorage.getItem("user_display_name");
    
    const isB2C = pathname?.includes("/internship");
    const welcomeText = isB2C 
      ? `### Namaste ${storedName || 'Scholar'}! 🎓\n\nLooking for an **internship**? I can guide you through our **InternX-AI** and **Neural LMS** programs. \n\n*You have a 10% discount active!*`
      : `### Namaste! 🙏\n\nI am **Manee**, your AI Consultant. \n\nHow can I help you with **Digital Transformation**, **Custom AI Engineering**, or our **CLC One** master product today?`;
    
    if (messages.length === 0) {
        setMessages([{ role: "bot", text: welcomeText }]);
    }

    const lastVisit = localStorage.getItem("manee_last_visit");
    const now = new Date().getTime();
    if (lastVisit && (now - parseInt(lastVisit) < 86400000)) {
      setIsOpen(true);
    } else {
      setTimeout(() => setShowOffer(true), 3000);
    }
    localStorage.setItem("manee_last_visit", now.toString());
  }, [pathname]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (isOpen && lastMessage?.role === "bot" && !isLoading) speak(lastMessage.text);
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const context = pathname?.includes("/internship") ? "internship" : "service";
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, context }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: "bot", text: "I'm having a small technical glitch. Please try again!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
      
      <AnimatePresence>
        {showOffer && !isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white/80 backdrop-blur-md border border-red-100 p-4 rounded-2xl shadow-xl w-72 mb-4 relative"
          >
            <button onClick={() => setShowOffer(false)} className="absolute top-2 right-2 p-1 hover:bg-black/5 rounded-full"><X size={14} className="text-slate-500"/></button>
            <div className="flex items-start gap-3">
               <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <span className="text-xl">🎁</span>
               </div>
               <div>
                 <p className="text-[13px] font-bold text-slate-800">Namaste! Special Offer</p>
                 <p className="text-[11px] text-slate-600 leading-tight mt-1">Your 10% Early Bird Discount is active. Let's plan your career! 🚀</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen ? (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-[360px] md:w-[400px] h-[600px] md:h-[700px] bg-[#f8f9fc] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-white/50"
          >
            <div className="bg-gradient-to-br from-[#b31f24] via-[#d6282e] to-[#a01b20] p-0 relative shadow-lg shrink-0 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              
              <div className="p-5 relative z-10">
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => setIsVoiceEnabled(!isVoiceEnabled)} className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all text-white border border-white/10">
                    {isVoiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                  </button>
                  <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all text-white border border-white/10"><Minus size={16} /></button>
                </div>
                
                <div className="flex items-center gap-4 mt-2">
                  <div className="relative group">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-[3px] border-white/30 shadow-2xl">
                      <img src="https://img.freepik.com/free-photo/indian-woman-posing-cute-stylish-outfit-camera-smiling_482257-122351.jpg" alt="Manee AI" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-[3px] border-[#b31f24] rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="text-xl font-black text-white tracking-tight">Manee AI</h3>
                      <Sparkles size={14} className="text-yellow-300 animate-pulse" />
                    </div>
                    <p className="text-[11px] text-red-100 font-medium bg-black/20 px-2 py-0.5 rounded-full inline-block backdrop-blur-sm border border-white/5">
                      Enterprise Career Architect
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#f8f9fc]">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {msg.role === "bot" && (
                     <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-sm mt-1">
                        <img src="https://img.freepik.com/free-photo/indian-woman-posing-cute-stylish-outfit-camera-smiling_482257-122351.jpg" className="w-full h-full object-cover" />
                     </div>
                  )}

                  <div className={`max-w-[80%] p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm relative ${
                    msg.role === "user" 
                      ? "bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-tr-none" 
                      : "bg-white text-slate-700 rounded-tl-none border border-slate-100 prose prose-sm prose-p:my-1 prose-a:text-blue-600 prose-strong:text-slate-900"
                  }`}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                   <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-sm mt-1 bg-white p-1">
                      <Loader2 className="w-full h-full text-[#b31f24] animate-spin" />
                   </div>
                   <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                   </div>
                </motion.div>
              )}
            </div>

            <div className="p-4 bg-[#f8f9fc] shrink-0">
               <div className="bg-white p-1.5 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 flex items-center gap-2 relative z-20">
                  <button 
                    onClick={toggleListening}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isListening ? "bg-red-50 text-[#b31f24] ring-2 ring-red-100" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}`}
                  >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                  
                  <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder={isListening ? "Listening..." : "Ask Manee..."}
                    className="flex-1 bg-transparent py-2 text-sm outline-none text-slate-700 font-medium placeholder:text-slate-400"
                    disabled={isLoading}
                  />
                  
                  <button 
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className="w-10 h-10 rounded-full bg-[#b31f24] text-white flex items-center justify-center hover:bg-[#961a1e] hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                  >
                    <Send size={16} className={isLoading ? "opacity-0" : "ml-0.5"} />
                  </button>
               </div>
               <div className="text-center mt-3 flex items-center justify-center gap-1.5 opacity-50">
                   <Sparkles size={10} className="text-[#b31f24]" />
                   <p className="text-[10px] text-slate-500 font-semibold tracking-wide">Powered by Gemini 2.5 Flash</p>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-gradient-to-br from-[#b31f24] to-[#961a1e] rounded-full shadow-[0_8px_30px_rgba(179,31,36,0.3)] flex items-center justify-center relative group border-2 border-white/20"
          >
            <span className="absolute inset-0 rounded-full border border-[#b31f24] animate-ping opacity-20"></span>
            
            <span className="absolute top-0 right-0 h-4 w-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-red-100">
              <span className="text-[10px] font-bold text-[#b31f24]">1</span>
            </span>
            
            <MessageCircle className="text-white w-7 h-7 fill-white/10" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}