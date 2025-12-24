
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, Loader2, ExternalLink } from 'lucide-react';
import { startAssistantChat } from '../services/geminiService';

const PREMIUM_EASE = [0.16, 1, 0.3, 1];

interface Source {
  uri: string;
  title: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: Source[];
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatRef.current) {
      chatRef.current = startAssistantChat();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await chatRef.current.sendMessage({ message: inputValue });
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const sources: Source[] = [];
      
      if (groundingChunks) {
        groundingChunks.forEach((chunk: any) => {
          if (chunk.web) {
            sources.push({
              uri: chunk.web.uri,
              title: chunk.web.title
            });
          }
        });
      }

      const modelMsg: Message = { 
        role: 'model', 
        text: response.text || '',
        sources: sources.length > 0 ? sources : undefined
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the intelligence cluster. Please verify your connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-inter">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ duration: 0.5, ease: PREMIUM_EASE }}
            className="absolute bottom-20 right-0 w-[420px] h-[620px] bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] border border-slate-100 flex flex-col overflow-hidden glass-effect"
          >
            {/* Header */}
            <div className="bg-slate-900 px-8 py-6 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-xl text-white">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="text-white text-sm font-black uppercase tracking-widest leading-none mb-1">Sentix AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">v3 Pro Grounding</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth bg-white/40"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-6 relative">
                    <Sparkles size={32} strokeWidth={1.5} />
                    <div className="absolute inset-0 bg-indigo-200 blur-2xl opacity-20" />
                  </div>
                  <h4 className="text-slate-800 font-black text-lg mb-2">Knowledge Base Active</h4>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    Ask me about market trends, current events, or sentiment deep-dives. I have real-time web access.
                  </p>
                </div>
              )}

              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[90%] px-5 py-4 rounded-[1.8rem] text-sm font-medium leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-100' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1.5 w-[90%]">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider ml-1">Sources</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((source, sIdx) => (
                          <a 
                            key={sIdx}
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-100 transition-all max-w-[150px]"
                          >
                            <span className="truncate">{source.title}</span>
                            <ExternalLink size={10} className="shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white px-5 py-4 rounded-[1.5rem] rounded-bl-none border border-slate-100 flex items-center gap-1 shadow-sm">
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-slate-50 shrink-0">
              <div className="relative">
                <input 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask the Intelligence Assistant..."
                  className="w-full pl-6 pr-14 py-4 bg-slate-50/50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all text-sm font-medium"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                  {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, y: -4 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 w-16 h-16 rounded-[1.5rem] text-white flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X size={28} className="relative z-10" /> : <MessageSquare size={28} className="relative z-10" />}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-white rounded-full blur-xl pointer-events-none"
        />
      </motion.button>
    </div>
  );
};

export default ChatBot;
