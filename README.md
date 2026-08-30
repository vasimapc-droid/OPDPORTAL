# Doctor Appointment & OPD Portal

## Project Title & Overview

**Doctor Appointment & OPD Portal** is a hospital Outpatient Department (OPD) appointment management system with Role-Based Access Control (RBAC). The system allows patients to book appointments with specialist doctors and enables doctors to manage their daily availability and patient queue efficiently.

### Assigned To:
- **Candidate:** Ulfath Vasima M
- **Assigned Project:** Doctor Appointment & OPD Portal

## Features

### Patient Features:
- View available specialist doctors
- Search doctors by name or specialization
- Filter doctors by medical department
- Sort doctors by rating, experience, or consultation fee
- Book appointments with symptoms description
- View smart slot availability (Available, Few Slots, Fully Booked)
- Track queue position with estimated wait time
- View appointment history (Completed & Cancelled)
- View all appointments with status
- Edit personal profile

### Doctor Features:
- View doctor dashboard with statistics
- Set daily availability schedule
- Add/remove time slots for specific dates
- View patient queue with symptoms
- Add consultation notes
- Mark appointments as Completed
- Cancel appointments
- Track waiting, completed, and cancelled patients
- Edit professional profile

### Additional Features:
- Landing page with animations
- Register page with role selection
- Profile management
- Framer Motion animations
- Playwright E2E tests
- Smart slot availability indicator
- Queue position with estimated wait time

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript (.jsx)
- **Styling:** Tailwind CSS (100% mobile responsive)
- **Data Fetching:** Axios
- **Mock Backend:** Next.js Route Handlers (/api/*)
- **Testing:** Playwright (E2E tests)
- **Animations:** Framer Motion

## RBAC (Role-Based Access Control)

### Patient Role:
- Can access: Dashboard, Find Doctors, My Appointments, History, Profile
- Can book appointments with symptoms
- Can view appointment status and queue position
- Cannot manage availability or update appointment status

### Doctor Role:
- Can access: Dashboard, Patient Queue, Availability, Profile
- Can manage daily availability schedule
- Can update appointment status (Completed/Cancelled)
- Can add consultation notes
- Cannot book appointments as patient

## Project Structure
doctor-opd-portal/
├── app/
│ ├── api/
│ │ ├── doctors/ # Doctor API routes
│ │ ├── appointments/ # Appointment API routes
│ │ └── availability/ # Availability API routes
│ ├── login/ # Login page
│ ├── register/ # Register page
│ ├── patient/ # Patient pages
│ │ ├── doctors/ # Find doctors
│ │ ├── appointments/ # My appointments
│ │ ├── history/ # Booking history
│ │ └── profile/ # Patient profile
│ └── doctor/ # Doctor pages
│ ├── availability/ # Manage availability
│ ├── queue/ # Patient queue
│ └── profile/ # Doctor profile
├── components/ # Reusable components
├── services/ # Axios services & data store
├── data/ # Mock data
├── lib/ # Auth & RBAC logic
├── tests/ # Playwright E2E tests
└── context/ # React Context
## Setup Instructions

### Prerequisites:
- Node.js 18+ installed
- npm or yarn

### Installation:

npm install

## Run Development Server:

npm run dev

Open http://localhost:3000 in your browser.

## Build for Production:

npm run build

## Start Production Server:

npm start

## Test Instructions
Automated Testing (Playwright):

npx playwright test
Test Results:

Running 8 tests using 1 worker

  ✓  patient can login
  ✓  patient can view doctors list
  ✓  patient can filter doctors by department
  ✓  doctor can login
  ✓  doctor can view patient queue
  ✓  doctor can view availability page
  ✓  patient cannot access doctor pages
  ✓  doctor cannot access patient pages

  8 passed
## Manual Testing:
- Login as Patient

- Search and filter doctors

- Book an appointment

- View appointments and history

- Edit profile

- Login as Doctor

- View patient queue

- Complete/Cancel appointments

- Manage availability

- Edit profile

## Mock Credentials / Role Switcher Instructions:
Patient Login:
- Email: patient@example.com
- Password: patient123

Doctor Login:
- Email: doctor@example.com
- Password: doctor123

How to Switch Roles:
- Go to the login page

- Click on "Patient" or "Doctor" tab

- Credentials auto-fill based on selected role

- Click "Sign in"

- Live Demo Link
https://opd-portal.vercel.app

- GitHub Repository
https://github.com/vasimapc-droid/OPDPORTAL

## Future Improvements:
- Real authentication with JWT

- PostgreSQL/Database integration

- Email/SMS notifications

- Payment integration

- Hospital administration panel

- Real-time queue updates with WebSockets

- Video consultation

- Prescription generation