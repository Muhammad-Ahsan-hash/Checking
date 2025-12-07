export interface Activity {
  id: string;
  category: string;
  durationMinutes: number;
  description?: string;
}

export interface Goal {
  id: string;
  text: string;
}

export interface MicroChange {
  title: string;
  description: string;
  impactLevel: 'Low' | 'Medium' | 'High';
  type: 'Swap' | 'Add' | 'Reduce'; // Mandatory categorization
}

export interface DayAnalysis {
  summary: string;
  insights: string[]; // Areas of over/under investment
  microChanges: MicroChange[];
}

export interface DayLog {
  id: string;
  date: string;
  activities: Activity[];
  goals: Goal[];
  analysis?: DayAnalysis;
  totalMinutes: number;
}

// Predefined categories for easier selection
export const CATEGORIES = [
  'Work',
  'Study',
  'Sleep',
  'Social Media',
  'Exercise',
  'Family/Friends',
  'Chores',
  'Entertainment',
  'Commute',
  'Mindfulness',
  'Other'
];

export const PRESET_GOALS = [
  "More reading",
  "Less social media",
  "More mindfulness",
  "Better sleep schedule",
  "More deep work",
  "Move my body more"
];