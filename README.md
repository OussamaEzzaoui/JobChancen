# JobChancen

**AI-powered job discovery, matching, and application management.**

JobChancen is an AI-assisted job-search platform designed to help students and early-career developers discover relevant opportunities, evaluate their compatibility with job requirements, and generate personalized application documents.

The platform combines automated job discovery, Google Gemini AI, verified candidate information, and LaTeX-based document generation into a single application workspace.

## Key Features

- **Automated Job Discovery:** Finds technical working-student and developer opportunities from supported job sources.
- **AI-Powered Job Matching:** Uses Google Gemini to compare job requirements with verified candidate skills, qualifications, and experience.
- **CV Analysis:** Extracts structured candidate information from uploaded LaTeX CV templates for review and verification.
- **Personalized CV Generation:** Creates job-specific CVs based on verified candidate information.
- **German Cover Letters:** Generates tailored application letters based on the job description and candidate profile.
- **Professional PDF Generation:** Uses LaTeX and Tectonic to produce application-ready PDF documents.
- **Application Tracking:** Organizes job applications and their progress.
- **Telegram Notifications:** Supports notifications for relevant job opportunities.
- **Automated Document Worker:** Processes queued PDF-generation requests while the local development environment is running.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Database and authentication | Supabase, PostgreSQL |
| AI processing | Google Gemini API |
| Document generation | LaTeX, Tectonic |
| Notifications | Telegram Bot API |
| Runtime | Node.js |
| Local development | Windows PowerShell |

## Requirements

Before running JobChancen locally, install or configure:

- Node.js and npm
- Git
- A Supabase project
- A Google Gemini API key
- Tectonic for PDF compilation
- Windows PowerShell for the provided development scripts

Telegram configuration is required only when using Telegram notifications.

## Local Installation

### 1. Clone the repository

```powershell
git clone https://github.com/OussamaEzzaoui/JobChancen.git
cd JobChancen
```

### 2. Install dependencies

```powershell
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root.

Configure the necessary Supabase and Gemini credentials:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=

GEMINI_API_KEY=
GEMINI_MATCH_MODEL=
GEMINI_DOCUMENT_MODEL=
```

Additional environment variables may be required for scheduled searches, job-source integrations, notifications, and other features.

Use the project's existing configuration and source code to determine the complete set of required variables.

**Security:** Never commit `.env.local`, API keys, passwords, or other credentials to GitHub.

### 4. Set up Supabase

Create and configure a Supabase project.

Apply the database migrations from the `supabase/migrations` directory using the Supabase CLI or an appropriate database migration workflow.

Some operations require Supabase server-side credentials. Keep these credentials private.

### 5. Install Tectonic

JobChancen uses Tectonic to compile LaTeX documents into PDFs.

For the current Windows development setup, place the Tectonic executable at:

```text
JobChancen/tectonic.exe
```

The local document watcher uses this executable when processing PDF requests.

Tectonic is a separate dependency and is intentionally not included in the Git repository.

### 6. Start JobChancen

Start the application and automatic PDF worker together:

```powershell
npm run dev:all
```

This launches:

1. The Next.js development server.
2. The document worker, which periodically checks for queued PDF-generation requests.

Open the application at:

http://localhost:3000

Keep the terminal running while using the application.

## PDF Generation

JobChancen uses a background document-processing workflow:

1. The user requests a tailored CV or cover letter.
2. The application generates document content using Google Gemini.
3. A document-generation request is queued in Supabase.
4. The document worker detects the queued request.
5. Tectonic compiles the LaTeX output into PDF format.
6. The generated document becomes available through the application.

The worker runs automatically when using `npm run dev:all`.

For manual worker execution on Windows:

```powershell
$env:TECTONIC_BIN = (Resolve-Path .\tectonic.exe).Path
node --experimental-strip-types --env-file=.env.local .\scripts\run-document-worker.ts
```

The automated development command is recommended for normal local usage.

## Development Commands

| Command | Description |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start Next.js only |
| `npm run dev:all` | Start Next.js and the PDF worker |
| `npx tsc --noEmit` | Check TypeScript errors |
| `npm run build` | Create a production build |

**Note:** The automatic PDF worker currently depends on the local development environment. A separate worker deployment or background-job service is needed for unattended production document processing.

## Project Origins and Attribution

JobChancen is based on the open-source **WerkMatch** project developed by MarvanGit.

Original repository: https://github.com/MarvanGit/WerkMatch

This customized version includes:

- JobChancen branding and interface updates
- Google Gemini AI integration
- Changes to document-generation and validation workflows
- Adjustments to application templates
- Local automated PDF-worker tooling
- Database and usage-limit configuration changes

The original project's copyright notices and applicable license conditions remain in effect.

## Current Status

JobChancen is under active development. Features, integrations, and deployment procedures may change as the project evolves.