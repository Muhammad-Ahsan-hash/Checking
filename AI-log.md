# AI TOOLS

## 1.CHATGPT (For analysis and Documentation)

**Usefulness:** 
-Useful for making decisions and analysis of problem.**
**Limitations:** 
-You should be detailed as possible for better solution and it struggle with coding as it doesnt Have a good solution of storing code and editing it. 
-It struggle on big project.
-Doesnt support more then 960 line of code in canvas
-Cant access github for modification.
-Limited by its own model as GPT MODEL 5 is limited.

##2.AISTUDIO GOOGLE (For Code building, Cloning, Analysis of code and Bulding additional functionality)

**Usefulness: Useful for vibe coding as it can make full scale project in minutes without major help.**
-It has a preview which can show you changes on each prompt.
-It has access to github so it can clone others project and build on it.
-It can push and commit into your own github.
**Limitations:
-It lacks content generative capability of Chatgpt as it was designed for coding rather then generating img, documentations or analysis.

**ERASER IO**


# CHATGPT:

# Prompt 1:
You are a senior Requirements Engineer and your task is to read a client request so you can do anylsis of it with objective in my mind being: 1.The problem statement Pain point, primary users, and why the problem matters. Scope and explicit out-of-scope features. 2.MVP Implementation minimal system for the chosen problem 3. Release & Evolution Plan A short “release roadmap” (3-month, 1-year, 2-year view) describing how the product could evolve over time. At each stage, a few bullet points of planned improvements (for example, better algorithms, more data sources, richer UI, integrations, analytics), to emphasize product longevity and lifecycle thinking. 4.Use Cases & Design At least 3 detailed use cases. Simple high-level design / data-flow description 5.TestPlan.md 3–5 test cases with input, steps, expected and actual outcomes. 5. F. UI Sketch & Vision A simple UI sketch or wireframe (image or markdown-based ASCII/PlantUML) showing how the “final product” UI might look if this system were fully developed beyond the MVP. 1–2 paragraphs explaining key UI decisions (for example, how information is organized, how the user flow supports the pain point). Now these are your objective. Keep in mind we are making a initial MVP which should only support the functionality required by the client. You are allowed to ask all the intial questions before moving forward with the task.

# Prompt 2:
will be answered by the client description 2: the client is me and my actual need comes from fulfilling the task I was given for a project. 3. Multiple sections. 4. Semi Formal. 5. MVP should be designed to be minial in functionality but richer in being user friendly. 6:This product would be aimed to be a web application. you are happy to suggest any other way if that provides relief in development. 7: I would prefer Markdown Request: Design a “habit and time-use” assistant that helps a user reflect on how they spend their day and suggests small, positive adjustments. The user logs their activities for a day (or a typical day) with categories and durations, such as work, social media, study, exercise, family time, and sleep, along with one or more personal goals (for example, “more mindfulness”, “more reading”, “less social media”). The system summarizes how time is distributed, surfaces simple insights (for example, areas of over-investment or neglect), and proposes a few micro-changes like shifting some minutes towards productive or mindful activities. The focus is on awareness and realistic, incremental improvement rather than strict habit enforcement.

# Prompt 3:
Manually as with the use of gemini API, it would easiler make use of this data. 2: A 3: A 4: B 5: no 6: C and make this mvp uses gemini api to do all the task. while the application itself just collect data, send data and output data

# Prompt 4:
Let me share you the product I created with your documentations. How would you like it to be shared, Its made on React

# Prompt 5:
Will github option would gave you the ability to analysis of the code aswell?

# Prompt 6:
https://github.com/Muhammad-Ahsan-hash/Micro-Shift

# Prompt 7:
Is the current sprint, aligned with the documentation and does this fulfil the client needs. Say yes if thats the case if no then explain why

# AISTUDIO GOOGLE:

