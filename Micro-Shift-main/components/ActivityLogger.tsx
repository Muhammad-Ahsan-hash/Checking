import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, Target, ArrowRight, Activity as ActivityIcon, Calendar } from 'lucide-react';
import { Activity, Goal, CATEGORIES, PRESET_GOALS } from '../types';

interface ActivityLoggerProps {
  onComplete: (activities: Activity[], goals: Goal[], date: string) => void;
}

const ActivityLogger: React.FC<ActivityLoggerProps> = ({ onComplete }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', category: 'Work', durationMinutes: 480, description: '' },
    { id: '2', category: 'Sleep', durationMinutes: 420, description: '' },
  ]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [customGoal, setCustomGoal] = useState('');

  const totalMinutes = activities.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const addActivity = () => {
    setActivities([
      ...activities,
      { id: Date.now().toString(), category: CATEGORIES[0], durationMinutes: 30, description: '' }
    ]);
  };

  const removeActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const updateActivity = (id: string, field: keyof Activity, value: any) => {
    setActivities(activities.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const toggleGoal = (goalText: string) => {
    if (goals.find(g => g.text === goalText)) {
      setGoals(goals.filter(g => g.text !== goalText));
    } else {
      setGoals([...goals, { id: Date.now().toString(), text: goalText }]);
    }
  };

  const addCustomGoal = () => {
    if (customGoal.trim()) {
      setGoals([...goals, { id: Date.now().toString(), text: customGoal.trim() }]);
      setCustomGoal('');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Goals Section - Sidebar on Desktop */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-semibold text-slate-800">Intentions</h2>
            </div>
            <p className="text-slate-500 mb-6 text-sm">Select goals or add your own to help us guide the analysis.</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {PRESET_GOALS.map(goal => (
                <button
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all border text-left ${
                    goals.find(g => g.text === goal)
                      ? 'bg-secondary/10 border-secondary text-secondary font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-secondary/50'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="Custom goal..."
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && addCustomGoal()}
              />
              <button 
                onClick={addCustomGoal}
                className="px-3 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700 transition-colors"
              >
                Add
              </button>
            </div>

            {goals.length > 0 && (
                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                    {goals.filter(g => !PRESET_GOALS.includes(g.text)).map(g => (
                         <span key={g.id} className="px-3 py-1.5 text-sm rounded-full bg-secondary/10 border border-secondary text-secondary flex items-center gap-2">
                            {g.text}
                            <button onClick={() => setGoals(goals.filter(x => x.id !== g.id))} className="hover:text-red-500">×</button>
                         </span>
                    ))}
                </div>
            )}
          </section>
        </div>

        {/* Activities Section - Main Content on Desktop */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-slate-800">Log your day</h2>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                 <div className="relative">
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-primary/50"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                 </div>
                 <div className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${totalMinutes > 1440 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                    {totalHours} hrs
                 </div>
              </div>
            </div>

            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-primary/20 transition-all">
                  <div className="flex-1 w-full sm:w-auto">
                    <select
                      value={activity.category}
                      onChange={(e) => updateActivity(activity.id, 'category', e.target.value)}
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  
                  <div className="w-full sm:w-32 relative">
                    <input
                      type="number"
                      min="0"
                      placeholder="Mins"
                      value={activity.durationMinutes}
                      onChange={(e) => updateActivity(activity.id, 'durationMinutes', parseInt(e.target.value) || 0)}
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400 pointer-events-none">min</span>
                  </div>

                  <div className="flex-1 w-full sm:w-auto">
                     <input
                      type="text"
                      placeholder="Short note (optional)"
                      value={activity.description || ''}
                      onChange={(e) => updateActivity(activity.id, 'description', e.target.value)}
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <button 
                    onClick={() => removeActivity(activity.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Remove activity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addActivity}
              className="mt-6 w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium hover:border-primary/50 hover:text-primary hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Activity
            </button>
          </section>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => onComplete(activities, goals, date)}
              disabled={activities.length === 0 || totalMinutes === 0}
              className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-slate-900/20 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              Analyze My Day <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ActivityLogger;