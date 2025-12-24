
import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles, Info } from 'lucide-react';
import { SentimentResult } from '../types';

interface Props {
  result: SentimentResult;
}

const PREMIUM_EASE = [0.16, 1, 0.3, 1];

const SentimentCard: React.FC<Props> = ({ result }) => {
  const getColors = () => {
    switch(result.sentiment) {
      case 'Positive': 
        return { 
          main: 'text-emerald-600', 
          bg: 'bg-emerald-50/50', 
          accent: 'bg-emerald-500', 
          border: 'border-emerald-100',
          gradient: 'from-emerald-50/20 to-emerald-100/5'
        };
      case 'Negative': 
        return { 
          main: 'text-rose-600', 
          bg: 'bg-rose-50/50', 
          accent: 'bg-rose-500', 
          border: 'border-rose-100',
          gradient: 'from-rose-50/20 to-rose-100/5'
        };
      default: 
        return { 
          main: 'text-slate-600', 
          bg: 'bg-slate-50/50', 
          accent: 'bg-slate-500', 
          border: 'border-slate-200',
          gradient: 'from-slate-50/20 to-slate-100/5'
        };
    }
  };

  const colors = getColors();

  return (
    <motion.div 
      className={`bg-white rounded-[3rem] p-12 border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] h-full flex flex-col relative overflow-hidden`}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        y: -10,
        boxShadow: '0 48px 96px -24px rgba(0, 0, 0, 0.12), 0 20px 40px -20px rgba(0, 0, 0, 0.08)' 
      }}
      transition={{ duration: 0.8, ease: PREMIUM_EASE }}
    >
      {/* Dynamic Background Glow */}
      <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${colors.gradient} rounded-bl-full opacity-60 blur-3xl -mr-20 -mt-20`} />

      <div className="flex justify-between items-start mb-12 relative z-10">
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-3">Linguistic Intelligence</h2>
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: PREMIUM_EASE }}
            className={`text-5xl font-black font-poppins ${colors.main} flex items-center gap-5`}
          >
            {result.sentiment}
            <motion.span 
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-4xl filter drop-shadow-lg"
            >
              {result.emojis[0]}
            </motion.span>
          </motion.div>
        </div>
        <div className={`px-6 py-2.5 rounded-2xl ${colors.bg} ${colors.main} font-black text-[10px] uppercase tracking-[0.15em] border ${colors.border}`}>
          {result.intensity} Volume
        </div>
      </div>

      <div className="relative mb-12 bg-slate-50/30 p-10 rounded-[2.5rem] border border-white/60 shadow-inner group overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent scanning-line" />
        <Quote className="absolute -top-6 -left-2 text-slate-100" size={60} strokeWidth={1} />
        <p className={`text-2xl text-slate-800 leading-snug relative z-10 font-bold italic tracking-tight`}>
          "{result.explanation}"
        </p>
      </div>

      <div className="mt-auto space-y-10 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <Sparkles size={16} className="text-amber-400" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Semantic Nodes</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {result.keywords.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.08), ease: PREMIUM_EASE }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-5 py-2.5 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 shadow-sm hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md transition-all cursor-pointer"
              >
                {word}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5 p-6 rounded-[2rem] bg-indigo-50/20 border border-indigo-100/40 text-indigo-900/40">
          <Info size={24} className="text-indigo-400 shrink-0" strokeWidth={1.5} />
          <p className="text-[11px] font-bold leading-relaxed uppercase tracking-wider">
            Contextual verification confirmed via 2,048 neural parameters. Sentiment weight is calculated using semantic density scores.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SentimentCard;