# Prompt 1:
Create a web application using this application description:
Design a “habit and time-use” assistant that helps a user reflect on how they spend their day and
suggests small, positive adjustments. The user logs their activities for a day (or a typical day) with
categories and durations, such as work, social media, study, exercise, family time, and sleep, along with
one or more personal goals (for example, “more mindfulness”, “more reading”, “less social media”). The
system summarizes how time is distributed, surfaces simple insights (for example, areas of
over-investment or neglect), and proposes a few micro-changes like shifting some minutes towards
productive or mindful activities. The focus is on awareness and realistic, incremental improvement rather
than strict habit enforcement.
and Using my pain point:
Problem statement
Problem / Pain point
Many people want to improve their daily habits but find it hard to see where their time actually goes and to translate awareness into realistic, incremental change. Users either track nothing (lack of awareness), use heavyweight habit apps that push rigid goals, or keep only informal notes that don’t yield useful suggestions.
Primary users
Students who want better study / sleep balance.
Knowledge workers aiming to reduce time-waste (social media, meetings).
People pursuing “soft” goals (mindfulness, reading, exercise) who prefer gentle nudges over strict enforcement.
Why the problem matters
Time allocation strongly correlates with mental health, productivity and progress toward personal goals.
Small, actionable micro-adjustments are more sustainable than large changes; awareness + tiny changes = compound improvement.
A lightweight, friendly tool focused on reflection (not policing) will lower friction and increase adoption.
Scope:
Pain point
Many people lack a lightweight, low-friction way to reflect on how they spend their day. They know they want “more reading”, “less social media”, or “more mindfulness” — but they rarely get a concise, realistic summary and a few tiny, achievable micro-changes they can try immediately. Existing habit apps often push rigid streaks, long-term habit tracking or time-tracking overhead; the user needs awareness + realistic small shifts, not enforcement.
Primary users
Knowledge workers / students who want awareness of time allocation and gentle nudges.
People seeking small, realistic improvements (micro-habits) rather than strict behavior change systems.
Users who will manually log a typical day or a single day to get immediate feedback.
Why it matters
Improves self-awareness quickly — a few minutes of reflection + a small suggestion can produce measurable behavior change.
Low cognitive overhead encourages adoption (no complex configuration, no mandatory long-term tracking).
Scope (in-scope)
Manual input of activities (category, optional description, duration).
Input of one or more personal goals (short text, selected from a small list or free-text).
Summary visualization of time distribution for a day; support for a short history (7–30 days).
2–3 simple, Gemini-generated insights about over/under-investment.
1–3 micro-change recommendations (shift minutes between categories or add short micro-habits).
Frontend web application (single-page web app).
Minimal backend proxy service that securely forwards requests to Gemini (keeps API key off client).
Local storage of last 7–30 days (browser-localStorage), with CSV export.
Out-of-scope (explicit)
User accounts, authentication, user profiles, or server-side long-term storage tied to identity.
Automated activity tracking (no passive sensing, no integrations with device usage or calendar).
Complex habit coaching, streaks, gamification, or scheduling.
Real-time tracking or background timers.
Detailed analytics dashboards beyond the small-history summaries.

# Prompt 2
Application is good for mobile view but for desktop view, its not responsive.

# Prompt 3
alright lets start matching my notes and the application. so that my vision mvp matches with the product.
MVP Implementation (minimal usable system)
Core user flows (MVP)
User opens web app; optionally reads short onboarding.
User creates a day log (date optional; defaults to today) by adding activity rows: category (select), duration (minutes/hours), optional note.
Gemini usage pattern
Backend composes a deterministic prompt template (see Prompt Template below) plus structured JSON output spec (so Gemini returns structured JSON of summary, insights, micro-changes).
Gemini does the analytical work: summarization, over/under-investment detection, suggestion generation.
(MVP release)
Release web app with manual logging, goals, analysis via Gemini, and local history (7 days default, configurable up to 30 days).
Deliver: minimal UI, charts, 2–3 insights + micro-changes.
Implement serverless backend proxy to Gemini with minimal request/response logging (only metadata, opt-out).
Add CSV export/import.
User enters 1+ personal goals (free text or select from list).
User taps Analyze. Frontend posts the day's activities + goals to the backend API.
Backend composes a prompt and calls Gemini. Backend returns parsed summary, 2–3 insights, and 1–3 micro-changes.
Frontend displays: pie/bar chart of time distribution, short insight bullets, recommended micro-changes, and a single “Try it” action (e.g., add 20-minute reading slot to today).
User can view the History view (last 7–30 days), export CSV.
Minimal feature list (MVP)
Activity entry UI (add/remove rows; category dropdown with common options, custom category allowed).
Goals input field (one or more).
button → requests Gemini via backend.
Summary visualization (pie chart or stacked bar).
2–3 insight bullets and 1–3 micro-changes.
Save day to local history (client-side, up to N days).
CSV export/import (optional but desired).
Backend proxy endpoint for Gemini calls (authentication + rate limiting basic handling).

# Prompt 4

Refinement needed: 

Structured, guaranteed 2–3 insights per day.
Validation for realistic micro-changes.








