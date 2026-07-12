# TransitOps MVP

TransitOps is a modern, full-stack fleet management application built for the **Odoo Hackathon**. It provides complete operational visibility, role-based access control (RBAC), and strict state-machine enforcement for managing vehicles, drivers, trips, and expenses.

## Tech Stack

### Frontend
- **Next.js 14+ (App Router)**
- **React** (Server & Client Components)
- **Tailwind CSS** (for styling)
- **TypeScript**
- **Lucide React** (icons)
- **Axios** (API requests)

### Backend
- **Node.js + Express**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL** (Hosted on Neon)
- **Bcrypt & JWT** (Authentication)

## Project Structure

The repository is organized into a monorepo setup with two main directories:

- `/frontend` - Contains the Next.js web application.
- `/backend` - Contains the Express API and Prisma database schema.

## Core Features

- **Role-Based Access Control (RBAC):** Four strict roles (Fleet Manager, Dispatcher, Safety Officer, Financial Analyst) ensuring users only see and interact with what they are authorized to.
- **Vehicle & Driver State Machines:** Vehicles and drivers have strict statuses (`AVAILABLE`, `ON_TRIP`, `IN_SHOP`, `SUSPENDED`, etc.) preventing double-dispatching or dispatching retired vehicles.
- **Trip Lifecycle Management:** Complete end-to-end trip management from `DRAFT` to `DISPATCHED` to `COMPLETED`.
- **Maintenance & Expenses:** Track service records, fuel logs, and miscellaneous expenses with automatic vehicle status updates (e.g., automatically placing a vehicle `IN_SHOP` during maintenance).
- **Interactive Dashboards & Reports:** Real-time KPIs and dynamic charts calculating operational costs, fuel efficiency, and fleet utilization.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL Database URL

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure your database and JWT secret:
   ```env
   DATABASE_URL="postgresql://user:pass@host/dbname?pgbouncer=true"
   JWT_SECRET="your-super-secret-key"
   PORT=4005
   ```
4. Push the Prisma schema and run the seed script to populate test data:
   ```bash
   npx prisma db push
   npx prisma generate
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file and configure the API URL:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:4005/api"
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Demo Accounts

You can use the following seeded accounts to test the application (Password for all: `demo123`):

- `fleet@transitops.com` (Fleet Manager - Full Access)
- `dispatch@transitops.com` (Dispatcher - Operations Access)
- `safety@transitops.com` (Safety Officer - Fleet/Driver Focus)
- `finance@transitops.com` (Financial Analyst - Expense/Reports Focus)
