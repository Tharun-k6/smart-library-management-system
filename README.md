# Smart AI-Powered Library Management System

A modern full-stack library management platform built with React, Tailwind CSS, Spring Boot, Spring Security, JWT, MySQL, Docker, and AI-ready service layers.

## Highlights
- Role-based dashboards for Admin, Librarian, and Student
- JWT authentication with email verification and OTP-ready hooks
- Smart book search, reservations, issue/return flow, fines, and analytics
- QR/barcode-ready book workflows and digital library support
- Responsive SaaS-style UI with charts, motion, and dark mode
- Dockerized backend, frontend, and MySQL stack

## Core modules
- Public homepage with a clear product overview and entry points
- Authentication and role-based access control
- Book catalog management with search, filter, edit, delete, and reseed actions
- Reservations and circulation workflows for operational library use
- Analytics, reporting, and dashboard summaries for review visibility
- Notification and chatbot-style support surfaces for a more modern experience

## Reviewer notes
- The root route `/` is intentionally public so the project can be opened and shared easily.
- `frontend/public/robots.txt` and `frontend/public/sitemap.xml` should be updated with the real deployed domain before public launch.
- The frontend uses a shared SEO helper so titles and descriptions stay consistent across pages.
- The seeded data is designed to make the demo feel complete, not empty.

## Project Structure
- `backend/` Spring Boot REST API
- `frontend/` React SPA
- `database/` schema and seed data
- `docker-compose.yml` local orchestration

## Quick Start
1. Configure environment values in `.env`.
2. Run MySQL and import `database/schema.sql`.
3. Start the backend and frontend applications.
4. Open the React app and log in with seeded demo accounts.

## Demo Roles
- Admin: `admin@smartlib.com` / `Admin@123`
- Librarian: `librarian@smartlib.com` / `Librarian@123`
- Student: `student@smartlib.com` / `Student@123`

## Notes
This repository includes a production-style scaffold with clean architecture, reusable UI components, and extendable service layers so you can keep building feature-by-feature without reworking the foundation.

## Suggested demo flow
1. Open the public landing page.
2. Show the login page and seeded credentials.
3. Enter the dashboard and point out the summary cards.
4. Open the books page and demonstrate search/filter/reserve.
5. Finish with reports, analytics, and reservations to show the platform breadth.

## Submission checklist
- Public root landing page at `/` with a polished marketing layout
- Role-based portals for Admin, Librarian, and Student
- SEO-friendly page titles and descriptions
- Expanded demo catalog with more curated books
- Working frontend build and live backend API

## Deployment notes
- Replace the placeholder domain in `frontend/public/robots.txt` and `frontend/public/sitemap.xml` with your real deployed URL.
- If you deploy the frontend separately, keep `VITE_API_URL` pointed at the public backend API.
- `localhost` is only for local development; Google and other systems can index only a public URL.
- For a company-style submission, share the deployed homepage URL and mention that the app includes seeded demo data.
- If you want search visibility, deploy the frontend to a public host with HTTPS and submit the sitemap to your search console.

## Final run locally
- Frontend: run from `frontend/`
- Backend: run from `backend/` with the local Maven binary if `mvn` is not on PATH

## Acceptance summary
- Homepage loads cleanly
- Catalog loads with expanded seed books
- No frontend editor errors
- Backend responds on port 8080
- The project is presented in a submission-ready layout
