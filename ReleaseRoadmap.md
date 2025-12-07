# Release & Evolution Plan

Roadmap view with increasing fidelity, integrations, and features.

---

## 0–3 months (MVP release)
- Release web app with manual logging, goals, analysis via Gemini, and local history (7 days default, configurable up to 30 days).  
- Deliver: minimal UI, charts, 2–3 insights + micro-changes.  
- Implement serverless backend proxy to Gemini with minimal request/response logging (only metadata, opt-out).  
- Add CSV export/import.  

**Planned improvements (MVP → near term):**  
- Tuned Gemini prompt template; experiment with prompt engineering to improve suggestions.  
- Basic UX polish: small onboarding, microcopy, and quick-add category presets.  
- Client-side heuristic checks (e.g., total duration validation).

---

## 3–12 months (1st year)
- Improve analytics and history: weekly summaries and trends (7/14/30-day windows).  
- Introduce user opt-in persistent accounts (optional) or encrypted cloud storage for history (if desired).  
- Allow scheduled reminders or “today’s micro-change” push (email or browser notification).  
- Add export to calendar (user confirms before creating calendar events).  
- Add personalization: Gemini fine-tuning via saved preferences or prompt context.  

**Planned improvements:**  
- Better recommendation diversity (break suggestions into time-shift vs. micro-activity vs. social suggestions).  
- A/B testing for suggestions to find what converts to behavior change.  
- Analytics dashboard for users showing trends and progress toward stated goals.

---

## 1–2 years (2-year view)
- Integrations with calendars and passive sensing (optional and privacy-centric): read-only calendar import, optionally automated logging from calendar events.  
- Machine learning composite: optional local model or scheduled server-side aggregation to discover typical patterns (still using Gemini for natural-language analysis).  
- Community / shared templates for micro-changes.  
- Multi-device sync with encryption (if accounts enabled).  

**Planned improvements:**  
- Richer UI (timeline view, drag-and-drop to adjust day), habit-builder module, improved visualizations.  
- Collaboration features (share daily summary with coach).  
- Advanced privacy controls and data export/import.
