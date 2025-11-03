# IUO Student Archive

A student-driven digital library for Igbinedion University Okada (IUO). The platform enables students to browse, upload, and download course materials organized by college, department, level, and course.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + Node.js + TypeScript
- **Database**: PostgreSQL (Neon serverless) with Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# Session
SESSION_SECRET=your_session_secret_key

# Base URL (for email verification links)
BASE_URL=http://localhost:5000

# Email Service (optional - for production)
EMAIL_SERVICE=resend
EMAIL_SERVICE_API_KEY=your_email_service_api_key
EMAIL_FROM=IUO Archive <noreply@iuo.edu>
```

## Vercel Deployment

This project is configured for Vercel deployment:

### Steps:

1. **Push your code to GitHub**
   ```bash
   git push origin main
   ```

2. **Import your repository in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Set Environment Variables in Vercel Dashboard:**
   - `DATABASE_URL` - Your PostgreSQL connection string (Neon serverless)
   - `SESSION_SECRET` - A secure random string for session encryption
   - `BASE_URL` - (Optional) Your custom domain, or leave empty (Vercel auto-detects)
   - `EMAIL_SERVICE` - (Optional) "resend" or "sendgrid"
   - `EMAIL_SERVICE_API_KEY` - (Optional) Your email service API key
   - `EMAIL_FROM` - (Optional) Email sender address (e.g., "IUO Archive <noreply@iuo.edu>")

4. **Deploy!**
   - Vercel will automatically detect the `vercel.json` configuration
   - The build will run automatically
   - Your app will be live!

### How It Works:
- **Frontend**: Built with Vite → `dist/public`
- **API Routes**: Handled by serverless function at `api/index.ts`
- **Static Files**: Served automatically by Vercel
- **SPA Routing**: Handled by Vercel rewrites

### Important Notes:
- Vercel automatically provides `VERCEL_URL` environment variable
- The `BASE_URL` will be auto-detected from Vercel URL if not set
- Database migrations run automatically on serverless function initialization
- Session store uses PostgreSQL if `DATABASE_URL` is available

## Project Structure

```
├── client/          # Frontend React application
├── server/          # Backend Express server
├── shared/          # Shared TypeScript types and schemas
├── api/             # Vercel serverless functions
└── dist/            # Build output
```

## License

MIT

