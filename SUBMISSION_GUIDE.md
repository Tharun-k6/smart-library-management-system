# Smart Library Submission Guide

## What this project shows
- Public marketing homepage at `/`
- Secure role-based portals for Admin, Librarian, and Student
- Expanded curated book catalog
- Polished SaaS-style UI with dark theme and responsive layout
- SEO-friendly page titles and metadata
- Seeded demo data for a convincing presentation

## Demo credentials
- Admin: `admin@smartlib.com` / `Admin@123`
- Librarian: `librarian@smartlib.com` / `Librarian@123`
- Student: `student@smartlib.com` / `Student@123`

## Local run
- Frontend: start from `frontend/`
- Backend: start from `backend/` using the local Maven binary if `mvn` is not installed on PATH

## Deployment checklist
1. Replace the placeholder domain in `frontend/public/robots.txt`.
2. Replace the placeholder domain in `frontend/public/sitemap.xml`.
3. Set `VITE_API_URL` to the deployed backend URL.
4. Deploy the frontend to a public host.
5. Deploy the backend to a public host or VM.
6. Verify the homepage and catalog load without console errors.
7. Test login, dashboard, books, analytics, and reservations.

## What to mention in a company review
- The app has a public root landing page, so it is easy to open and present.
- The catalog includes a richer seed set for realistic demo usage.
- The UI has consistent titles, metadata, and a more professional presentation.
- Localhost is only for development; a public URL is needed for Google indexing.

## Acceptance summary
- Frontend build passes
- Backend responds on port 8080
- No editor-reported frontend/backend errors
- Live pages render correctly in the browser
