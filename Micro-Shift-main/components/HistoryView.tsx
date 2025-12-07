import React, { useRef, useState } from 'react';
import { Calendar, Download, Upload, ChevronRight, AlertCircle } from 'lucide-react';
import { getHistory, exportToCSV, importFromCSV } from '../services/storageService';
import { DayLog } from '../types';

interface HistoryViewProps {
  onLoadLog: (log: DayLog) => void;
  onRefresh?: () => void; // Trigger re-render of history
}

const HistoryView: React.FC<HistoryViewProps> = ({ onLoadLog, onRefresh }) => {
  const history = getHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const count = await importFromCSV(file);
      setImportStatus({ msg: `Successfully imported ${count} entries.`, type: 'success' });
      if (onRefresh) onRefresh();
    } catch (err) {
      setImportStatus({ msg: 'Failed to parse CSV. Ensure it matches the export format.', type: 'error' });
    }
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    setTimeout(() => setImportStatus(null), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 md:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
          <p className="text-xs text-slate-500">Last 30 days stored locally</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".csv" 
            className="hidden" 
          />
          <button
            onClick={handleImportClick}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button
            onClick={exportToCSV}
            disabled={history.length === 0}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {importStatus && (
        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${importStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          <AlertCircle className="w-4 h-4" />
          {importStatus.msg}
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No history yet. Log your first day or import a CSV!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((log) => (
            <div 
              key={log.id} 
              onClick={() => onLoadLog(log)}
              className="group bg-white p-5 rounded-xl border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-slate-800">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                   <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</span>
                   <span className="text-sm bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                    {Math.round(log.totalMinutes / 60)}h {log.totalMinutes % 60}m
                  </span>
                </div>
                
                <div className="text-sm text-slate-500">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Goals</span>
                  <p className="line-clamp-2 leading-snug">
                     {log.goals.map(g => g.text).join(', ') || 'No specific goals'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;