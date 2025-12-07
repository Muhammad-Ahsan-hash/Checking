import { DayLog, Activity, Goal } from '../types';

const STORAGE_KEY = 'microshift_history';

export const saveLog = (log: DayLog): void => {
  const existingData = getHistory();
  // Keep only last 30 days. Check if ID exists to update instead of duplicate
  const otherLogs = existingData.filter(l => l.id !== log.id);
  const updatedData = [log, ...otherLogs].slice(0, 30);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
};

export const getHistory = (): DayLog[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const hasVisitedBefore = (): boolean => {
  return !!localStorage.getItem('microshift_visited');
};

export const markAsVisited = (): void => {
  localStorage.setItem('microshift_visited', 'true');
};

export const exportToCSV = (): void => {
  const history = getHistory();
  if (history.length === 0) return;

  // Flatten data for CSV: Date, Total Minutes, Goal 1, Activity Summary
  const headers = ['ID', 'Date', 'Total Minutes', 'Goals', 'Activities (Category: Minutes)'];
  
  const rows = history.map(log => {
    // Escape quotes in content
    const goalsStr = log.goals.map(g => g.text.replace(/"/g, '""')).join('; ');
    const activitiesStr = log.activities
      .map(a => `${a.category}: ${a.durationMinutes}m`)
      .join('; ');
    
    return [
      log.id,
      log.date,
      log.totalMinutes,
      `"${goalsStr}"`, 
      `"${activitiesStr}"`
    ].join(',');
  });

  const csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(',') + "\n" 
    + rows.join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `microshift_history_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importFromCSV = async (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) return resolve(0);

        const lines = text.split('\n');
        // Simple validation: check header or length
        if (lines.length < 2) return resolve(0);

        const newLogs: DayLog[] = [];
        
        // Skip header (index 0)
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Regex to split by comma, respecting quotes
          const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
          // Expected indices: 0: ID, 1: Date, 2: Mins, 3: Goals, 4: Activities
          // Note: exportToCSV logic matches this. 
          // However, simple regex split might be flaky if user edited CSV heavily.
          // This assumes strict format adherence to the export format.
          
          // Fallback parsing strategy for MVP:
          // A robust CSV parser is large, we'll do a simple split and unquote
          const parts: string[] = [];
          let current = '';
          let inQuote = false;
          for (let char of line) {
            if (char === '"') { inQuote = !inQuote; }
            else if (char === ',' && !inQuote) { parts.push(current); current = ''; }
            else { current += char; }
          }
          parts.push(current);

          if (parts.length < 5) continue;

          const [id, date, totalMins, goalsRaw, actsRaw] = parts;

          // Reconstruct Activities
          const activities: Activity[] = actsRaw.replace(/^"|"$/g, '').split('; ').map((s, idx) => {
             const [cat, mins] = s.split(': ');
             return {
               id: `${id}_act_${idx}`,
               category: cat || 'Other',
               durationMinutes: parseInt(mins) || 0,
               description: 'Imported'
             };
          });

          // Reconstruct Goals
          const goals: Goal[] = goalsRaw.replace(/^"|"$/g, '').split('; ').map((g, idx) => ({
             id: `${id}_goal_${idx}`,
             text: g
          })).filter(g => g.text.length > 0);

          newLogs.push({
            id: id || Date.now().toString(),
            date: date,
            totalMinutes: parseInt(totalMins) || 0,
            activities,
            goals,
            // We cannot reconstruct the full AI analysis from CSV summary, 
            // so we leave it undefined or provide a placeholder.
            analysis: undefined 
          });
        }

        // Merge with existing
        const existing = getHistory();
        const existingIds = new Set(existing.map(e => e.id));
        let count = 0;
        
        newLogs.forEach(log => {
          if (!existingIds.has(log.id)) {
            existing.push(log);
            count++;
          }
        });

        // Sort by date desc and save
        existing.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 30)));
        resolve(count);

      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
};