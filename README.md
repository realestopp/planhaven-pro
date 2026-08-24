# EventFlow Pro

Role & Goal:

You are an expert full-stack developer and UI/UX designer. Build a modern vertical SaaS application called EventFlow, designed for boutique event and wedding planners to manage budgets, vendors, guest lists, and timelines.

Design System & Styling Rules (Modern Neo-Brutalism):

Vibe: Bold, structured, playful yet ultra-professional.

Borders & Shadows: Thick black borders (⁠border-2⁠ or ⁠border-4 border-black⁠), sharp corners (⁠rounded-none⁠ or ⁠rounded-sm⁠), and hard offset drop shadows (⁠shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]⁠).

Color Palette: High-contrast background with vibrant accents.

Base: Background ⁠#F4F0EA⁠ (off-white/cream) or ⁠#FFFFFF⁠, pure black text ⁠#000000⁠.

Accents: Bright Electric Yellow (⁠#FFE600⁠), Neo Pink (⁠#FF52D9⁠), Vibrant Cyan (⁠#00E5FF⁠), and Lime Green (⁠#00FF66⁠ for success states).

Typography: Bold sans-serif headers (e.g., Space Grotesk, Syne, or Inter Black), uppercase labels, high weight contrast, badge-style tags.

Components: Cards, buttons, and inputs must use thick black outlines, hard shadows on hover, and distinct color block headers.

App Architecture & Navigation:

Create a side-navigation layout (collapsible) with a top bar showing active project switching.

Primary Pages/Views to Build:

1. Dashboard (Overview):

High-level stat cards with neo-brutalism borders: Active Events, Total Budget Spent, Pending RSVPs, Upcoming Deadlines.

Quick-action buttons: "New Event", "Add Vendor", "Export Budget".

Timeline widget showing upcoming milestones.

2. Event & Task Manager (Kanban + List):

Switchable Kanban board and Task list.

Categorized by phase: Planning, Booking, 48h Before, Event Day.

Drag-and-drop styled cards with priority tags (HIGH, MED, LOW).

3. Budget Tracker:

Visual summary (Estimated vs. Actual Spend) with high-contrast progress bars.

Dynamic table listing items: Category (Catering, Venue, Music), Estimated Cost, Actual Cost, Payment Status (Paid, Pending, Deposit).

Interactive "Add Expense" modal.

4. Vendor & Venue Database:

Grid of vendor cards featuring bold contact tags, contract upload status (PDF preview tag), and payment status.

Quick filter by category (Photographer, Caterer, Florist).

5. Guest List & RSVP Manager:

Table view with filters: Attending, Declined, Pending, Meal Choice, Table Assignment.

Quick stat summary bar: Total Invited, Confirmed RSVPs, Plus-Ones count.

6. Client Portal View (Public/Shared Preview):

Read-only layout for event clients with simplified Neo-Brutalist cards showing Timeline progress and Budget summaries.

Technical Features & Mock Data:

Include realistic mock data for 2 active events ("Emma & Alex Wedding", "TechCorp Annual Gala 2026").

Add client-side state (React state or Lucide icons + Tailwind) so users can add new tasks, update budget items, and switch RSVP statuses dynamically.

Fully responsive layout (mobile-friendly with a collapsible drawer navigation).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://planhaven-pro.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2c4e13c6-5437-43b8-b7a0-87e347de0ff7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
