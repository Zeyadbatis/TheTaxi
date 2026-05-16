# CabsOnline – Taxi Booking App (Part 2)

A modern React taxi booking application built as Part 2 of a Web Development Assignment.

## 1. Public URL of Deployed Application

> Replace this placeholder once deployed:  
> **https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/**

---

## 2. Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 6 | Build tool |
| React Router DOM | 6 | Client-side routing |
| Lucide React | 0.474 | Icons |
| localStorage | Browser API | Data persistence |

---

## 3. How to Run Locally

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open your browser at **http://localhost:5173**

---

## 4. How to Build

```bash
npm run build
```

Output is placed in the `dist/` folder. You can preview it with:

```bash
npm run preview
```

---

## 5. How to Deploy to GitHub Pages

### Step 1 – Change the base path in `vite.config.ts`

Open `vite.config.ts` and update the `REPOSITORY_NAME` constant to match your GitHub repository name:

```ts
// Change this:
const REPOSITORY_NAME = "/";

// To this (use your actual repository name):
const REPOSITORY_NAME = "/YOUR_REPOSITORY_NAME/";
```

### Step 2 – Push to GitHub

Create a repository on GitHub and push your code to the `main` branch.

### Step 3 – Enable GitHub Pages

1. Go to your repository on GitHub.
2. Click **Settings** → **Pages**.
3. Under **Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will run automatically on every push to `main`.

### Step 4 – View your site

After the workflow completes, your site will be live at:

```
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/
```

---

## 6. Microservice API Endpoints

No backend API is used in this project. All data is stored in the browser using **localStorage** as this is a prototype/assignment submission.

localStorage keys used:
- `cabsOnline_bookings` — stores all booking records
- `cabsOnline_drivers` — stores all driver records

---

## 7. Feature Descriptions

### Book Taxi
- Customer fills in a form with name, phone, address details, pickup and destination suburbs, and date/time.
- Validation ensures required fields are filled and the phone number is 10–12 digits.
- Pickup date and time cannot be in the past.
- On submit, a unique reference number is generated (BRN00001, BRN00002, …).
- Booking is saved to localStorage with status `unassigned`.
- A confirmation screen shows the reference number, pickup date, and time.

### Admin Dashboard
- Shows stats: total bookings, unassigned, assigned, available drivers.
- By default shows "urgent" bookings (unassigned, pickup within 2 hours).
- Admin can search by reference number (must match format BRN + 5 digits).
- Admin can assign an available driver to an unassigned booking.
- After assignment: booking status → `assigned`, driver status → `Busy`.

### Driver Directory
- Displays all drivers as cards with avatar, name, driver ID, phone, car model, suburb, and availability.
- Filters: search by driver ID, name, or suburb; filter by availability status.

### Track Booking
- Customer enters a reference number to look up a booking.
- Shows full details: customer info, pickup/destination, date/time, status, assigned driver, and estimated arrival time.
- Clear status messages for unassigned vs assigned bookings.

---

## 8. Testing Instructions

### Sample Data

The app initialises sample data on first load. You can use these to test:

**Sample Booking References:**
- `BRN00001` — unassigned booking (Auckland CBD → Newmarket)
- `BRN00002` — assigned booking (Mount Eden → Auckland CBD, driver: James Tane)

**Sample Driver IDs:**
- `D001` — James Tane (Auckland CBD, Available)
- `D002` — Sarah Nguyen (Newmarket, Available)
- `D003` — Mike Parata (Mount Eden, Available)
- `D004` — Lucy Chen (Manukau, Available)
- `D005` — Tom Faleolo (North Shore, Available)
- `D006` — Anna Williams (Ponsonby, Busy)
- `D007` — Ben Hopa (Takapuna, Available)
- `D008` — Priya Sharma (Botany, Available)

### Manual Test Steps

1. **Book a taxi**: Go to Book Taxi, fill in the form, submit — confirm the BRN reference appears.
2. **Admin assign**: Go to Admin Dashboard, search `BRN00001`, click Assign Driver, pick a driver, confirm.
3. **Track a booking**: Go to Track Booking, enter `BRN00001` or `BRN00002`, check the status.
4. **Driver filter**: Go to Drivers, filter by "Available" or search by suburb like "Auckland CBD".

---

## 9. Limitations / Known Issues

- Data is stored in `localStorage` only — it is cleared if the user clears their browser data or opens a different browser.
- No real-time updates — the admin must refresh the page to see new bookings from another session.
- No authentication — the admin dashboard is accessible to anyone.
- PDF receipt download is not implemented in this version.
- No real GPS or map integration — estimated arrival is calculated from the pickup time only.

---

## 10. Reflection on AI-Supported Development Process

This project was built with assistance from an AI coding agent (Replit Agent). The AI helped by:

- **Scaffolding the project structure** — setting up the React + Vite + TypeScript configuration cleanly.
- **Generating boilerplate** — form handling, localStorage utilities, and validation logic were produced quickly without manual repetition.
- **Implementing all four pages** — Book Taxi, Admin Dashboard, Driver Directory, and Track Booking were built in parallel.
- **Configuring GitHub Pages deployment** — the workflow file and Vite base path configuration were set up correctly on the first attempt.

**Challenges encountered:**
- Ensuring the Vite config was compatible with both local development and GitHub Pages (handled via the `REPOSITORY_NAME` constant).
- Removing Replit-specific plugins and `catalog:` dependency versions to produce a standard `npm install`-compatible `package.json`.

**Reflections:**
- AI assistance significantly reduced development time for repetitive code (form validation, localStorage reads/writes).
- The AI still required clear, specific instructions — vague prompts produced generic results.
- All AI-generated code was reviewed to ensure it matched the assignment requirements.
- Understanding the code remains important even when AI generates it — the student is responsible for being able to explain and modify it.
