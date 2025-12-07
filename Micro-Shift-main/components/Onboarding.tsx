import React from 'react';
import { Sparkles, Clock, TrendingUp, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-500 to-teal-400 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome to MicroShift</h1>
          <p className="text-indigo-50 opacity-90">Small changes, big impact.</p>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="flex gap-4">
            <div className="bg-indigo-50 p-3 rounded-lg h-fit">
              <Clock className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Log Your Time</h3>
              <p className="text-sm text-slate-500">Spend 2 minutes logging your day. No strict tracking, just rough estimates.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-teal-50 p-3 rounded-lg h-fit">
              <TrendingUp className="w-6 h-6 text-teal-500" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Get Micro-Changes</h3>
              <p className="text-sm text-slate-500">We analyze your day against your goals and suggest tiny, achievable shifts.</p>
            </div>
          </div>

          <button 
            onClick={onComplete}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 group"
          >
            Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;