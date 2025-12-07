import React, { useState, useEffect } from 'react';
import { Activity, Goal, DayLog } from './types';
import ActivityLogger from './components/ActivityLogger';
import ResultsView from './components/ResultsView';
import HistoryView from './components/HistoryView';
import Onboarding from './components/Onboarding';
import { analyzeDay } from './services/geminiService';
import { saveLog, hasVisitedBefore, markAsVisited } from './services/storageService';
import { LayoutDashboard, History, PlusCircle, LogOut } from 'lucide-react';

type ViewState = 'log' | 'results' | 'history';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('log');
  const [currentLog, setCurrentLog] = useState<DayLog | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  // Simple toggle to force history reload
  const [historyVersion, setHistoryVersion] = useState(0);

  useEffect(() => {
    if (!hasVisitedBefore()) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    markAsVisited();
    setShowOnboarding(false);
  };

  const handleActivitySubmit = async (activities: Activity[], goals: Goal[], date: string) => {
    setIsLoading(true);
    
    const partialLog: DayLog = {
      id: Date.now().toString(),
      date: date || new Date().toISOString(), // Use selected date or fallback
      activities,
      goals,
      totalMinutes: activities.reduce((acc, curr) => acc + curr.durationMinutes, 0),
    };

    // Call Gemini API
    const analysis = await analyzeDay(partialLog);
    
    const fullLog: DayLog = {
      ...partialLog,
      analysis
    };

    saveLog(fullLog);
    setCurrentLog(fullLog);
    setHistoryVersion(v => v + 1); // Update history cache
    setIsLoading(false);
    setCurrentView('results');
  };

  const loadHistoricalLog = (log: DayLog) => {
    setCurrentLog(log);
    setCurrentView('results');
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-pulse">
           <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <LayoutDashboard className="w-8 h-8 text-indigo-500 animate-spin" />
           </div>
           <h2 className="text-xl font-semibold text-slate-800">Analyzing your day...</h2>
           <p className="text-slate-500 mt-2">Connecting dots between your time and your goals.</p>
        </div>
      );
    }

    switch (currentView) {
      case 'log':
        return <ActivityLogger onComplete={handleActivitySubmit} />;
      case 'results':
        return currentLog ? <ResultsView dayLog={currentLog} onReset={() => setCurrentView('log')} /> : null;
      case 'history':
        return <HistoryView key={historyVersion} onLoadLog={loadHistoricalLog} onRefresh={() => setHistoryVersion(v => v + 1)} />;
      default:
        return null;
    }
  };

  const NavButton = ({ view, icon: Icon, label, disabled = false }: { view: ViewState, icon: any, label: string, disabled?: boolean }) => (
    <button 
      onClick={() => !disabled && setCurrentView(view)}
      disabled={disabled}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium
        ${currentView === view 
          ? 'bg-slate-100 text-primary' 
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
        ${disabled ? 'opacity-30 cursor-not-allowed' : ''}
      `}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

      {/* Top Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('log')}>
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-teal-400 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              M
            </div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              MicroShift
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavButton view="log" icon={PlusCircle} label="Log Day" />
            <NavButton view="results" icon={LayoutDashboard} label="Insights" disabled={!currentLog} />
            <NavButton view="history" icon={History} label="History" />
          </div>
        </div>
      </header>

      {/* Main Content Area - Increased max-w for desktop */}
      <main className="max-w-5xl mx-auto px-4 py-6 md:py-8 pb-24 md:pb-8">
        {renderContent()}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-20">
        <div className="flex justify-around items-center h-16">
          <button 
            onClick={() => setCurrentView('log')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${currentView === 'log' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <PlusCircle className="w-6 h-6" />
            <span className="text-[10px] font-medium">Log Day</span>
          </button>
          
          <button 
             onClick={() => currentLog && setCurrentView('results')}
             disabled={!currentLog}
             className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${currentView === 'results' ? 'text-primary' : 'text-slate-400'} ${!currentLog ? 'opacity-30 cursor-not-allowed' : 'hover:text-slate-600'}`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-medium">Insights</span>
          </button>

          <button 
             onClick={() => setCurrentView('history')}
             className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${currentView === 'history' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <History className="w-6 h-6" />
            <span className="text-[10px] font-medium">History</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;