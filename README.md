# Smart Restaurant Admin Dashboard – Table Management

This project is a **frontend prototype** for the *Smart Restaurant* admin dashboard, focusing on the **Table Management** and **QR code** features from your weekly assignment.

It is built with:

- **React + TypeScript**
- **Vite** (bundler/dev server)
- A small **design system** under `src/components/ui` (buttons, inputs, dialogs, tables, etc.)

The code currently uses **mock data only** (no real backend), but the structure is ready to be wired to real APIs later.

---

## 1. Getting Started

### Install dependencies

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Open the printed URL in your browser (usually `http://localhost:5173`).

---

## 2. Project Structure (Overview)

Important folders inside `src/`:

- `app/`
  - `main.tsx` – bootstraps React and mounts the app.
  - `App.tsx` – **layout shell + simple routing** between pages (Dashboard, Tables, etc.).

- `components/`
  - `layout/Sidebar.tsx` – left navigation sidebar for the admin panel.
  - `ui/` – **reusable design system components**, grouped by type:
    - `misc/` – `button`, `dropdown-menu`, `toggle`, etc.
    - `forms/` – `input`, `select`, `checkbox`, `radio-group`, `switch`, `slider`, `form` helpers.
    - `data-display/` – `card`, `table`, `badge`, `avatar`, `calendar`, `chart`, etc.
    - `feedback/` – `alert`, `alert-dialog`, `progress`, `skeleton`, `sonner` (toast).
    - `layout/` – `accordion`, `collapsible`, `scroll-area`, `resizable`, etc.
    - `overlays/` – `dialog`, `drawer`, `hover-card`, `sheet`, `tooltip`, `context-menu`.

- `features/`
  - `dashboard/pages/DashboardPage.tsx` – simple placeholder dashboard (high-level stats).
  - `tables/`
    - `types/table.types.ts` – `Table` type definition.
    - `components/` – UI blocks for the Table Management feature:
      - `ActionBar.tsx` – buttons for *Add Table* and *Download all QR*.
      - `StatsBar.tsx` – total/occupied/available table stats.
      - `FilterBar.tsx` – search + filters (status, zone) + sort options.
      - `TableCard.tsx` – card for a single table (status, capacity, zone, order info).
      - `TableGrid.tsx` – responsive grid of `TableCard`s.
      - `dialogs/AddTableDialog.tsx` – **create table** form (react-hook-form + zod validation).
      - `dialogs/EditTableDialog.tsx` – **edit table** form (update number, capacity, location, status).
      - `dialogs/QRPreviewDialog.tsx` – QR code management dialog (preview + PNG/PDF buttons).
      - `dialogs/PDFTemplate.tsx` – **A6 portrait print template** for a single table:
        - Logo + “Smart Restaurant”
        - Table badge (e.g. `01`)
        - Large QR code placeholder with green frame
        - CTA *“SCAN TO ORDER”*
        - Footer with WiFi info and table info
      - `dialogs/PDFPreviewDialog.tsx` – dialog wrapper that previews the A6 PDF template and provides:
        - **Close**
        - **Print** (`window.print()` – for now prints the whole page)
        - **Download PDF** (currently a placeholder `alert`)
    - `pages/TablesPage.tsx` – main **Table Management** page:
      - Holds mock table state, filters, sort logic.
      - Renders `ActionBar`, `StatsBar`, `FilterBar`, `TableGrid`.
      - Controls all table dialogs (Add/Edit/QR/PDF).

---

## 3. Table Management – Current Frontend Behaviour

### Data Model

`src/features/tables/types/table.types.ts`:

- `id: number`
- `tableNumber: string` (e.g. `T-01`, `VIP-01`)
- `capacity: number`
- `zone: string` (e.g. `Main Hall`, `VIP`, `Patio`)
- `status: 'Active' | 'Occupied' | 'Inactive'`
- `orderData?` – optional active order info for occupied tables.

Currently, data is **stored only in React state** inside `TablesPage` using a hard-coded `initialTables` array.

### Features implemented with mock data

- **Create Table**
  - `AddTableDialog` uses `react-hook-form` + `zod`:
    - `tableNumber` – required, pattern `[A-Za-z0-9-]+`.
    - `capacity` – slider 1–20.
    - `zone` – select (`Main Hall`, `VIP`, `Patio`).
    - `status` – toggle Active/Inactive.
  - On submit, a new table is added to state with a generated `id`.

- **View Tables**
  - `TableGrid` shows cards with:
    - Number, capacity, zone, status chip.
    - For occupied tables: active orders + total bill summary.

- **Filter & Sort**
  - Search by `tableNumber`.
  - Filter by **Status** (`All`, `Active`, `Occupied`, `Inactive`).
  - Filter by **Zone** (`All`, `Main Hall`, `VIP`, `Patio`).
  - Sort by **Default**, **Table Number**, **Capacity**, **Recently Created**.

- **Edit Table**
  - `EditTableDialog` lets you change `tableNumber`, `capacity`, `zone`, `status`.
  - When status becomes `Occupied` and there is no `orderData`, basic mock `orderData` is created.

- **Deactivate / Reactivate**
  - Changing `status` to `Inactive` visually dims the card and disables QR preview.
  - This is a **soft delete** on the frontend; no data is removed.

