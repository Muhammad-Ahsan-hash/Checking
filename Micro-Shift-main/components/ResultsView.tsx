import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ArrowLeft, Sparkles, Lightbulb, TrendingUp, CheckCircle2, ArrowRightLeft, Plus, Minus, Scissors } from 'lucide-react';
import { DayLog, DayAnalysis, CATEGORIES } from '../types';

interface ResultsViewProps {
  dayLog: DayLog;
  onReset: () => void;
}

const COLORS = [
  '#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', 
  '#ef4444', '#10b981', '#3b82f6', '#94a3b8', '#64748b'
];

const ResultsView: React.FC<ResultsViewProps> = ({ dayLog, onReset }) => {
  const analysis = dayLog.analysis;
  const [committedIndices, setCommittedIndices] = useState<Set<number>>(new Set());

  // Aggregate data for chart
  const chartData = React.useMemo(() => {
    const map = new Map<string, number>();
    dayLog.activities.forEach(a => {
      map.set(a.category, (map.get(a.category) || 0) + a.durationMinutes);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [dayLog]);

  const handleCommit = (idx: number) => {
    const newSet = new Set(committedIndices);
    if (newSet.has(idx)) {
      newSet.delete(idx);
    } else {
      newSet.add(idx);
    }
    setCommittedIndices(newSet);
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'Swap': return <ArrowRightLeft className="w-3.5 h-3.5" />;
      case 'Add': return <Plus className="w-3.5 h-3.5" />;
      case 'Reduce': return <Scissors className="w-3.5 h-3.5" />; // Changed from Minus to Scissors for better visual metaphor
      default: return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const getChangeStyles = (type: string) => {
    switch (type) {
      case 'Swap': return {
        badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        card: 'border-l-indigo-500',
        button: 'hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200',
        committed: 'bg-indigo-500'
      };
      case 'Add': return {
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        card: 'border-l-emerald-500',
        button: 'hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200',
        committed: 'bg-emerald-500'
      };
      case 'Reduce': return {
        badge: 'bg-amber-100 text-amber-700 border-amber-200',
        card: 'border-l-amber-500',
        button: 'hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200',
        committed: 'bg-amber-500'
      };
      default: return {
        badge: 'bg-slate-100 text-slate-600 border-slate-200',
        card: 'border-l-slate-400',
        button: 'hover:bg-slate-50 hover:text-slate-600 hover:border-slate-200',
        committed: 'bg-slate-800'
      };
    }
  };

  const getActionText = (type: string) => {
    switch (type) {
        case 'Swap': return "Try Swapping";
        case 'Add': return "Try Adding";
        case 'Reduce': return "Try Reducing";
        default: return "Try this";
    }
  };

  // Loading state if analysis isn't ready yet (shouldn't happen with current flow, but good for safety)
  if (!analysis) return (
    <div className="flex flex-col items-center justify-center h-64 text-slate-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
      <p>Consulting the Oracle...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-20">
      
      <button 
        onClick={onReset}
        className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Log
      </button>

      {/* Header Summary */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-300" />
          Day Overview
        </h2>
        <div className="text-indigo-50 leading-relaxed opacity-90 text-sm md:text-base">
           <span className="font-semibold block mb-1 opacity-75 uppercase tracking-wide text-xs">{new Date(dayLog.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
           {analysis.summary}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[300px] flex flex-col">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Time Distribution</h3>
          <div className="flex-1 w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                    formatter={(value: number) => [`${value} min`, 'Duration']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
             <Lightbulb className="w-5 h-5 text-amber-500" />
             <h3 className="text-lg font-semibold text-slate-800">Key Insights</h3>
          </div>
          <ul className="space-y-4">
            {analysis.insights.map((insight, idx) => (
              <li key={idx} className="flex gap-3 text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg">
                <span className="text-amber-500 font-bold">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Micro-Changes - The "Pain Point" Solution */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
        <div className="flex items-center gap-2 mb-6">
           <TrendingUp className="w-6 h-6 text-teal-500" />
           <div>
             <h3 className="text-lg font-bold text-slate-800">Suggested Micro-Changes</h3>
             <p className="text-xs text-slate-500">Tiny, achievable shifts for tomorrow.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.microChanges.map((change, idx) => {
            const isCommitted = committedIndices.has(idx);
            const styles = getChangeStyles(change.type);

            return (
              <div key={idx} className={`p-4 rounded-xl transition-all border flex flex-col h-full bg-slate-50 ${isCommitted ? 'border-teal-200 bg-teal-50' : `border-transparent hover:bg-white hover:shadow-sm ${styles.card} border-l-4`}`}>
                
                <div className="flex justify-between items-start mb-3 gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border flex items-center gap-1 ${styles.badge}`}>
                     {getChangeIcon(change.type)} {change.type}
                  </span>
                  
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                      change.impactLevel === 'High' ? 'bg-rose-100 text-rose-700' :
                      change.impactLevel === 'Medium' ? 'bg-sky-100 text-sky-700' :
                      'bg-slate-200 text-slate-600'
                  }`}>
                      {change.impactLevel} Impact
                  </span>
                </div>

                <h4 className="font-semibold text-slate-800 text-sm mb-2">{change.title}</h4>
                <p className="text-sm text-slate-600 leading-snug mb-4 flex-1">
                  {change.description}
                </p>
                
                <button
                  onClick={() => handleCommit(idx)}
                  className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isCommitted 
                      ? `${styles.committed} text-white shadow-sm` 
                      : `bg-white border border-slate-200 text-slate-600 ${styles.button}`
                  }`}
                >
                  {isCommitted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Committed!
                    </>
                  ) : (
                    getActionText(change.type)
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultsView;