
import React, { useState, useEffect } from 'react';
import { 
  Twitter, 
  History, 
  Zap, 
  ArrowRight, 
  TrendingUp, 
  Smile, 
  Frown, 
  Meh,
  Loader2,
  Trash2,
  Share2,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeSentiment } from './services/geminiService';
import { SentimentResult, HistoryItem } from './types';
import SentimentCard from './components/SentimentCard';
import Visualizer from './components/Visualizer';
import ChatBot from './components/ChatBot';

const PREMIUM_EASE = [0.16, 1, 0.3, 1];

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sentix_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sentix_history', JSON.stringify(history));
  }, [history]);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeSentiment(inputText);
      setResult(data);
      const newHistoryItem: HistoryItem = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        text: inputText,
        timestamp: Date.now()
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
    } catch (err) {
      setError("Analysis module failed to initialize. Please verify connectivity.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#fafbff] text-slate-900 selection:bg-indigo-100 pb-32">
      {/* Refined Dynamic Background with sophisticated layering */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div 
          animate={{ 
            x: [0, 100, -80, 0], 
            y: [0, -120, 60, 0],
            scale: [1, 1.25, 0.85, 1]
          }}
          transition={{ 
            duration: 35, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute -top-[10%] -left-[10%] w-[100vw] h-[100vh] bg-indigo-50/40 rounded-full blur-[180px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -120, 80, 0], 
            y: [0, 60, -100, 0],
            scale: [1, 0.75, 1.15, 1]
          }}
          transition={{ 
            duration: 45, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-[20%] -right-[15%] w-[80vw] h-[80vh] bg-blue-50/40 rounded-full blur-[160px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, 50, -50, 0], 
            y: [0, 80, -80, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ 
            duration: 55, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute bottom-[10%] left-[20%] w-[60vw] h-[60vh] bg-purple-50/20 rounded-full blur-[140px]" 
        />
      </div>

      <nav className="sticky top-0 z-50 glass-effect border-b border-white/40 px-8 py-4 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: PREMIUM_EASE }}
          className="flex items-center gap-3"
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-700 p-2.5 rounded-2xl text-white shadow-xl shadow-indigo-100"
          >
            <Zap size={22} strokeWidth={2.5} fill="currentColor" />
          </motion.div>
          <span className="text-2xl font-black tracking-tight text-slate-800 font-poppins">Sentix</span>
        </motion.div>
        
        <div className="flex items-center gap-10">
          <div className="hidden md:flex gap-8">
            {['Engine', 'Features', 'Pricing'].map((item) => (
              <button key={item} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-all">
                {item}
              </button>
            ))}
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-slate-900 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:shadow-2xl hover:shadow-indigo-200 transition-all"
          >
            Get Started
          </motion.button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-24">
        {/* Enhanced Hero */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: PREMIUM_EASE }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 mb-10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider">V3.0 Intelligence Engine Active</span>
          </motion.div>
          
          <div className="overflow-hidden mb-6">
            <motion.h1 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: PREMIUM_EASE }}
              className="text-6xl md:text-8xl font-black font-poppins text-slate-900 tracking-tighter"
            >
              Master <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-800">Sentiments</span>
            </motion.h1>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: PREMIUM_EASE }}
            className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Professional linguistic analysis for high-velocity social data. Decipher the emotional architecture of any text instantly.
          </motion.p>
        </div>

        {/* Premium Action Area */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: PREMIUM_EASE }}
          className="relative group mb-24 max-w-3xl mx-auto"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 rounded-[3.5rem] blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-1000" />
          <div className="relative bg-white rounded-[2.8rem] p-4 shadow-2xl shadow-indigo-100/40 flex flex-col md:flex-row gap-4 border border-slate-100 overflow-hidden">
            
            {isAnalyzing && (
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-50 z-20 overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1/3 h-full bg-indigo-600"
                />
              </div>
            )}

            <div className="flex-1 relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                <Twitter size={24} />
              </div>
              <input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                placeholder="Extract intelligence from a tweet..."
                className="w-full pl-16 pr-6 py-6 bg-slate-50/50 rounded-[2rem] border-0 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all text-xl font-medium placeholder:text-slate-300"
              />
            </div>
            
            <motion.button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !inputText.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all ${
                isAnalyzing ? 'bg-indigo-400 text-white' : 'bg-indigo-700 hover:bg-indigo-800 text-white shadow-xl shadow-indigo-200'
              }`}
            >
              {isAnalyzing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Process
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Dynamic Results Display */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-12 p-8 bg-rose-50 border border-rose-100 text-rose-600 rounded-[2.5rem] text-center font-bold text-sm tracking-wide shadow-sm"
            >
              {error}
            </motion.div>
          )}

          {result && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 1, ease: PREMIUM_EASE }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-24"
            >
              <div className="lg:col-span-7">
                <SentimentCard result={result} />
              </div>
              <div className="lg:col-span-5">
                <Visualizer result={result} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Grid */}
        <div className="mt-32">
          <div className="flex justify-between items-center mb-12 px-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                <History size={18} />
              </div>
              <div>
                <h3 className="font-black text-[11px] uppercase tracking-[0.3em] text-slate-800">Archive Cluster</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Intelligence</p>
              </div>
            </div>
            {history.length > 0 && (
              <button 
                onClick={() => setHistory([])}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {history.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full bg-white/40 border-2 border-dashed border-slate-100 rounded-[3rem] p-24 text-center"
                >
                  <History size={40} strokeWidth={1} className="text-slate-200 mx-auto mb-6" />
                  <p className="text-slate-400 font-bold text-sm tracking-tight">Your analysis timeline is currently vacant.</p>
                </motion.div>
              ) : (
                history.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    whileHover={{ y: -8, boxShadow: '0 30px 60px -12px rgba(0,0,0,0.06)' }}
                    transition={{ duration: 0.6, delay: index * 0.05, ease: PREMIUM_EASE }}
                    className="group bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm transition-all flex flex-col gap-6 relative"
                  >
                    <div className="flex justify-between items-start">
                      <div className={`p-3 rounded-2xl ${
                        item.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-600' :
                        item.sentiment === 'Negative' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
                      }`}>
                        {item.sentiment === 'Positive' ? <Smile size={22} /> :
                         item.sentiment === 'Negative' ? <Frown size={22} /> : <Meh size={22} />}
                      </div>
                      <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <p className="text-slate-700 font-bold text-base line-clamp-2 leading-snug">{item.text}</p>
                    
                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          item.sentiment === 'Positive' ? 'text-emerald-500' : 
                          item.sentiment === 'Negative' ? 'text-rose-500' : 'text-slate-500'
                        }`}>
                          {item.sentiment}
                        </span>
                        <div className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-[10px] font-black text-slate-400">{item.score}%</span>
                      </div>
                      <div className="flex gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.1, backgroundColor: '#f1f5f9' }}
                          onClick={() => setInputText(item.text)}
                          className="p-2 text-slate-300 hover:text-indigo-600 rounded-lg transition-colors"
                        >
                          <Search size={16} />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1, backgroundColor: '#fff1f2' }}
                          onClick={() => deleteHistoryItem(item.id)}
                          className="p-2 text-slate-300 hover:text-rose-600 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      
      {/* Floating Status Dock */}
      <footer className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1, ease: PREMIUM_EASE }}
          className="glass-effect px-10 py-5 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border border-white/60 flex items-center gap-10"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <TrendingUp size={18} className="text-emerald-500" />
              <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-40 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Grid System</span>
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest leading-none">Healthy · Low Latency</span>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <motion.button 
            whileHover={{ x: 3 }}
            className="text-[10px] font-black text-slate-700 hover:text-indigo-600 transition-colors flex items-center gap-2.5 group"
          >
            <Share2 size={16} className="group-hover:rotate-12 transition-transform" />
            EXPORT DATASET
          </motion.button>
        </motion.div>
      </footer>

      {/* AI Assistant ChatBot */}
      <ChatBot />
    </div>
  );
};

export default App;
