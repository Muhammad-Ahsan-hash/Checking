# Problem statement

## Pain point
Many people lack a lightweight, low-friction way to reflect on how they spend their day. They know they want “more reading”, “less social media”, or “more mindfulness” — but they rarely get a concise, realistic summary and a few tiny, achievable micro-changes they can try immediately. Existing habit apps often push rigid streaks, long-term habit tracking or time-tracking overhead; the user needs awareness + realistic small shifts, not enforcement.

## Primary users
- Knowledge workers / students who want awareness of time allocation and gentle nudges.  
- People seeking small, realistic improvements (micro-habits) rather than strict behavior change systems.  
- Users who will manually log a typical day or a single day to get immediate feedback.

## Why it matters
- Improves self-awareness quickly — a few minutes of reflection + a small suggestion can produce measurable behavior change.  
- Low cognitive overhead encourages adoption (no complex configuration, no mandatory long-term tracking).

## Scope (in-scope)
- Manual input of activities (category, optional description, duration).  
- Input of one or more personal goals (short text, selected from a small list or free-text).  
- **Exactly 3** simple, Gemini-generated insights about over/under-investment.  
- **Exactly 3** micro-change recommendations (shift minutes between categories or add short micro-habits).  
- Frontend web application (single-page web app).  
- Minimal backend proxy service **recommended for production** — currently the frontend calls Gemini directly with a hard-coded key (not secure). A server-side proxy keeps the API key off the client.  
- Local storage of **up to 30 recent days** in browser `localStorage`, with CSV export/import support.  
- Time-distribution visualization per day (pie chart).  
- Short history view of last 30 logs with clickable entries to view past days.

## Out-of-scope (explicit)
- User accounts, authentication, user profiles, or server-side long-term storage tied to identity.  
- Automated activity tracking (no passive sensing, no integrations with device usage or calendar).  
- Complex habit coaching, streaks, gamification, or scheduling.  
- Real-time tracking or background timers.  
- Detailed analytics dashboards beyond the small-history summaries.
- **AI analysis is not fully offline**: client-side calls to Gemini send activity data. Logs are stored locally, but AI recommendations require network access.  
- “Commit” toggles on micro-changes are **UI-only** and not persisted across sessions.  
- Imported CSV rows restore activities and goals, but **AI analysis is not restored**. Imported logs require re-running analysis to see insights.  
- Security note: **current frontend contains a hard-coded API key**. Remove before production and use server-side proxy or environment variables.