- **QR Preview & PDF**
  - `QRPreviewDialog`:
    - Shows mock QR SVG and QR metadata (created date, last scan, token status).
    - Buttons:
      - **PNG**: currently just shows an `alert()`.
      - **PDF (Print)**: opens `PDFPreviewDialog`.
  - `PDFPreviewDialog`:
    - Shows an A6 portrait card (`PDFTemplate`) with:
      - Brand logo circle.
      - Table badge.
      - Large QR code placeholder.
      - CTA and WiFi info.
    - Buttons:
      - **Print** – `window.print()` (prints the browser view).
      - **Download PDF** – placeholder, ready to connect to a real backend or client-side PDF generator later.

---

## 4. How to Add a New Page

The app uses a **very simple internal routing** based on the current sidebar selection:

- `App.tsx` holds `currentPage: SidebarPageKey`.
- `Sidebar` (`components/layout/Sidebar.tsx`) calls `onNavigate(pageKey)` when a menu item is clicked.
- `App.renderPage()` chooses which page component to render based on `currentPage`:
  - `'dashboard'` → `DashboardPage`
  - `'tables'` → `TablesPage`
  - Other keys → placeholder “Coming soon”.

To add a new page (e.g. **Customers**):

1. Create the page component, e.g. `src/features/customers/pages/CustomersPage.tsx`.
2. Add a new key to `SidebarPageKey` in `Sidebar.tsx` (e.g. `'customers'`).
3. Add a menu item in `menuItems` with that key.
4. Extend `renderPage()` in `App.tsx` to return `<CustomersPage />` when `currentPage === 'customers'`.

---

## 5. Customer Menu (QR Code Ordering)

The application includes a **separate customer-facing interface** for ordering food via QR codes. This is completely separated from the admin dashboard.

### Customer App Structure

- **Location**: `src/features/customer/`
- **Routing**: Automatically detected when URL path starts with `/customer` or `/menu`
- **URL Format**: `/customer/menu?token=<QR_TOKEN>&table=<TABLE_NUMBER>`

### Features

- ✅ **Responsive Mobile Design**: Optimized for mobile devices (primary use case)
- ✅ **Menu Display**: Shows available menu items with images, descriptions, and prices
- ✅ **Category Filtering**: Filter items by category (All, Appetizer, Main Course, Dessert, etc.)
- ✅ **Search**: Search menu items by name or description
- ✅ **Shopping Cart**: Add items to cart, adjust quantities, and view total
- ✅ **QR Token Integration**: Loads menu based on QR token from scanned code
- ✅ **Table Number Display**: Shows table number in header

### Usage

1. **For Development/Testing**:
   - Navigate to `/customer/menu` (without token) to see mock menu data
   - Navigate to `/customer/menu?token=test123&table=5` to test with token

2. **For Production**:
   - QR codes should link to: `/customer/menu?token=<GENERATED_TOKEN>&table=<TABLE_NUMBER>`
   - The app will fetch menu items from API endpoint: `/api/customer/menu?token=<TOKEN>`

### API Integration

The customer menu API service is located at `src/features/customer/services/menu.api.ts`:

```typescript
customerMenuApi.fetchMenuByToken(token: string): Promise<CustomerMenuResponse>
```

**Response Format**:
```typescript
{
  items: MenuItem[];
  tableNumber?: string;
  restaurantName?: string;
}
```

### Separation from Admin

- **Admin routes**: All routes except `/customer/*` and `/menu/*`
- **Customer routes**: `/customer/*` and `/menu/*`
- **No authentication required** for customer routes
- **Separate components** in `src/features/customer/` folder
- **Independent styling** optimized for mobile devices

### Components

- `CustomerMenuPage.tsx` - Main customer menu page with filtering, search, and cart
- `CustomerApp.tsx` - Customer app wrapper that handles routing and URL params
- `menu.api.ts` - API service for fetching menu by QR token

---

## 6. Next Steps (to connect with a real backend)

The current implementation is **frontend-only**. To align fully with the assignment spec:

- Create a **tables API service layer**, for example `src/features/tables/utils/tables.api.ts`, with methods:
  - `fetchTables(params)` → `GET /api/admin/tables`
  - `createTable(payload)` → `POST /api/admin/tables`
  - `updateTable(id, payload)` → `PUT /api/admin/tables/:id`
  - `updateTableStatus(id, status)` → `PATCH /api/admin/tables/:id/status`
  - `generateTableQR(id)` → `POST /api/admin/tables/:id/qr/generate`
  - `downloadTableQR(id, format)` → `GET /api/admin/tables/:id/qr/download`
- Move table state and side effects into a hook like `useTables()` under `src/features/tables/hooks/`.
- Replace mock QR SVGs with:
  - `react-qr-code` to render a real QR (for preview), or
  - PNG/PDF blobs returned from the backend for download/print.
- Implement real **PDF download** in `PDFPreviewDialog`:
  - Call `GET /api/admin/tables/:id/qr/download?format=pdf`.
  - Use `file-saver` to download the returned blob.

---

## 6. Notes

- The design system under `src/components/ui` is intended for **reuse across all features**.  
  When building new screens, prefer importing from here instead of hand-styling new buttons/inputs.
- All QR/token data in this repo is currently **mocked**; do not use it for real security logic.

This README is meant as a quick orientation and to show how the current frontend matches the Table Management assignment requirements and how it can be extended. 


  # Admin Dashboard Design


  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  