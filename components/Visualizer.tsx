
import React from 'react';
import { motion } from 'framer-motion';
import { 
  RadialBarChart, 
  RadialBar, 
  ResponsiveContainer, 
  PolarAngleAxis 
} from 'recharts';
import { SentimentResult } from '../types';

interface Props {
  result: SentimentResult;
}

const PREMIUM_EASE = [0.16, 1, 0.3, 1];

const Visualizer: React.FC<Props> = ({ result }) => {
  const getChartColor = () => {
    switch(result.sentiment) {
      case 'Positive': return '#10b981'; // Emerald 500
      case 'Negative': return '#f43f5e'; // Rose 500
      default: return '#6366f1'; // Indigo 500
    }
  };

  const chartData = [
    {
      name: 'Score',
      value: result.score,
      fill: getChartColor(),
    }
  ];

  return (
    <motion.div 
      className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] h-full flex flex-col"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        y: -10,
        boxShadow: '0 48px 96px -24px rgba(0, 0, 0, 0.12), 0 20px 40px -20px rgba(0, 0, 0, 0.08)' 
      }}
      transition={{ duration: 0.8, ease: PREMIUM_EASE }}
    >
      <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-12">Data Architecture</h2>
      
      <div className="relative h-80 mb-12">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="85%" 
            outerRadius="100%" 
            barSize={20} 
            data={chartData} 
            startAngle={210} 
            endAngle={-30}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: '#f8fafc' }}
              dataKey="value"
              cornerRadius={20}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, type: 'spring', damping: 15 }}
            className="text-8xl font-black font-poppins text-slate-900 tracking-tighter"
          >
            {result.score}
          </motion.div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Score Index</span>
        </div>
      </div>

      <div className="space-y-10 mt-auto">
        <div>
          <div className="flex justify-between mb-4 items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Confidence</span>
            <span className="text-2xl font-black text-indigo-700 font-poppins">{result.confidence}<span className="text-sm opacity-30">%</span></span>
          </div>
          <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden p-1 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${result.confidence}%` }}
              transition={{ duration: 1.5, ease: PREMIUM_EASE }}
              className="h-full bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.3)] relative"
            >
              <div className="absolute top-0 right-0 w-2 h-full bg-white/20 blur-sm" />
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-10 border-t border-slate-50">
          <div className="text-center group">
            <motion.div 
              whileHover={{ scale: 1.2, rotate: [0, 10, -10, 0] }}
              className="text-3xl font-bold text-slate-800 font-poppins mb-1"
            >
              {result.emojis.slice(1, 3).join(' ')}
            </motion.div>
            <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Contextual Nuance</div>
          </div>
          <div className="text-center border-l border-slate-50">
            <div className={`text-sm font-black uppercase tracking-tighter font-poppins mb-1 ${
              result.score > 75 ? 'text-emerald-500' : 
              result.score < 25 ? 'text-rose-500' : 'text-indigo-500'
            }`}>
              {result.score > 75 ? 'Optimal' : result.score < 25 ? 'Critical' : 'Balanced'}
            </div>
            <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Rating Tier</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Visualizer;
