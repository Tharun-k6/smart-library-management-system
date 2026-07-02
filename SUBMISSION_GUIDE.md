# Smart Library Submission Guide

## What this project shows
- Public marketing homepage at `/`
- Secure role-based portals for Admin, Librarian, and Student
- Expanded curated book catalog
- Polished SaaS-style UI with dark theme and responsive layout
- SEO-friendly page titles and metadata
- Seeded demo data for a convincing presentation

## Why it looks stronger in review
- The homepage gives reviewers immediate context instead of dropping them into a login screen.
- The feature set is broad enough to show real product thinking, not just a basic CRUD app.
- The curated books and seeded users make the app feel usable on first open.
- The UI uses consistent spacing, contrast, and card structure so screenshots look professional.

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
8. Check the public homepage title, meta description, and social preview tags.
9. Confirm the deployed site is reachable from a different device and network.
10. Submit the sitemap once the public domain is live.

## What to mention in a company review
- The app has a public root landing page, so it is easy to open and present.
- The catalog includes a richer seed set for realistic demo usage.
- The UI has consistent titles, metadata, and a more professional presentation.
- Localhost is only for development; a public URL is needed for Google indexing.
- The submission includes documentation, demo accounts, and a guided flow for reviewers.

## Simple reviewer pitch
> Smart Library is a modern full-stack library management platform with a public landing page, secure role-based access, a richer catalog, and SEO-aware presentation so it is easy to demo, submit, and publish.

## Acceptance summary
- Frontend build passes
- Backend responds on port 8080
- No editor-reported frontend/backend errors
- Live pages render correctly in the browser
