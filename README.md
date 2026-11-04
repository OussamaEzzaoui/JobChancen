# JobChancen

**AI-powered job discovery, matching and application management.**

JobChancen is a customized job-search platform designed to help students and early-career developers discover relevant employment opportunities, evaluate their compatibility with job requirements, and create tailored application documents.

## Key Features

- **Automated Job Discovery:** Collects technical working-student opportunities from supported public job sources.
- **AI-Powered Matching:** Uses Gemini to compare job requirements against verified candidate skills and experience.
- **CV Analysis:** Extracts candidate facts from LaTeX CV templates for user verification.
- **Tailored Applications:** Generates personalized CVs and German cover letters based on factual candidate information.
- **PDF Generation:** Uses LaTeX and Tectonic to compile professional application documents.
- **Telegram Notifications:** Sends alerts about relevant job opportunities.
- **Application Tracking:** Helps users organize applications and monitor their progress.
- **Local Document Worker:** Processes queued application-generation requests automatically when running.

## Technology Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend and database: Supabase, PostgreSQL
- AI integration: Google Gemini API
- Document generation: LaTeX, Tectonic
- Notifications: Telegram Bot API
- Development environment: Node.js, Windows PowerShell

## Local Development

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Configure your Supabase project and Gemini API credentials in `.env.local` before using AI-dependent features.

To run the local document worker:

```powershell
node --experimental-strip-types --env-file=.env.local scripts/run-document-worker.ts
```

Document compilation also requires Tectonic.

## Project Origins

JobChancen is based on the open-source WerkMatch project by MarvanGit.

Original repository: https://github.com/MarvanGit/WerkMatch

This version includes custom Gemini integration, changes to document validation, updated templates, and local worker tooling.

The original project's copyright notices and applicable license conditions remain in effect.
