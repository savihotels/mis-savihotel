# Hotel Savi Regency MIS (Jaipur)

Production-oriented Hotel MIS and Performance Dashboard built with Next.js + Prisma for a single property, with schema designed for future multi-property expansion.

## Features
- Role-based secure login (Admin/Owner and Staff).
- Immutable daily staff batch submission covering:
  - Front Office Report
  - Daily Expense Report
  - Purchase Report
  - Restaurant Sales Report
  - Banquet/Event Report
  - Cash/Accounts Report
- Owner dashboards for daily/monthly/yearly analysis.
- KPI engine: Occupancy, ARR, RevPAR, average occupancy, MoM growth, YoY-ready structure.
- Insight engine for business observations and alerts.
- Export endpoints for Excel and CSV (PDF can be added with the same service boundary).
- Historical storage with date-range filters ready in API layer.

## Project Structure

```text
app/
  (auth)/login/page.tsx
  (staff)/staff/reports/page.tsx
  (owner)/owner/dashboard/page.tsx
  (owner)/owner/insights/page.tsx
  api/auth/login/route.ts
  api/reports/route.ts
  api/dashboard/route.ts
  api/export/route.ts
components/
  report-form.tsx
  kpi-cards.tsx
lib/
  auth.ts
  prisma.ts
  validations.ts
  kpi.ts
  insights.ts
prisma/
  schema.prisma
  seed.ts
styles/
  globals.css
middleware.ts
```

## Database schema design (high level)
- `Hotel` stores property profile and makes multi-property expansion straightforward.
- `User` linked to `Hotel` with `Role` enum.
- `ReportBatch` is immutable daily submission with unique `(hotelId, reportDate)`.
- Each department report persisted as JSON payload while financial totals are normalized for analytics.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env and update:
   ```bash
   cp .env.example .env
   ```
3. Generate and migrate:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```
4. Seed Jaipur sample data:
   ```bash
   npm run db:seed
   ```
5. Run:
   ```bash
   npm run dev
   ```

## Demo credentials
- Admin: `owner@saviregency.in` / `ChangeMe@123`
- Staff: `staff@saviregency.in` / `ChangeMe@123`

## Reports and analytics endpoints
- Daily/monthly/yearly dashboard JSON:
  - `/api/dashboard?period=daily`
  - `/api/dashboard?period=monthly`
  - `/api/dashboard?period=yearly`
- Excel export: `/api/export?format=excel`
- CSV export: `/api/export?format=csv`

## Render deployment
1. Create a new Web Service from the repo.
2. Set build command: `npm install && npm run db:generate && npm run build`
3. Set start command: `npm run start`
4. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_BASE_URL` (your Render URL)
5. Provision managed PostgreSQL and run migrations using Render shell:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

## Customization roadmap
- Add true multi-property selector for admin super-role.
- Add PDF export service using server-side `jspdf` template format.
- Add deeper departmental forms with line items instead of JSON text areas.
- Add scheduled email insights and WhatsApp alerts.
- Add budgeting module and target-vs-actual dashboards.
