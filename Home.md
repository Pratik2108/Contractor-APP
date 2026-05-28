# Go2Roofing Command

Welcome to **Go2Roofing Command**! This is the central repository for the Contractor Team Management & Scheduling WebApp.

> **⚠️ IMPORTANT NOTE FOR VIEWING ON GITHUB**
> GitHub is a code storage platform and **cannot** run full-stack applications (like this one with a database) directly in the browser when you click on files. 
> 
> To actually **run** and use this app on your iPad or any other device over the internet, the code must be deployed to a hosting service (like Vercel, Heroku, or Render) with a cloud database.

## Features Built
- **Owner Dashboard (Desktop):** Kanban board for jobs, master calendar view, and a real-time live photo feed.
- **Employee Field View (Mobile):** Massive touch targets, clock in/out gate, scope of work checklist, and photo upload buttons.
- **Real-time Sync:** The owner dashboard updates automatically as employees check off tasks and upload photos in the field.

## How to Run Locally (On a Computer)
1. Open your terminal in this folder.
2. Run `npm install`
3. Run `npm run dev`
4. Open `http://localhost:3000` in your browser.

*The app uses a local SQLite database (`dev.db`) which automatically seeds itself with demo data on the first run.*
