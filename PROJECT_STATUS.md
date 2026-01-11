# 📊 SMART RESTAURANT FE - CURRENT STATUS & GAP ANALYSIS

## ✅ SCREENS ĐANG CÓ (Theo Role)

### 🔐 AUTHENTICATION (2/6 screens)
- ✅ [FE] [Admin] Admin Login Page → `src/features/auth/pages/LoginPage.tsx`
- ✅ [FE] [Customer] Login Page → `src/features/customer/pages/auth/CustomerLoginPage.tsx`
- ✅ [FE] [Customer] Sign Up Page → `src/features/customer/pages/auth/CustomerRegisterPage.tsx`
- ✅ [FE] [Customer] Email Verification Page → `src/features/customer/pages/auth/OTPVerificationPage.tsx`

**❌ MISSING:**
- [FE] [Customer] Social Login (Google OAuth)
- [FE] [Customer] Forgot Password Page
- [FE] [Customer] Reset Password Page

---

### 👤 LOGGED-IN CUSTOMER (1/9 screens)
- ✅ [FE] [Customer] Menu Browsing Page → `src/features/customer/pages/CustomerMenuPage.tsx` (With Cart, Modifiers, Order History Mock)

**❌ MISSING:**
- [FE] [Customer] Profile Page
- [FE] [Customer] Edit Profile Page
- [FE] [Customer] Change Password Page
- [FE] [Customer] Upload Avatar Page
- [FE] [Customer] Order History Page (Full Screen)
- [FE] [Customer] Order Detail Page
- [FE] [Customer] Add Review Page/Modal
- [FE] [Customer] My Reviews Page

---

### 📱 PUBLIC/GUEST (8/9 screens)
- ✅ [FE] [Guest] QR Menu Page → `src/features/customer/pages/CustomerMenuPage.tsx` (Mobile)
- ✅ [FE] [Guest] Menu Item Detail Page (Modal inside CustomerMenuPage)
- ✅ [FE] [Guest] Shopping Cart Page (Drawer inside CustomerMenuPage)

**❌ MISSING:**
- [FE] [Guest] Landing Page / Home
- [FE] [Guest] Order Confirmation Page
- [FE] [Guest] Order Tracking Page (Real-time)
- [FE] [Guest] Bill Request Page
- [FE] [Guest] Payment Page (Stripe)
- [FE] [Guest] Payment Success/Failed Page

---

### 💻 ADMIN DASHBOARD (15/53 screens)

#### Dashboard & Auth (1/2)
- ✅ [FE] [Admin] Dashboard Home (Analytics) → `src/features/dashboard/pages/DashboardPage.tsx`

**❌ MISSING:**
- [FE] [Admin] Profile Settings Page

#### Menu Management (6/9)
- ✅ [FE] [Admin] Categories List Page → `src/features/menu/categories/pages/CategoriesPage.tsx`
- ✅ [FE] [Admin] Add/Edit Category Modal
- ✅ [FE] [Admin] Menu Items List Page → `src/features/menu/pages/MenuPage.tsx`
- ✅ [FE] [Admin] Add New Menu Item Modal
- ✅ [FE] [Admin] Edit Menu Item Modal
- ✅ [FE] [Admin] Modifier Groups Management → `src/features/menu/modifiers/pages/ModifiersPage.tsx`
- ✅ [FE] [Admin] Add/Edit Modifiers Modal

**❌ MISSING:**
- [FE] [Admin] Menu Item Detail View Page
- [FE] [Admin] Upload/Manage Item Photos Page/Modal

#### Table Management (3/5)
- ✅ [FE] [Admin] Tables List Page → `src/features/tables/pages/TablesPage.tsx`
- ✅ [FE] [Admin] Add/Edit Table Modal
- ✅ [FE] [Admin] QR Code Generator (in QR Preview)

**❌ MISSING:**
- [FE] [Admin] QR Code Download/Print Page
- [FE] [Admin] QR Code Regeneration Page

#### Order Management (0/5)
**❌ ALL MISSING:**
- [FE] [Admin] Orders List Page
- [FE] [Admin] Order Detail Page
- [FE] [Admin] Update Order Status Modal
- [FE] [Admin] Kitchen Display System (KDS)
- [FE] [Admin] Order Timer Dashboard

#### Staff Management (0/9)
**❌ ALL MISSING:**
- [FE] [Admin] Admin Accounts List Page
- [FE] [Admin] Create Admin Account Modal
- [FE] [Admin] Edit Admin Account Page
- [FE] [Admin] Waiter Accounts List Page
- [FE] [Admin] Create Waiter Account Modal
- [FE] [Admin] Edit Waiter Account Page
- [FE] [Admin] Kitchen Staff Accounts List Page
- [FE] [Admin] Create Kitchen Staff Account Modal
- [FE] [Admin] Edit Kitchen Staff Account Page

#### Reports & Analytics (0/4)
**❌ ALL MISSING:**
- [FE] [Admin] Revenue Report Page
- [FE] [Admin] Top Items Report Page
- [FE] [Admin] Peak Hours Analytics Page
- [FE] [Admin] Sales by Category Page

---

### 🧑‍🍳 WAITER DASHBOARD (0/12 screens)
**❌ ALL MISSING:**
- [FE] [Waiter] Waiter Login Page
- [FE] [Waiter] Waiter Dashboard Home
- [FE] [Waiter] Pending Orders List Page
- [FE] [Waiter] Order Detail Page
- [FE] [Waiter] Assigned Tables Page
- [FE] [Waiter] Table Detail Page
- [FE] [Waiter] Mark Order as Served Modal
- [FE] [Waiter] Create Bill Page
- [FE] [Waiter] Bill Preview/Print Page
- [FE] [Waiter] Apply Discount Modal
- [FE] [Waiter] Process Payment Page
- [FE] [Waiter] Active Orders Page

---

### 👨‍🍳 KITCHEN DASHBOARD (0/6 screens)
**❌ ALL MISSING:**
- [FE] [Kitchen] Kitchen Staff Login Page
- [FE] [Kitchen] Kitchen Display System (KDS)
- [FE] [Kitchen] Order Queue Page
- [FE] [Kitchen] Order Detail Card
- [FE] [Kitchen] Update Order Status Modal
- [FE] [Kitchen] Completed Orders Archive Page

---

## 🔌 API INTEGRATION STATUS

### ✅ SCREENS WITH API INTEGRATION

| Screen | File | API Status |
|--------|------|-----------|
| Menu Items List | `MenuPage.tsx` | ✅ Has `menuItemApi.ts` |
| Categories List | `CategoriesPage.tsx` | ✅ Has `category.api.ts` |
| Modifiers List | `ModifiersPage.tsx` | ✅ Has `modifier.api.ts` |
| Tables List | `TablesPage.tsx` | ✅ Has `table.api.ts` + `qr.api.ts` |
| Customer Menu | `CustomerMenuPage.tsx` | ✅ Has `customerMenuApi.ts` |
| Customer Auth | `CustomerLogin/Register` | ✅ Has `auth.api.ts` |

### ⚠️ SCREENS WITHOUT API INTEGRATION (Need to Connect)

| Screen | File | Issue |
|--------|------|--------|
| Customer Menu | `CustomerMenuPage.tsx` | ❌ Order History is MOCK data, not real API |
| Admin Dashboard | `DashboardPage.tsx` | ❌ Analytics data is MOCK, no API calls |

### ❌ SCREENS NOT STARTED (Need Full Build)

- All Order Management pages
- All Staff Management pages
- All Reports & Analytics pages
- All Waiter Dashboard pages
- All Kitchen Dashboard pages
- Guest pages (Landing, Order Confirmation, etc.)
- Customer Account pages (Profile, History, Reviews)

---

## 📈 STATISTICS

```
✅ TOTAL SCREENS BUILT:     ~20 screens
❌ TOTAL SCREENS MISSING:   ~86 screens
📊 COMPLETION RATE:         ~19% (20/106)

By Role:
- Admin Dashboard:    29% complete (15/53)
- Customer Screens:   33% complete (5/15)
- Waiter Dashboard:   0% complete (0/12)
- Kitchen Dashboard:  0% complete (0/6)
- Shared/Auth:        67% complete (4/6)
```

---

## 🎯 PRIORITY FEATURES TO BUILD NEXT

### 🔴 CRITICAL (Block Customer Usage)
1. ✅ Customer Login/Register (DONE)
2. ✅ Customer Menu (DONE)
3. ❌ **Order Confirmation Page** - Need to build
4. ❌ **Payment Page** (Stripe integration) - Need to build
5. ❌ **Order Tracking Page** (Real-time) - Need to build

### 🟠 HIGH (Block Admin Full Features)
1. ❌ **Order Management Pages** - Admin needs to see/manage orders
2. ❌ **Kitchen Display System (KDS)** - Core feature for restaurant
3. ❌ **Waiter Dashboard** - Staff needs interface

### 🟡 MEDIUM (Nice to Have)
1. ❌ Customer Profile Pages
2. ❌ Reports & Analytics
3. ❌ Staff Management

### 🟢 LOW (Polish)
1. ❌ Social Login
2. ❌ Advanced Reviews System

---

## 🔗 BACKEND API STATUS & FRONTEND API SERVICES

### ✅ BACKEND ENDPOINTS AVAILABLE (From Handler)

#### 🔐 Authentication Endpoints
```
POST   /api/user/signup                          ✅ Already exists
POST   /api/user/login                           ✅ Already exists
POST   /api/auth/request-signup-otp              ✅ Already exists
POST   /api/auth/validate-signup-otp             ✅ Already exists
POST   /api/auth/request-reset-password          ✅ Already exists
POST   /api/auth/validate-otp                    ✅ Already exists
POST   /api/auth/reset-password                  ✅ Already exists
```

#### 🏢 Table Management Endpoints
```
GET    /api/admin/tables                         ✅ Already exists
GET    /api/admin/tables/:id                     ✅ Already exists
POST   /api/admin/tables                         ✅ Already exists
PUT    /api/admin/tables/:id                     ✅ Already exists
PATCH  /api/admin/tables/:id/status              ✅ Already exists
POST   /api/admin/tables/:id/qr/generate         ✅ Already exists
GET    /api/admin/tables/:id/qr/download         ✅ Already exists
GET    /api/admin/tables/qr/download-all         ✅ Already exists
GET    /api/admin/tables/:id/qr                  ✅ Already exists
```

#### 📋 Menu Management (Admin) Endpoints
```
GET    /api/admin/menu/categories                ✅ Already exists
GET    /api/admin/menu/categories/:id            ✅ Already exists
POST   /api/admin/menu/categories                ✅ Already exists
PUT    /api/admin/menu/categories/:id            ✅ Already exists
PATCH  /api/admin/menu/categories/:id/status     ✅ Already exists
DELETE /api/admin/menu/categories/:id            ✅ Already exists

GET    /api/admin/menu/items                     ✅ Already exists
GET    /api/admin/menu/items/:id                 ✅ Already exists
POST   /api/admin/menu/items                     ✅ Already exists
PUT    /api/admin/menu/items/:id                 ✅ Already exists
DELETE /api/admin/menu/items/:id                 ✅ Already exists

GET    /api/admin/menu/modifier-groups           ✅ Already exists
POST   /api/admin/menu/modifier-groups           ✅ Already exists
PUT    /api/admin/menu/modifier-groups/:id       ✅ Already exists
DELETE /api/admin/menu/modifier-groups/:id       ✅ Already exists
POST   /api/admin/menu/modifier-groups/:id/options ✅ Already exists

PUT    /api/admin/menu/modifier-options/:id      ✅ Already exists
DELETE /api/admin/menu/modifier-options/:id      ✅ Already exists
```

#### 📋 Menu Management (Customer) Endpoints
```
GET    /api/menu                                 ✅ Already exists
GET    /api/menu/items/:id                       ✅ Already exists
POST   /api/menu/items/:id/modifier-groups       ✅ Already exists
DELETE /api/menu/items/:id/modifier-groups/:groupId ✅ Already exists
```

#### 📤 File Upload Endpoint
```
POST   /api/admin/upload                         ✅ Already exists
```

---

### ❌ FRONTEND API SERVICES THAT NEED TO BE CREATED

1. **orderApi.ts** - Order Management
   - Get orders list, Get order by ID, Update order status
   - Get orders by table, Get kitchen queue
   - Submit order, Track order (Real-time), Cancel order

2. **paymentApi.ts** - Payment Processing
   - Create payment intent, Process payment, Confirm payment
   - Generate bill, Apply discount code

3. **customerApi.ts** - Customer Account Management
   - Get/Update profile, Change password, Upload avatar
   - Get order history, Get order detail
   - Get reviews, Submit review

4. **staffApi.ts** - Staff Management
   - Admin accounts: Get, Create, Update, Delete
   - Waiters: Get, Create, Update, Delete
   - Kitchen staff: Get, Create, Update, Delete

5. **analyticsApi.ts** - Reports & Analytics
   - Revenue report, Top items report
   - Peak hours analytics, Sales by category
   - Dashboard statistics

6. **waiterApi.ts** - Waiter Operations
   - Get pending orders, Get assigned tables
   - Mark order as served, Create bill
   - Process payment, Get active orders

7. **kitchenApi.ts** - Kitchen Operations
   - Get order queue (Real-time), Update order status
   - Get completed orders, Acknowledge order

8. **authApi.ts** - Extended Authentication
   - Google login, Social login (OAuth)

---

### 📊 API COVERAGE SUMMARY

| Category | Backend Ready | Frontend Service | Status |
|----------|--------------|-----------------|--------|
| Authentication | 7/7 | auth.api.ts | ✅ 100% (Partial) |
| Menu Management | 14/14 | menuItemApi.ts, categoryApi.ts, modifierApi.ts | ✅ 100% |
| Table Management | 9/9 | table.api.ts, qr.api.ts | ✅ 100% |
| Order Management | 0/8 | ❌ orderApi.ts | ❌ 0% |
| Payment | 0/5 | ❌ paymentApi.ts | ❌ 0% |
| Customer Account | 0/7 | ❌ customerApi.ts | ❌ 0% |
| Staff Management | 0/9 | ❌ staffApi.ts | ❌ 0% |
| Analytics | 0/5 | ❌ analyticsApi.ts | ❌ 0% |
| Waiter Operations | 0/6 | ❌ waiterApi.ts | ❌ 0% |
| Kitchen Operations | 0/4 | ❌ kitchenApi.ts | ❌ 0% |
| **TOTAL** | **39/53** | **6 services** | **~41%** |

---

## ALL MISSING ENDPOINTS BY ROLE & SCREEN

### CUSTOMER ROLE

#### Authentication Screens
**[FE] Social Login (Google OAuth)**
- Endpoints needed:
  - `POST /api/auth/google-login` - Google login handler

**[FE] Forgot Password Page**
- Endpoints needed:
  - `POST /api/auth/request-reset-password` - ✅ Already exists

**[FE] Reset Password Page**
- Endpoints needed:
  - `POST /api/auth/reset-password` - ✅ Already exists

#### Customer Account Screens
**[FE] Profile Page**
- Endpoints needed:
  - `GET /api/customer/profile` - Get customer profile
  - `PUT /api/customer/profile` - Update profile
  - `POST /api/customer/avatar` - Upload avatar
  - `PATCH /api/customer/password` - Change password

**[FE] Order History Page**
- Endpoints needed:
  - `GET /api/customer/orders` - Get order history with filters/pagination

**[FE] Order Detail Page**
- Endpoints needed:
  - `GET /api/customer/orders/:id` - Get specific order details

**[FE] My Reviews Page**
- Endpoints needed:
  - `GET /api/customer/reviews` - Get customer reviews
  - `POST /api/customer/reviews` - Submit review for order

#### Guest/Public Order Flow Screens
**[FE] Order Confirmation Page**
- Endpoints needed:
  - `POST /api/orders` - Submit order (cart → order)
  - `GET /api/orders/:id/confirmation` - Get confirmation data

**[FE] Order Tracking Page**
- Endpoints needed:
  - `GET /api/orders/:id/status` - Track order status (Real-time WebSocket)
  - `GET /api/orders/:id/timeline` - Get order timeline

**[FE] Bill Request Page**
- Endpoints needed:
  - `POST /api/bills/request` - Request bill for table
  - `GET /api/bills/:id` - Get bill details

**[FE] Payment Page (Stripe Integration)**
- Endpoints needed:
  - `POST /api/payments/intent` - Create Stripe payment intent
  - `POST /api/payments/confirm` - Confirm payment
  - `POST /api/payments/apply-discount` - Apply discount code

**[FE] Payment Success/Failed Page**
- Endpoints needed:
  - `GET /api/payments/:id/status` - Check payment status

**[FE] QR Menu Integration**
- Endpoints needed:
  - `GET /api/tables/:tableToken/info` - Get table info from QR token
  - `GET /api/menu?tableId=:id` - Load menu for specific table

---

### WAITER ROLE

#### Waiter Dashboard Screens
**[FE] Waiter Login (Shared with Admin)**
- Endpoints needed:
  - `POST /api/auth/waiter-login` - Waiter login endpoint

**[FE] Waiter Dashboard Home**
- Endpoints needed:
  - `GET /api/waiter/dashboard/stats` - Get waiter dashboard stats
  - `GET /api/waiter/orders/pending` - Pending orders count

**[FE] Pending Orders List Page**
- Endpoints needed:
  - `GET /api/waiter/orders/pending` - Get pending orders (paginated)
  - `GET /api/waiter/orders/pending/count` - Real-time count

**[FE] Order Detail Page (Waiter)**
- Endpoints needed:
  - `GET /api/orders/:id` - Get order details
  - `PATCH /api/orders/:id/items/:itemId/status` - Accept/Reject item

**[FE] Assigned Tables Page**
- Endpoints needed:
  - `GET /api/waiter/tables` - Get assigned tables
  - `GET /api/waiter/tables/:id/status` - Table status (Real-time)

**[FE] Table Detail Page**
- Endpoints needed:
  - `GET /api/waiter/tables/:id` - Get table details
  - `GET /api/waiter/tables/:id/orders` - Get table's orders

**[FE] Create Bill Page**
- Endpoints needed:
  - `POST /api/bills` - Create bill for order
  - `GET /api/orders/:id/bill-summary` - Get bill summary

**[FE] Bill Preview/Print Page**
- Endpoints needed:
  - `GET /api/bills/:id` - Get bill details
  - `GET /api/bills/:id/pdf` - Generate bill PDF

**[FE] Apply Discount Modal**
- Endpoints needed:
  - `POST /api/bills/:id/discount` - Apply discount code
  - `POST /api/discounts/validate` - Validate discount code

**[FE] Process Payment Page**
- Endpoints needed:
  - `POST /api/payments/process` - Process payment (Cash/Card/E-wallet)
  - `PATCH /api/bills/:id/status` - Mark bill as paid

**[FE] Active Orders Page**
- Endpoints needed:
  - `GET /api/waiter/orders/active` - Get in-progress orders

---

### 👨‍🍳 KITCHEN ROLE

#### Kitchen Dashboard Screens
**[FE] Kitchen Staff Login**
- Endpoints needed:
  - `POST /api/auth/kitchen-login` - Kitchen staff login

**[FE] Kitchen Display System (KDS) Main Page**
- Endpoints needed:
  - `GET /api/kitchen/orders/queue` - Get order queue (Real-time WebSocket)
  - `GET /api/kitchen/stats` - Kitchen stats (pending/preparing/ready)

**[FE] Order Queue Page**
- Endpoints needed:
  - `GET /api/kitchen/orders/pending` - Pending orders by time
  - `WebSocket /ws/kitchen/orders` - Real-time order updates

**[FE] Order Detail Card**
- Endpoints needed:
  - `GET /api/kitchen/orders/:id` - Get order details
  - `GET /api/kitchen/orders/:id/timer` - Get order timer (Real-time)

**[FE] Update Order Status Modal**
- Endpoints needed:
  - `PATCH /api/kitchen/orders/:id/status` - Update to Preparing/Ready/Done
  - `POST /api/kitchen/orders/:id/alert` - Send alert to waiter

**[FE] Completed Orders Archive Page**
- Endpoints needed:
  - `GET /api/kitchen/orders/completed` - Get completed orders
  - `GET /api/kitchen/orders/completed?dateRange=...` - Filter by date

---

### 💼 ADMIN/STAFF MANAGEMENT ROLE

#### Staff Management Screens
**[FE] Admin Accounts List Page**
- Endpoints needed:
  - `GET /api/admin/staff/admins` - Get all admin accounts
  - `GET /api/admin/staff/admins?search=...&page=...` - Search & paginate

**[FE] Create Admin Account Modal**
- Endpoints needed:
  - `POST /api/admin/staff/admins` - Create new admin
  - `POST /api/admin/staff/admins/send-invite` - Send invite email

**[FE] Edit Admin Account Page**
- Endpoints needed:
  - `GET /api/admin/staff/admins/:id` - Get admin details
  - `PUT /api/admin/staff/admins/:id` - Update admin
  - `DELETE /api/admin/staff/admins/:id` - Delete admin

**[FE] Waiter Accounts List Page**
- Endpoints needed:
  - `GET /api/admin/staff/waiters` - Get all waiters
  - `GET /api/admin/staff/waiters?search=...&page=...` - Search & paginate

**[FE] Create Waiter Account Modal**
- Endpoints needed:
  - `POST /api/admin/staff/waiters` - Create new waiter
  - `POST /api/admin/staff/waiters/send-invite` - Send invite

**[FE] Edit Waiter Account Page**
- Endpoints needed:
  - `GET /api/admin/staff/waiters/:id` - Get waiter details
  - `PUT /api/admin/staff/waiters/:id` - Update waiter
  - `DELETE /api/admin/staff/waiters/:id` - Delete waiter
  - `PATCH /api/admin/staff/waiters/:id/assign-tables` - Assign tables

**[FE] Kitchen Staff Accounts List Page**
- Endpoints needed:
  - `GET /api/admin/staff/kitchen` - Get all kitchen staff
  - `GET /api/admin/staff/kitchen?search=...&page=...` - Search & paginate

**[FE] Create Kitchen Staff Account Modal**
- Endpoints needed:
  - `POST /api/admin/staff/kitchen` - Create kitchen staff
  - `POST /api/admin/staff/kitchen/send-invite` - Send invite

**[FE] Edit Kitchen Staff Account Page**
- Endpoints needed:
  - `GET /api/admin/staff/kitchen/:id` - Get kitchen staff details
  - `PUT /api/admin/staff/kitchen/:id` - Update kitchen staff
  - `DELETE /api/admin/staff/kitchen/:id` - Delete kitchen staff

---

### ADMIN/REPORTS & ANALYTICS ROLE

#### Reports Screens
**[FE] Revenue Report Page**
- Endpoints needed:
  - `GET /api/admin/reports/revenue?from=...&to=...` - Revenue data
  - `GET /api/admin/reports/revenue/chart` - Chart data

**[FE] Top Items Report Page**
- Endpoints needed:
  - `GET /api/admin/reports/top-items?from=...&to=...` - Top items data
  - `GET /api/admin/reports/top-items/chart` - Chart data

**[FE] Peak Hours Analytics Page**
- Endpoints needed:
  - `GET /api/admin/reports/peak-hours?from=...&to=...` - Peak hours data
  - `GET /api/admin/reports/peak-hours/chart` - Heatmap/chart data

**[FE] Sales by Category Page**
- Endpoints needed:
  - `GET /api/admin/reports/sales-by-category?from=...&to=...` - Sales by category
  - `GET /api/admin/reports/sales-by-category/chart` - Chart data

#### Admin Dashboard (Enhanced)
**[FE] Dashboard Home (Connect with Real API)**
- Endpoints needed:
  - `GET /api/admin/dashboard/stats` - Dashboard statistics
  - `GET /api/admin/dashboard/orders/today` - Today's orders
  - `GET /api/admin/dashboard/revenue/today` - Today's revenue
  - `GET /api/admin/dashboard/chart` - Chart data

**[FE] Profile Settings Page**
- Endpoints needed:
  - `GET /api/admin/profile` - Get admin profile
  - `PUT /api/admin/profile` - Update profile
  - `POST /api/admin/profile/avatar` - Upload avatar
  - `PATCH /api/admin/password` - Change password

---

### 📋 ADMIN/ORDER MANAGEMENT ROLE

#### Order Management Screens
**[FE] Orders List Page**
- Endpoints needed:
  - `GET /api/admin/orders` - Get all orders
  - `GET /api/admin/orders?status=...&date=...&search=...` - Filter & search
  - `GET /api/admin/orders?page=...` - Pagination

**[FE] Order Detail Page**
- Endpoints needed:
  - `GET /api/admin/orders/:id` - Get order details
  - `GET /api/admin/orders/:id/items` - Get order items
  - `GET /api/admin/orders/:id/timeline` - Get order timeline

**[FE] Update Order Status Modal**
- Endpoints needed:
  - `PATCH /api/admin/orders/:id/status` - Update order status
  - `POST /api/admin/orders/:id/note` - Add order note

**[FE] Kitchen Display System (KDS) - Admin View**
- Endpoints needed:
  - `GET /api/admin/kitchen/queue` - Get kitchen queue
  - `WebSocket /ws/admin/kitchen` - Real-time kitchen updates

**[FE] Order Timer Dashboard**
- Endpoints needed:
  - `GET /api/admin/orders/active/timer` - Get active orders with timers
  - `WebSocket /ws/admin/order-timers` - Real-time timer updates

---

### 📋 ADMIN/MENU MANAGEMENT ENHANCEMENTS

#### Menu Item Screens (Missing Features)
**[FE] Menu Item Detail View Page**
- Endpoints needed:
  - `GET /api/admin/menu/items/:id/full` - Full item details
  - `GET /api/admin/menu/items/:id/stock` - Item stock status

**[FE] Upload/Manage Item Photos Modal**
- Endpoints needed:
  - `POST /api/admin/menu/items/:id/photos` - Upload photo
  - `DELETE /api/admin/menu/items/:id/photos/:photoId` - Delete photo
  - `PUT /api/admin/menu/items/:id/photos/:photoId/order` - Reorder photos

---

## ✅ OPTIMIZED BACKEND ENDPOINT DESIGN (API CONSOLIDATION)

### 📊 CONSOLIDATION ANALYSIS

**Original Count: ~83 endpoints**  
**Optimized Count: ~45-50 endpoints** (40% reduction)  
**Key Strategy:** Generic CRUD patterns + role-based access control + flexible query parameters

---

## 🔗 CONSOLIDATED COMMON APIs (Used by Multiple Roles)

### 1️⃣ ORDER MANAGEMENT - GENERIC (Used by Customer, Waiter, Kitchen, Admin)

**POST /api/orders** - Create/Submit order
- Used by: Customer (checkout), Guest (QR order)
- Body: `{ items: [...], tableId?, customerId? }`

**GET /api/orders/:id** - Get order details (role-based response)
- Used by: All roles (Kitchen, Waiter, Admin, Customer)
- Response filters by role: Kitchen sees items only, Customer sees full details + timeline

**PATCH /api/orders/:id/status** - Update order status (role-based workflow)
- Used by: Kitchen (Preparing→Ready→Done), Waiter (Served), Admin (any status)
- Body: `{ status: "preparing|ready|done|served|cancelled", updatedBy: "role", reason? }`

**GET /api/orders?filters** - List orders with dynamic filtering
- Used by: Waiter (pending), Kitchen (queue), Admin (all), Customer (history)
- Filters: `?status=...&role=...&dateRange=...&tableId=...&search=...&page=...`

**POST /api/orders/:id/notes** - Add order notes (shared by Waiter + Admin)
- Used by: Waiter, Admin
- Body: `{ note: "...", createdBy: "role" }`

**POST /api/orders/:id/items/:itemId/status** - Update item status (Kitchen + Waiter)
- Used by: Kitchen (Preparing→Ready), Waiter (Accept/Reject)
- Body: `{ status: "preparing|ready|rejected", reason?: "" }`

### 2️⃣ BILLS & PAYMENTS - GENERIC (Used by Customer, Waiter, Admin)

**POST /api/bills** - Create bill from order
- Used by: Waiter, Customer (request)
- Body: `{ orderId: "", type: "request|generated", requestedBy: "role" }`

**GET /api/bills/:id** - Get bill details (with format option)
- Used by: Customer, Waiter, Admin
- Query: `?format=json|pdf&include=discount|tax|total`

**PATCH /api/bills/:id** - Update bill (add discount, mark paid)
- Used by: Waiter (discount, payment), Admin (adjust)
- Body: `{ discountCode?: "", discountAmount?: 0, status?: "pending|paid|cancelled", paymentMethod?: "cash|card|ewallet" }`

**POST /api/payments** - Process payment (Stripe or direct)
- Used by: Customer (Stripe), Waiter (Cash/Card/E-wallet), Admin
- Body: `{ billId: "", amount: 0, method: "stripe|cash|card|ewallet", stripeToken?: "" }`

**GET /api/payments/:id/status** - Check payment status
- Used by: Customer (tracking), Admin (verify)

### 3️⃣ STAFF PROFILE - GENERIC (All staff roles)

**GET /api/staff/profile** - Get logged-in staff profile
- Used by: All staff (Admin, Waiter, Kitchen)
- Response: Role-specific profile data

**PUT /api/staff/profile** - Update own profile
- Used by: All staff
- Body: `{ name, email, phone, avatar? }`

**PATCH /api/staff/password** - Change password
- Used by: All staff
- Body: `{ oldPassword, newPassword }`

### 4️⃣ STAFF MANAGEMENT - GENERIC CRUD (Admin only)

**GET /api/admin/staff?role=admin|waiter|kitchen&page=...&search=...**
- Single endpoint, returns filtered staff by role
- Replaces: GET /api/admin/staff/admins, GET /api/admin/staff/waiters, GET /api/admin/staff/kitchen

**POST /api/admin/staff** - Create staff account (any role)
- Body: `{ name, email, password, role: "admin|waiter|kitchen", assignedTables?: [] }`

**GET /api/admin/staff/:id** - Get staff details
- Returns: Role-specific data

**PUT /api/admin/staff/:id** - Update staff account
- Body: `{ name, email, role?, assignedTables?, status?: "active|inactive" }`

**DELETE /api/admin/staff/:id** - Delete staff account

**POST /api/admin/staff/:id/send-invite** - Send invite (generic, works for all roles)
- Body: `{ email, role: "admin|waiter|kitchen" }`

**PATCH /api/admin/staff/:id/assign-tables** - Assign tables (Waiter only)
- Body: `{ tableIds: [...] }`

### 5️⃣ REPORTS - GENERIC (Parameterized instead of separate endpoints)

**GET /api/admin/reports?type=revenue|top-items|peak-hours|sales-by-category&format=data|chart&from=...&to=...&exportAs=json|pdf|csv**
- Single endpoint replaces 8 separate endpoints
- Examples:
  - `?type=revenue&format=data&from=2026-01-01&to=2026-01-31`
  - `?type=peak-hours&format=chart`
  - `?type=top-items&exportAs=pdf`

### 6️⃣ DASHBOARD - GENERIC (Parameterized)

**GET /api/dashboard?role=admin|waiter|kitchen&section=stats|orders|revenue|queue&timeRange=today|week|month**
- Admin gets: `{ stats: {...}, orders: {...}, revenue: {...} }`
- Kitchen gets: `{ queue: [...], stats: {...}, activeOrders: 5 }`
- Waiter gets: `{ pendingOrders: [...], assignedTables: [...], stats: {...} }`

---

## 📋 CUSTOMER PROFILE & ACCOUNT SCREENS (Consolidated)

### [FE] Profile Page
- [BE] [Customer] GET /api/customer/profile - Fetch profile (name, email, phone, avatar)
- [BE] [Customer] PUT /api/customer/profile - Update profile (reuses staff profile endpoint)
- [BE] [Customer] PATCH /api/customer/password - Change password (generic staff endpoint)

### [FE] Order History Page
- [BE] [Customer] GET /api/orders?role=customer&dateRange=all&page=... (reuses generic order list)

### [FE] My Reviews Page
- [BE] [Customer] GET /api/customer/reviews - Get reviews by customer
- [BE] [Customer] POST /api/customer/reviews - Submit review (POST /api/orders/:id/review)

---

## 📱 GUEST/PUBLIC ORDER FLOW SCREENS (Consolidated)

### [FE] Order Confirmation + Tracking Page
- [BE] POST /api/orders - Submit order (generic)
- [BE] GET /api/orders/:id - Get order with status tracking (generic)
- [FE] Polling: GET /api/orders/:id?poll=true - Poll for status updates (every 2-5 seconds)

### [FE] Bill Request + Payment Pages
- [BE] POST /api/bills - Request bill (generic)
- [BE] GET /api/bills/:id - Get bill details (generic)
- [BE] POST /api/payments - Process payment (generic, Stripe or cash)
- [BE] GET /api/payments/:id/status - Check payment status (generic)

### [FE] Social Login
- [BE] POST /api/auth/social-login - Generic social login (handles Google, Facebook, Apple)
- Body: `{ provider: "google|facebook|apple", token: "..." }`

---

## 🧑‍💼 WAITER DASHBOARD SCREENS (Consolidated)

### [FE] Waiter Login Page
- [BE] POST /api/auth/login - Generic staff login (Admin, Waiter, Kitchen)
- Body: `{ email, password, role?: "waiter|kitchen|admin" }`

### [FE] Waiter Dashboard Home
- [BE] GET /api/dashboard?role=waiter&section=stats - Get waiter dashboard (generic dashboard)

### [FE] Pending Orders List Page
- [BE] GET /api/orders?role=waiter&status=pending&page=... - Get pending orders with filtering *(Already in SR-67 - Order Management)*
- [FE] Polling: GET /api/orders?role=waiter&status=pending - Poll every 3-5 seconds for new orders

### [FE] Order Detail + Status Pages
- [BE] GET /api/orders/:id - Get order details (generic)
- [BE] PATCH /api/orders/:id/status - Update order status (generic, Waiter marks as "served")

### [FE] Assigned Tables Page
- [BE] GET /api/tables?assignedTo=waiter_id - Tables endpoint (already exists)

### [FE] Create Bill + Payment Pages
- [BE] POST /api/bills - Create bill (generic)
- [BE] PATCH /api/bills/:id - Add discount / mark paid (generic)
- [BE] POST /api/payments - Process payment (generic)

---

## 👨‍🍳 KITCHEN DASHBOARD SCREENS (Consolidated)

### [FE] Kitchen Login + Dashboard
- [BE] POST /api/auth/login - Generic staff login
- [BE] GET /api/dashboard?role=kitchen&section=queue - Kitchen queue dashboard (generic)

### [FE] Order Queue Pages
- [BE] GET /api/orders?role=kitchen&status=ready-to-prepare&page=... - Get queue with filtering *(Already in SR-67 - Order Management)*
- [FE] Polling: GET /api/orders?role=kitchen&status=ready-to-prepare - Poll every 2-3 seconds for queue updates

### [FE] Order Detail + Update Status
- [BE] GET /api/orders/:id - Get order details (kitchen-specific response)
- [BE] PATCH /api/orders/:id/status - Update to Preparing/Ready/Done (generic)
- [BE] PATCH /api/orders/:id/items/:itemId/status - Update item status (generic)

### [FE] Completed Orders Archive
- [BE] GET /api/orders?role=kitchen&status=completed&dateRange=... - Get completed orders with filtering *(Already in SR-67 - Order Management)*

---

## 💼 ADMIN DASHBOARD - ALL SECTIONS (Consolidated)

### [FE] Orders Management
- [BE] GET /api/orders?role=admin&status=...&date=...&search=...&page=... - Get all orders with filtering *(Already in SR-67 - Order Management)*
- [BE] GET /api/orders/:id - Get order details *(Already in SR-67 - Order Management)*
- [BE] PATCH /api/orders/:id/status - Update order status *(Already in SR-67 - Order Management)*
- [BE] PATCH /api/orders/:id - Add notes *(Already in SR-67 - Order Management)*

### [FE] Kitchen Display (Admin View)
- [BE] GET /api/dashboard?role=admin&section=queue - Kitchen queue view (generic dashboard)
- [FE] Polling: GET /api/dashboard?role=admin&section=queue - Poll every 2-3 seconds for real-time queue updates *(Already in SR-120 - Kitchen Display System)*

### [FE] Staff Management (All types)
- [BE] GET /api/admin/staff?role=admin|waiter|kitchen&page=...&search=... - List staff by role *(see Consolidated Common APIs - Staff Management)*
- [BE] POST /api/admin/staff - Create staff account *(see Consolidated Common APIs - Staff Management)*
- [BE] GET /api/admin/staff/:id - Get staff details *(see Consolidated Common APIs - Staff Management)*
- [BE] PUT /api/admin/staff/:id - Update staff account *(see Consolidated Common APIs - Staff Management)*
- [BE] DELETE /api/admin/staff/:id - Delete staff account *(see Consolidated Common APIs - Staff Management)*

### [FE] Reports & Analytics
- [BE] GET /api/admin/reports?type=revenue|top-items|peak-hours|sales-by-category&format=data|chart - Get reports *(see Consolidated Common APIs - Reports)*
- [BE] GET /api/admin/dashboard?role=admin&section=stats|orders|revenue - Get admin dashboard *(see Consolidated Common APIs - Dashboard)*

### [FE] Profile Settings
- [BE] GET /api/staff/profile - Get admin profile *(see Consolidated Common APIs - Staff Profile)*
- [BE] PUT /api/staff/profile - Update profile *(see Consolidated Common APIs - Staff Profile)*

### [FE] Menu Management
- [BE] POST /api/admin/menu/items/:id/photos - Upload photos (already exists)
- [BE] DELETE /api/admin/menu/items/:id/photos/:photoId - Delete photos (already exists)

---

## 🌐 REAL-TIME UPDATES - HTTP POLLING STRATEGY

**Note:** The web app uses HTTP polling instead of WebSockets for real-time updates.

### Polling Strategy by Feature:
| Feature | Endpoint | Poll Interval | Use Case |
|---|---|---|---|
| Order Tracking | `GET /api/orders/:id` | 2-5 seconds | Customer/Admin tracking order status |
| Kitchen Queue | `GET /api/orders?role=kitchen&status=ready-to-prepare` | 2-3 seconds | Kitchen staff viewing pending orders |
| Waiter Pending Orders | `GET /api/orders?role=waiter&status=pending` | 3-5 seconds | Waiter viewing incoming orders |
| Table Status | `GET /api/tables?status=occupied\|pending` | 5-10 seconds | Waiter viewing assigned table status |
| Bill Status | `GET /api/bills/:id` | 3-5 seconds | Customer/Waiter tracking bill payment |
| Payment Status | `GET /api/payments/:id/status` | 2-5 seconds | Customer tracking payment confirmation |

**Benefits of HTTP Polling:**
- ✅ No WebSocket server infrastructure needed
- ✅ Stateless backend (easier to scale horizontally)
- ✅ Works across all network environments
- ✅ Compatible with CDN caching for non-real-time data
- ✅ Built-in error handling via standard HTTP status codes

**Frontend Implementation:**
- Use React Query with `refetchInterval` for automatic polling
- Use `setInterval` for manual polling with exponential backoff on errors
- Implement request deduplication to prevent duplicate API calls
- Show loading states and stale data indicators to users

---

### 📊 FINAL ENDPOINT SUMMARY (CONSOLIDATED)

| Category | Original | Consolidated | Savings |
|----------|----------|---------------|---------|
| Orders | 8 | 5 | 3 endpoints |
| Bills & Payments | 10 | 4 | 6 endpoints |
| Staff Profiles | 9 | 3 | 6 endpoints |
| Staff Management | 9 | 7 | 2 endpoints |
| Reports | 8 | 1 | 7 endpoints |
| Dashboard | 5 | 1 | 4 endpoints |
| Authentication | 3 | 1 | 2 endpoints |
| Menu/Photos | 5 | 3 | 2 endpoints |
| Reviews | 2 | 2 | 0 endpoints |
| **TOTAL** | **~83** | **~45-50** | **~33-38 endpoints saved** |

**Real-time Strategy:** HTTP Polling (no WebSockets needed)

---

## 🎯 IMPLEMENTATION PRIORITY (Consolidated)

### 🔴 CRITICAL (Core Platform) - Week 1-2
1. **POST /api/orders** - Customer order submission
2. **GET /api/orders?filters** - Orders list/tracking
3. **PATCH /api/orders/:id/status** - Status updates (Kitchen/Waiter/Admin)
4. **POST /api/payments** - Payment processing
5. **POST /api/auth/login** - Staff login (consolidates 3 separate logins)

### 🟠 HIGH PRIORITY (Functionality) - Week 2-3
6. **GET /api/admin/staff?role=...** - Staff management (consolidates 3 separate endpoints)
7. **POST /api/bills** - Bill creation
8. **GET /api/dashboard?role=...&section=...** - Consolidated dashboard (replaces 5+ endpoints)
9. **GET /api/admin/reports?type=...** - Consolidated reports (replaces 8 endpoints)
10. **HTTP Polling Setup** - Implement polling logic for real-time order/table updates

### 🟡 MEDIUM PRIORITY (UX) - Week 3-4
11. **POST /api/auth/social-login** - OAuth login
12. **GET /api/customer/reviews** - Review management
13. **PATCH /api/orders/:id** - Add notes to orders

### 🟢 LOW PRIORITY (Polish) - Week 4+
14. Photos management (already exists)
15. Profile management (generic endpoints)

---

### ✅ BACKEND ENDPOINT TASKS (ORGANIZED BY ENDPOINT - FOR JIRA)

> **📌 FORMAT:** Each endpoint = 1 JIRA task. EPICs listed show which features use this endpoint.

---

## 🔗 GROUP 1: ORDER MANAGEMENT ENDPOINTS

### [TASK-001] POST /api/orders
**Description:** Create/Submit order from cart  
**Method:** POST  
**Route:** `/api/orders`  
**Request Body:**
```json
{
  "table_id": 5,
  "customer_id": 123,
  "items": [
    {
      "menu_item_id": 31,
      "quantity": 2,
      "special_instructions": "No onions please",
      "modifiers": [
        {
          "modifier_group_id": 1,
          "modifier_option_id": 3
        }
      ]
    }
  ],
  "notes": "Birthday celebration"
}
```

**Response (Success):**
```json
{
  "code": 0,
  "message": "Order created successfully",
  "data": {
    "id": 1001,
    "order_number": "ORD-2026-001001",
    "table_id": 5,
    "table_name": "Table 5",
    "customer_id": 123,
    "customer_name": "John Doe",
    "status": "pending",
    "total_amount": 65.98,
    "tax_amount": 6.60,
    "discount_amount": 0,
    "final_amount": 72.58,
    "notes": "Birthday celebration",
    "created_at": "2026-01-11T10:30:00Z",
    "items": [
      {
        "id": 5001,
        "menu_item_id": 31,
        "menu_item_name": "Grilled Salmon",
        "quantity": 2,
        "unit_price": 24.99,
        "subtotal": 49.98,
        "special_instructions": "No onions please",
        "status": "pending",
        "modifiers": [
          {
            "modifier_group_id": 1,
            "modifier_group_name": "Steak Temperature",
            "modifier_option_id": 3,
            "modifier_option_name": "Medium",
            "price": 0
          }
        ]
      }
    ]
  }
}
```

**Used by EPICs:**
- ✅ SR-67 (Customer shopping cart + order payment)
- ✅ SR-66 (Customer flow - Menu flow)

**Priority:** 🔴 CRITICAL  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Order Management" section

---

### [TASK-002] GET /api/orders (with filters)
**Description:** Get orders list with dynamic filtering by role, status, dateRange, tableId, search, pagination  
**Method:** GET  
**Route:** `/api/orders?role=...&status=...&dateRange=...&tableId=...&search=...&page=...&page_size=...&sort=...`  
**Query Params:**
- `role`: customer|waiter|kitchen|admin
- `status`: pending|preparing|ready|done|served|cancelled
- `date_from`: ISO date (2026-01-01)
- `date_to`: ISO date (2026-01-31)
- `table_id`: Filter by specific table
- `search`: Search by order number or customer name
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 10)
- `sort`: created_at_desc|created_at_asc|total_amount_desc|total_amount_asc

**Response (Success):**
```json
{
  "code": 0,
  "message": "Orders retrieved successfully",
  "data": {
    "total": 47,
    "page": 1,
    "page_size": 10,
    "items": [
      {
        "id": 1001,
        "order_number": "ORD-2026-001001",
        "table_id": 5,
        "table_name": "Table 5",
        "customer_id": 123,
        "customer_name": "John Doe",
        "status": "preparing",
        "total_amount": 72.58,
        "items_count": 3,
        "created_at": "2026-01-11T10:30:00Z",
        "updated_at": "2026-01-11T10:35:00Z",
        "estimated_ready_time": "2026-01-11T11:00:00Z",
        "waiter_id": 5,
        "waiter_name": "Alice Smith"
      },
      {
        "id": 1000,
        "order_number": "ORD-2026-001000",
        "table_id": 3,
        "table_name": "Table 3",
        "customer_id": 122,
        "customer_name": "Jane Wilson",
        "status": "ready",
        "total_amount": 45.50,
        "items_count": 2,
        "created_at": "2026-01-11T09:15:00Z",
        "updated_at": "2026-01-11T09:45:00Z",
        "estimated_ready_time": "2026-01-11T09:50:00Z",
        "waiter_id": 5,
        "waiter_name": "Alice Smith"
      }
    ],
    "extra": null
  }
}
```

**Used by EPICs:**
- ✅ SR-66 (Customer flow - Menu flow)
- ✅ SR-67 (Customer shopping cart + order payment)
- ✅ SR-68 (User profile - Order History)
- ✅ SR-69 (Admin - Customer order - Orders Management)
- ✅ SR-69 (Waiter Orders Management)
- ✅ SR-120 (Kitchen Staff Dashboard - Order Queue)

**Priority:** 🔴 CRITICAL  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Order Management" section

---

### [TASK-003] GET /api/orders/:id
**Description:** Get order details (role-based response)  
**Method:** GET  
**Route:** `/api/orders/:id`  
**Response varies by role:**
- Kitchen: items only
- Customer: full details + timeline
- Waiter/Admin: full details + actions

**Response (Success - Customer/Waiter/Admin):**
```json
{
  "code": 0,
  "message": "Order retrieved successfully",
  "data": {
    "id": 1001,
    "order_number": "ORD-2026-001001",
    "table_id": 5,
    "table_name": "Table 5",
    "customer_id": 123,
    "customer_name": "John Doe",
    "customer_phone": "+1234567890",
    "status": "preparing",
    "total_amount": 65.98,
    "tax_amount": 6.60,
    "discount_amount": 5.00,
    "final_amount": 67.58,
    "notes": "Birthday celebration",
    "special_instructions": "Please prepare without peanuts",
    "created_at": "2026-01-11T10:30:00Z",
    "updated_at": "2026-01-11T10:35:00Z",
    "estimated_ready_time": "2026-01-11T11:00:00Z",
    "waiter_id": 5,
    "waiter_name": "Alice Smith",
    "items": [
      {
        "id": 5001,
        "menu_item_id": 31,
        "menu_item_name": "Grilled Salmon",
        "menu_item_image": "https://images.unsplash.com/photo-1485921325833-c519f76c4927",
        "quantity": 2,
        "unit_price": 24.99,
        "subtotal": 49.98,
        "special_instructions": "No onions please",
        "status": "preparing",
        "modifiers": [
          {
            "modifier_group_id": 1,
            "modifier_group_name": "Steak Temperature",
            "modifier_option_id": 3,
            "modifier_option_name": "Medium",
            "price": 0
          }
        ]
      },
      {
        "id": 5002,
        "menu_item_id": 7,
        "menu_item_name": "Lamb Chops",
        "menu_item_image": "https://images.unsplash.com/photo-1544025162-d76694265947",
        "quantity": 1,
        "unit_price": 35.00,
        "subtotal": 38.00,
        "special_instructions": "",
        "status": "pending",
        "modifiers": [
          {
            "modifier_group_id": 3,
            "modifier_group_name": "Extra Toppings",
            "modifier_option_id": 7,
            "modifier_option_name": "Mushrooms",
            "price": 3.00
          }
        ]
      }
    ],
    "timeline": [
      {
        "id": 1,
        "status": "pending",
        "timestamp": "2026-01-11T10:30:00Z",
        "updated_by": "customer",
        "updated_by_name": "John Doe",
        "note": "Order placed"
      },
      {
        "id": 2,
        "status": "confirmed",
        "timestamp": "2026-01-11T10:32:00Z",
        "updated_by": "waiter",
        "updated_by_name": "Alice Smith",
        "note": "Order confirmed by waiter"
      },
      {
        "id": 3,
        "status": "preparing",
        "timestamp": "2026-01-11T10:35:00Z",
        "updated_by": "kitchen",
        "updated_by_name": "Chef Mike",
        "note": "Kitchen started preparing"
      }
    ],
    "bill": {
      "id": 2001,
      "status": "pending",
      "payment_method": null,
      "paid_at": null
    }
  }
}
```

**Response (Success - Kitchen Role):**
```json
{
  "code": 0,
  "message": "Order retrieved successfully",
  "data": {
    "id": 1001,
    "order_number": "ORD-2026-001001",
    "table_name": "Table 5",
    "status": "preparing",
    "created_at": "2026-01-11T10:30:00Z",
    "estimated_ready_time": "2026-01-11T11:00:00Z",
    "notes": "Birthday celebration",
    "items": [
      {
        "id": 5001,
        "menu_item_name": "Grilled Salmon",
        "quantity": 2,
        "special_instructions": "No onions please",
        "status": "preparing",
        "modifiers": [
          {
            "modifier_group_name": "Steak Temperature",
            "modifier_option_name": "Medium"
          }
        ]
      },
      {
        "id": 5002,
        "menu_item_name": "Lamb Chops",
        "quantity": 1,
        "special_instructions": "",
        "status": "pending",
        "modifiers": [
          {
            "modifier_group_name": "Extra Toppings",
            "modifier_option_name": "Mushrooms"
          }
        ]
      }
    ]
  }
}
```

**Used by EPICs:**
- ✅ SR-67 (Customer shopping cart + order payment - Order Confirmation)
- ✅ SR-68 (User profile - Order Detail)
- ✅ SR-69 (Admin - Customer order - Order Detail)
- ✅ SR-69 (Waiter Orders Management - Order Detail)
- ✅ SR-120 (Kitchen Staff Dashboard - Order Queue Management)

**Priority:** 🔴 CRITICAL  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Order Management" section

---

### [TASK-004] PATCH /api/orders/:id/status
**Description:** Update order status (role-based workflow)  
**Method:** PATCH  
**Route:** `/api/orders/:id/status`  
**Request Body:** 
```json
{
  "status": "preparing",
  "updated_by": "kitchen",
  "reason": "Started cooking"
}
```
**Workflow:**
- Kitchen: Preparing → Ready → Done
- Waiter: Served
- Admin: Any status

**Response (Success):**
```json
{
  "code": 0,
  "message": "Order status updated successfully",
  "data": {
    "id": 1001,
    "order_number": "ORD-2026-001001",
    "status": "preparing",
    "previous_status": "pending",
    "updated_at": "2026-01-11T10:35:00Z",
    "updated_by": "kitchen",
    "updated_by_name": "Chef Mike",
    "estimated_ready_time": "2026-01-11T11:00:00Z"
  }
}
```

**Response (Error - Invalid Transition):**
```json
{
  "code": 400,
  "message": "Invalid status transition. Cannot change from 'done' to 'preparing'",
  "data": null
}
```

**Used by EPICs:**
- ✅ SR-67 (Customer shopping cart + order payment)
- ✅ SR-69 (Admin - Customer order - Orders Management)
- ✅ SR-69 (Waiter Orders Management)
- ✅ SR-120 (Kitchen Staff Dashboard - Order Queue Management)

**Priority:** 🔴 CRITICAL  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Order Management" section

---

### [TASK-005] PATCH /api/orders/:id/items/:itemId/status
**Description:** Update individual item status (Kitchen + Waiter)  
**Method:** PATCH  
**Route:** `/api/orders/:id/items/:itemId/status`  
**Request Body:**
```json
{
  "status": "preparing",
  "reason": "Starting to cook"
}
```

**Response (Success):**
```json
{
  "code": 0,
  "message": "Order item status updated successfully",
  "data": {
    "item_id": 5001,
    "order_id": 1001,
    "menu_item_name": "Grilled Salmon",
    "status": "preparing",
    "previous_status": "pending",
    "updated_at": "2026-01-11T10:36:00Z",
    "updated_by": "kitchen",
    "updated_by_name": "Chef Mike"
  }
}
```

**Used by EPICs:**
- ✅ SR-69 (Waiter Orders Management - Accept/Reject items)
- ✅ SR-120 (Kitchen Staff Dashboard - Item preparation status)

**Priority:** 🟠 HIGH  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Order Management" section

---

### [TASK-006] PATCH /api/orders/:id
**Description:** Add notes/metadata to order  
**Method:** PATCH  
**Route:** `/api/orders/:id`  
**Request Body:**
```json
{
  "note": "Customer requested extra napkins",
  "metadata": {
    "priority": "high",
    "allergy_info": "No nuts"
  }
}
```

**Response (Success):**
```json
{
  "code": 0,
  "message": "Order updated successfully",
  "data": {
    "id": 1001,
    "order_number": "ORD-2026-001001",
    "notes": "Birthday celebration. Customer requested extra napkins",
    "metadata": {
      "priority": "high",
      "allergy_info": "No nuts"
    },
    "updated_at": "2026-01-11T10:40:00Z"
  }
}
```

**Used by EPICs:**
- ✅ SR-69 (Admin - Customer order - Orders Management)

**Priority:** 🟡 MEDIUM  
**Status:** ❌ Not implemented  

---

### [TASK-007] POST /api/orders/:id/cancel
**Description:** Cancel order  
**Method:** POST  
**Route:** `/api/orders/:id/cancel`  
**Request Body:**
```json
{
  "reason": "Customer changed mind"
}
```

**Response (Success):**
```json
{
  "code": 0,
  "message": "Order cancelled successfully",
  "data": {
    "id": 1001,
    "order_number": "ORD-2026-001001",
    "status": "cancelled",
    "cancelled_at": "2026-01-11T10:42:00Z",
    "cancelled_by": "customer",
    "cancel_reason": "Customer changed mind",
    "refund_status": "pending",
    "refund_amount": 67.58
  }
}
```

**Response (Error - Cannot Cancel):**
```json
{
  "code": 400,
  "message": "Cannot cancel order. Order is already being prepared",
  "data": null
}
```

**Used by EPICs:**
- ✅ SR-67 (Customer shopping cart + order payment - Utilities)

**Priority:** 🟡 MEDIUM  
**Status:** ❌ Not implemented  

---

### [TASK-008] POST /api/orders/:id/alert
**Description:** Send alert to waiter (item ready)  
**Method:** POST  
**Route:** `/api/orders/:id/alert`  
**Request Body:**
```json
{
  "message": "Order for Table 5 is ready for pickup",
  "alert_type": "order_ready",
  "priority": "high"
}
```

**Response (Success):**
```json
{
  "code": 0,
  "message": "Alert sent successfully",
  "data": {
    "alert_id": 3001,
    "order_id": 1001,
    "order_number": "ORD-2026-001001",
    "message": "Order for Table 5 is ready for pickup",
    "sent_to": "waiter",
    "waiter_id": 5,
    "waiter_name": "Alice Smith",
    "sent_at": "2026-01-11T10:55:00Z",
    "status": "sent"
  }
}
```

**Used by EPICs:**
- ✅ SR-120 (Kitchen Staff Dashboard - KDS)

**Priority:** 🟡 MEDIUM  
**Status:** ❌ Not implemented  

---

### [TASK-009] POST /api/orders/:id/review
**Description:** Submit review for completed order  
**Method:** POST  
**Route:** `/api/orders/:id/review`  
**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent food and service! The salmon was perfectly cooked.",
  "photos": [
    "https://example.com/reviews/photo1.jpg",
    "https://example.com/reviews/photo2.jpg"
  ]
}
```

**Response (Success):**
```json
{
  "code": 0,
  "message": "Review submitted successfully",
  "data": {
    "review_id": 4001,
    "order_id": 1001,
    "order_number": "ORD-2026-001001",
    "customer_id": 123,
    "customer_name": "John Doe",
    "rating": 5,
    "comment": "Excellent food and service! The salmon was perfectly cooked.",
    "photos": [
      {
        "id": "p1",
        "url": "https://example.com/reviews/photo1.jpg"
      },
      {
        "id": "p2",
        "url": "https://example.com/reviews/photo2.jpg"
      }
    ],
    "created_at": "2026-01-11T13:30:00Z",
    "status": "published"
  }
}
```

**Used by EPICs:**
- ✅ SR-68 (User profile - Customer Reviews)

**Priority:** 🟢 LOW  
**Status:** ❌ Not implemented  

---

## 💰 GROUP 2: BILLS & PAYMENTS ENDPOINTS

### [TASK-010] POST /api/bills
**Description:** Create bill from order  
**Method:** POST  
**Route:** `/api/bills`  
**Request Body:**
```json
{
  "order_id": 1001,
  "type": "generated",
  "requested_by": "waiter"
}
```

**Response (Success):**
```json
{
  "code": 0,
  "message": "Bill created successfully",
  "data": {
    "id": 2001,
    "bill_number": "BILL-2026-002001",
    "order_id": 1001,
    "order_number": "ORD-2026-001001",
    "table_id": 5,
    "table_name": "Table 5",
    "customer_id": 123,
    "customer_name": "John Doe",
    "subtotal": 65.98,
    "tax_amount": 6.60,
    "discount_amount": 5.00,
    "service_charge": 0,
    "total_amount": 67.58,
    "status": "pending",
    "type": "generated",
    "requested_by": "waiter",
    "created_at": "2026-01-11T11:15:00Z",
    "items": [
      {
        "menu_item_name": "Grilled Salmon",
        "quantity": 2,
        "unit_price": 24.99,
        "subtotal": 49.98
      },
      {
        "menu_item_name": "Lamb Chops",
        "quantity": 1,
        "unit_price": 35.00,
        "subtotal": 38.00
      }
    ]
  }
}
```

**Used by EPICs:**
- ✅ SR-67 (Customer shopping cart + order payment - Bills & Payments)
- ✅ SR-69 (Waiter Bill & Payment Management)

**Priority:** 🔴 CRITICAL  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Bills & Payments" section

---

### [TASK-011] GET /api/bills/:id
**Description:** Get bill details (with format option)  
**Method:** GET  
**Route:** `/api/bills/:id?format=json&include=discount,tax,total`  
**Query Params:**
- `format`: json|pdf (default: json)
- `include`: discount,tax,total (optional)

**Response (Success - JSON format):**
```json
{
  "code": 0,
  "message": "Bill retrieved successfully",
  "data": {
    "id": 2001,
    "bill_number": "BILL-2026-002001",
    "order_id": 1001,
    "order_number": "ORD-2026-001001",
    "table_id": 5,
    "table_name": "Table 5",
    "customer_id": 123,
    "customer_name": "John Doe",
    "customer_phone": "+1234567890",
    "subtotal": 65.98,
    "tax_amount": 6.60,
    "tax_rate": 10,
    "discount_amount": 5.00,
    "discount_code": "SAVE5",
    "service_charge": 0,
    "total_amount": 67.58,
    "status": "pending",
    "payment_method": null,
    "created_at": "2026-01-11T11:15:00Z",
    "paid_at": null,
    "items": [
      {
        "id": 5001,
        "menu_item_name": "Grilled Salmon",
        "quantity": 2,
        "unit_price": 24.99,
        "modifiers_total": 0,
        "subtotal": 49.98
      },
      {
        "id": 5002,
        "menu_item_name": "Lamb Chops",
        "quantity": 1,
        "unit_price": 35.00,
        "modifiers_total": 3.00,
        "subtotal": 38.00
      }
    ],
    "breakdown": {
      "items_total": 65.98,
      "modifiers_total": 3.00,
      "subtotal_before_discount": 68.98,
      "discount": -5.00,
      "subtotal_after_discount": 63.98,
      "tax": 6.60,
      "service_charge": 0,
      "grand_total": 67.58
    }
  }
}
```

**Response (Success - PDF format):**
```json
{
  "code": 0,
  "message": "Bill PDF generated successfully",
  "data": {
    "pdf_url": "https://storage.example.com/bills/BILL-2026-002001.pdf",
    "expires_at": "2026-01-11T15:15:00Z"
  }
}
```

**Used by EPICs:**
- ✅ SR-67 (Customer shopping cart + order payment - Bills & Payments)
- ✅ SR-69 (Waiter Bill & Payment Management)

**Priority:** 🔴 CRITICAL  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Bills & Payments" section

---

### [TASK-012] PATCH /api/bills/:id
**Description:** Update bill (add discount, mark paid)  
**Method:** PATCH  
**Route:** `/api/bills/:id`  
**Request Body (Add Discount):**
```json
{
  "discount_code": "SAVE10",
  "discount_amount": 10.00
}
```

**Request Body (Mark as Paid):**
```json
{
  "status": "paid",
  "payment_method": "card"
}
```

**Response (Success - Discount Applied):**
```json
{
  "code": 0,
  "message": "Bill updated successfully",
  "data": {
    "id": 2001,
    "bill_number": "BILL-2026-002001",
    "discount_code": "SAVE10",
    "discount_amount": 10.00,
    "previous_total": 67.58,
    "new_total": 57.58,
    "subtotal": 65.98,
    "tax_amount": 6.60,
    "total_amount": 57.58,
    "status": "pending",
    "updated_at": "2026-01-11T11:20:00Z"
  }
}
```

**Response (Success - Marked as Paid):**
```json
{
  "code": 0,
  "message": "Bill marked as paid successfully",
  "data": {
    "id": 2001,
    "bill_number": "BILL-2026-002001",
    "status": "paid",
    "payment_method": "card",
    "total_amount": 57.58,
    "paid_at": "2026-01-11T11:25:00Z",
    "payment_id": 3001
  }
}
```

**Used by EPICs:**
- ✅ SR-67 (Customer shopping cart + order payment - Bills & Payments)
- ✅ SR-69 (Waiter Bill & Payment Management)

**Priority:** 🔴 CRITICAL  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Bills & Payments" section

---

### [TASK-013] POST /api/payments
**Description:** Process payment (Stripe or direct)  
**Method:** POST  
**Route:** `/api/payments`  
**Request Body (Stripe):**
```json
{
  "bill_id": 2001,
  "amount": 57.58,
  "method": "stripe",
  "stripe_token": "tok_visa_1234567890",
  "stripe_payment_method_id": "pm_1234567890"
}
```

**Request Body (Cash/Card/E-wallet):**
```json
{
  "bill_id": 2001,
  "amount": 57.58,
  "method": "cash",
  "received_amount": 60.00,
  "change_amount": 2.42
}
```

**Response (Success - Stripe):**
```json
{
  "code": 0,
  "message": "Payment processed successfully",
  "data": {
    "payment_id": 3001,
    "bill_id": 2001,
    "bill_number": "BILL-2026-002001",
    "amount": 57.58,
    "method": "stripe",
    "status": "succeeded",
    "stripe_payment_intent_id": "pi_1234567890",
    "stripe_charge_id": "ch_1234567890",
    "receipt_url": "https://stripe.com/receipts/1234567890",
    "created_at": "2026-01-11T11:25:00Z",
    "processed_at": "2026-01-11T11:25:05Z"
  }
}
```

**Response (Success - Cash):**
```json
{
  "code": 0,
  "message": "Payment processed successfully",
  "data": {
    "payment_id": 3002,
    "bill_id": 2001,
    "bill_number": "BILL-2026-002001",
    "amount": 57.58,
    "method": "cash",
    "status": "completed",
    "received_amount": 60.00,
    "change_amount": 2.42,
    "created_at": "2026-01-11T11:26:00Z",
    "processed_at": "2026-01-11T11:26:00Z"
  }
}
```

**Response (Error - Payment Failed):**
```json
{
  "code": 400,
  "message": "Payment failed. Card declined",
  "data": {
    "error_code": "card_declined",
    "decline_reason": "insufficient_funds"
  }
}
```

**Used by EPICs:**
- ✅ SR-67 (Customer shopping cart + order payment - Bills & Payments)
- ✅ SR-69 (Waiter Bill & Payment Management)

**Priority:** 🔴 CRITICAL  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Bills & Payments" section

---

### [TASK-014] GET /api/payments/:id/status
**Description:** Check payment status  
**Method:** GET  
**Route:** `/api/payments/:id/status`  

**Response (Success - Completed):**
```json
{
  "code": 0,
  "message": "Payment status retrieved successfully",
  "data": {
    "payment_id": 3001,
    "bill_id": 2001,
    "bill_number": "BILL-2026-002001",
    "status": "succeeded",
    "amount": 57.58,
    "method": "stripe",
    "created_at": "2026-01-11T11:25:00Z",
    "processed_at": "2026-01-11T11:25:05Z",
    "receipt_url": "https://stripe.com/receipts/1234567890"
  }
}
```

**Response (Success - Pending):**
```json
{
  "code": 0,
  "message": "Payment status retrieved successfully",
  "data": {
    "payment_id": 3003,
    "bill_id": 2002,
    "bill_number": "BILL-2026-002002",
    "status": "pending",
    "amount": 125.00,
    "method": "stripe",
    "created_at": "2026-01-11T11:30:00Z",
    "stripe_payment_intent_status": "processing"
  }
}
```

**Response (Success - Failed):**
```json
{
  "code": 0,
  "message": "Payment status retrieved successfully",
  "data": {
    "payment_id": 3004,
    "bill_id": 2003,
    "bill_number": "BILL-2026-002003",
    "status": "failed",
    "amount": 89.99,
    "method": "stripe",
    "created_at": "2026-01-11T11:35:00Z",
    "failed_at": "2026-01-11T11:35:03Z",
    "error_message": "Card declined - insufficient funds",
    "error_code": "card_declined"
  }
}
```

**Used by EPICs:**
- ✅ SR-67 (Customer shopping cart + order payment - Bills & Payments)
- ✅ SR-69 (Waiter Bill & Payment Management)

**Priority:** 🔴 CRITICAL  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Bills & Payments" section

---

### [TASK-015] POST /api/discounts/validate
**Description:** Validate discount code before payment  
**Method:** POST  
**Route:** `/api/discounts/validate`  
**Request Body:**
```json
{
  "code": "SAVE10",
  "order_id": 1001
}
```

**Response (Success - Valid):**
```json
{
  "code": 0,
  "message": "Discount code is valid",
  "data": {
    "discount_id": 101,
    "code": "SAVE10",
    "is_valid": true,
    "discount_type": "percentage",
    "discount_value": 10,
    "discount_amount": 6.80,
    "min_order_amount": 50.00,
    "max_discount_amount": 20.00,
    "valid_from": "2026-01-01T00:00:00Z",
    "valid_until": "2026-12-31T23:59:59Z",
    "usage_limit": 100,
    "usage_count": 45,
    "description": "Get 10% off on orders above $50"
  }
}
```

**Response (Error - Invalid Code):**
```json
{
  "code": 400,
  "message": "Discount code is invalid",
  "data": {
    "code": "INVALID10",
    "is_valid": false,
    "error_reason": "code_not_found"
  }
}
```

**Response (Error - Expired):**
```json
{
  "code": 400,
  "message": "Discount code has expired",
  "data": {
    "code": "SAVE10",
    "is_valid": false,
    "error_reason": "expired",
    "valid_until": "2025-12-31T23:59:59Z"
  }
}
```

**Response (Error - Min Order Not Met):**
```json
{
  "code": 400,
  "message": "Order amount does not meet minimum requirement",
  "data": {
    "code": "SAVE10",
    "is_valid": false,
    "error_reason": "min_order_not_met",
    "min_order_amount": 50.00,
    "current_order_amount": 35.00,
    "required_additional": 15.00
  }
}
```

**Used by EPICs:**
- ✅ SR-67 (Customer shopping cart + order payment - Bills & Payments)

**Priority:** 🟡 MEDIUM  
**Status:** ❌ Not implemented  

---

## 👥 GROUP 3: CUSTOMER PROFILE & ACCOUNT ENDPOINTS

### [TASK-016] GET /api/customer/profile
**Description:** Fetch customer profile information  
**Method:** GET  
**Route:** `/api/customer/profile`  

**Response (Success):**
```json
{
  "code": 0,
  "message": "Customer profile retrieved successfully",
  "data": {
    "id": 123,
    "email": "john.doe@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "avatar_url": "https://example.com/avatars/john-doe.jpg",
    "date_of_birth": "1990-05-15",
    "gender": "male",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "USA"
    },
    "preferences": {
      "dietary_restrictions": ["no_nuts", "no_shellfish"],
      "favorite_cuisine": ["Italian", "Japanese"],
      "notification_enabled": true,
      "email_notifications": true,
      "sms_notifications": false
    },
    "loyalty": {
      "points": 450,
      "tier": "silver",
      "next_tier": "gold",
      "points_to_next_tier": 50
    },
    "statistics": {
      "total_orders": 24,
      "total_spent": 1245.50,
      "favorite_items": [
        "Grilled Salmon",
        "Lamb Chops"
      ]
    },
    "created_at": "2025-06-10T08:30:00Z",
    "updated_at": "2026-01-11T10:15:00Z",
    "email_verified": true,
    "phone_verified": true
  }
}
```

**Used by EPICs:**
- ✅ SR-68 (User profile - Customer Profile Management)

**Priority:** 🟡 MEDIUM  
**Status:** ❌ Not implemented  

---

### [TASK-017] PUT /api/customer/profile
**Description:** Update customer profile (name, email, phone)  
**Method:** PUT  
**Route:** `/api/customer/profile`  
**Request Body:**
```json
{
  "name": "John Doe Jr.",
  "phone": "+1234567899",
  "date_of_birth": "1990-05-15",
  "gender": "male",
  "address": {
    "street": "456 Oak Ave",
    "city": "New York",
    "state": "NY",
    "postal_code": "10002",
    "country": "USA"
  },
  "preferences": {
    "dietary_restrictions": ["no_nuts"],
    "favorite_cuisine": ["Italian", "Japanese", "Thai"],
    "notification_enabled": true,
    "email_notifications": true,
    "sms_notifications": true
  }
}
```

**Response (Success):**
```json
{
  "code": 0,
  "message": "Profile updated successfully",
  "data": {
    "id": 123,
    "email": "john.doe@example.com",
    "name": "John Doe Jr.",
    "phone": "+1234567899",
    "avatar_url": "https://example.com/avatars/john-doe.jpg",
    "date_of_birth": "1990-05-15",
    "gender": "male",
    "address": {
      "street": "456 Oak Ave",
      "city": "New York",
      "state": "NY",
      "postal_code": "10002",
      "country": "USA"
    },
    "preferences": {
      "dietary_restrictions": ["no_nuts"],
      "favorite_cuisine": ["Italian", "Japanese", "Thai"],
      "notification_enabled": true,
      "email_notifications": true,
      "sms_notifications": true
    },
    "updated_at": "2026-01-11T12:00:00Z"
  }
}
```

**Response (Error - Phone Already Exists):**
```json
{
  "code": 400,
  "message": "Phone number already in use",
  "data": {
    "field": "phone",
    "error": "duplicate"
  }
}
```

**Used by EPICs:**
- ✅ SR-68 (User profile - Customer Profile Management)

**Priority:** 🟡 MEDIUM  
**Status:** ❌ Not implemented  

---

### [TASK-018] POST /api/customer/avatar
**Description:** Upload customer avatar image  
**Method:** POST  
**Route:** `/api/customer/avatar`  
**Request Body:** `multipart/form-data`
```
Content-Type: multipart/form-data

file: (binary image file)
```

**Response (Success):**
```json
{
  "code": 0,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar_url": "https://example.com/avatars/john-doe-updated.jpg",
    "thumbnail_url": "https://example.com/avatars/thumbnails/john-doe-updated.jpg",
    "file_size": 245680,
    "mime_type": "image/jpeg",
    "uploaded_at": "2026-01-11T12:05:00Z"
  }
}
```

**Response (Error - File Too Large):**
```json
{
  "code": 400,
  "message": "File size exceeds maximum allowed (5MB)",
  "data": {
    "max_size": 5242880,
    "uploaded_size": 6291456
  }
}
```

**Response (Error - Invalid File Type):**
```json
{
  "code": 400,
  "message": "Invalid file type. Only JPEG, PNG, and GIF are allowed",
  "data": {
    "allowed_types": ["image/jpeg", "image/png", "image/gif"],
    "uploaded_type": "image/bmp"
  }
}
```

**Used by EPICs:**
- ✅ SR-68 (User profile - Customer Profile Management)

**Priority:** 🟢 LOW  
**Status:** ❌ Not implemented  

---

### [TASK-019] PATCH /api/customer/password
**Description:** Change customer password  
**Method:** PATCH  
**Route:** `/api/customer/password`  
**Request Body:**
```json
{
  "old_password": "CurrentPassword123!",
  "new_password": "NewSecurePassword456!"
}
```

**Response (Success):**
```json
{
  "code": 0,
  "message": "Password changed successfully",
  "data": {
    "changed_at": "2026-01-11T12:10:00Z"
  }
}
```

**Response (Error - Incorrect Old Password):**
```json
{
  "code": 400,
  "message": "Current password is incorrect",
  "data": null
}
```

**Response (Error - Weak Password):**
```json
{
  "code": 400,
  "message": "New password does not meet security requirements",
  "data": {
    "requirements": [
      "At least 8 characters",
      "At least one uppercase letter",
      "At least one lowercase letter",
      "At least one number",
      "At least one special character"
    ],
    "failed_requirements": [
      "At least one special character"
    ]
  }
}
```

**Used by EPICs:**
- ✅ SR-68 (User profile - Customer Profile Management)

**Priority:** 🟡 MEDIUM  
**Status:** ❌ Not implemented  

---

### [TASK-020] GET /api/customer/reviews
**Description:** Get customer reviews list  
**Method:** GET  
**Route:** `/api/customer/reviews?page=1&page_size=10&sort=created_at_desc`  
**Query Params:**
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 10)
- `sort`: created_at_desc|created_at_asc|rating_desc|rating_asc

**Response (Success):**
```json
{
  "code": 0,
  "message": "Reviews retrieved successfully",
  "data": {
    "total": 8,
    "page": 1,
    "page_size": 10,
    "items": [
      {
        "id": 4001,
        "order_id": 1001,
        "order_number": "ORD-2026-001001",
        "rating": 5,
        "comment": "Excellent food and service! The salmon was perfectly cooked.",
        "photos": [
          {
            "id": "p1",
            "url": "https://example.com/reviews/photo1.jpg",
            "thumbnail_url": "https://example.com/reviews/thumbnails/photo1.jpg"
          },
          {
            "id": "p2",
            "url": "https://example.com/reviews/photo2.jpg",
            "thumbnail_url": "https://example.com/reviews/thumbnails/photo2.jpg"
          }
        ],
        "items_reviewed": [
          {
            "menu_item_id": 31,
            "menu_item_name": "Grilled Salmon",
            "menu_item_image": "https://images.unsplash.com/photo-1485921325833-c519f76c4927"
          }
        ],
        "restaurant_response": {
          "message": "Thank you for your kind words! We're glad you enjoyed your meal.",
          "responded_by": "Restaurant Manager",
          "responded_at": "2026-01-11T14:00:00Z"
        },
        "status": "published",
        "created_at": "2026-01-11T13:30:00Z",
        "updated_at": "2026-01-11T13:30:00Z"
      },
      {
        "id": 3998,
        "order_id": 995,
        "order_number": "ORD-2026-000995",
        "rating": 4,
        "comment": "Good food, but service was a bit slow.",
        "photos": [],
        "items_reviewed": [
          {
            "menu_item_id": 7,
            "menu_item_name": "Lamb Chops",
            "menu_item_image": "https://images.unsplash.com/photo-1544025162-d76694265947"
          }
        ],
        "restaurant_response": null,
        "status": "published",
        "created_at": "2026-01-10T19:45:00Z",
        "updated_at": "2026-01-10T19:45:00Z"
      }
    ],
    "extra": {
      "average_rating": 4.5,
      "total_reviews": 8,
      "rating_breakdown": {
        "5_star": 5,
        "4_star": 2,
        "3_star": 1,
        "2_star": 0,
        "1_star": 0
      }
    }
  }
}
```

**Used by EPICs:**
- ✅ SR-68 (User profile - Customer Reviews)

**Priority:** 🟢 LOW  
**Status:** ❌ Not implemented  

---

## 👨‍💼 GROUP 4: STAFF MANAGEMENT ENDPOINTS

### [TASK-021] GET /api/admin/staff (with filters)
**Description:** List staff by role with search and pagination  
**Method:** GET  
**Route:** `/api/admin/staff?role=waiter&page=1&page_size=10&search=alice`  
**Query Params:**
- `role`: admin|waiter|kitchen (optional, filter by role)
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 10)
- `search`: Search term (name, email)
- `status`: active|inactive (optional)

**Response (Success):**
```json
{
  "code": 0,
  "message": "Staff list retrieved successfully",
  "data": {
    "total": 15,
    "page": 1,
    "page_size": 10,
    "items": [
      {
        "id": 5,
        "name": "Alice Smith",
        "email": "alice.smith@restaurant.com",
        "phone": "+1234567891",
        "role": "waiter",
        "status": "active",
        "avatar_url": "https://example.com/avatars/alice.jpg",
        "assigned_tables": [1, 3, 5, 7],
        "assigned_tables_names": ["Table 1", "Table 3", "Table 5", "Table 7"],
        "created_at": "2025-08-15T09:00:00Z",
        "last_login": "2026-01-11T08:30:00Z",
        "statistics": {
          "total_orders_served": 345,
          "average_rating": 4.7
        }
      },
      {
        "id": 12,
        "name": "Alice Johnson",
        "email": "alice.johnson@restaurant.com",
        "phone": "+1234567892",
        "role": "waiter",
        "status": "active",
        "avatar_url": null,
        "assigned_tables": [2, 4, 6],
        "assigned_tables_names": ["Table 2", "Table 4", "Table 6"],
        "created_at": "2025-09-20T10:00:00Z",
        "last_login": "2026-01-11T09:00:00Z",
        "statistics": {
          "total_orders_served": 198,
          "average_rating": 4.5
        }
      }
    ],
    "extra": null
  }
}
```

**Used by EPICs:**
- ✅ SR-102 (Admin Manage accounts - Staff Management)

**Priority:** 🟠 HIGH  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Staff Management" section  
**Replaces:** GET /api/admin/staff/admins, GET /api/admin/staff/waiters, GET /api/admin/staff/kitchen

---

### [TASK-022] POST /api/admin/staff
**Description:** Create staff account (any role)  
**Method:** POST  
**Route:** `/api/admin/staff`  
**Request Body:**
```json
{
  "name": "Bob Wilson",
  "email": "bob.wilson@restaurant.com",
  "password": "SecurePassword123!",
  "phone": "+1234567893",
  "role": "waiter",
  "assigned_tables": [8, 9, 10]
}
```

**Response (Success):**
```json
{
  "code": 0,
  "message": "Staff account created successfully",
  "data": {
    "id": 16,
    "name": "Bob Wilson",
    "email": "bob.wilson@restaurant.com",
    "phone": "+1234567893",
    "role": "waiter",
    "status": "active",
    "avatar_url": null,
    "assigned_tables": [8, 9, 10],
    "assigned_tables_names": ["Table 8", "Table 9", "Table 10"],
    "created_at": "2026-01-11T12:30:00Z",
    "invite_sent": false
  }
}
```

**Response (Error - Email Already Exists):**
```json
{
  "code": 400,
  "message": "Email already in use",
  "data": {
    "field": "email",
    "error": "duplicate"
  }
}
```

**Used by EPICs:**
- ✅ SR-102 (Admin Manage accounts - Staff Management)

**Priority:** 🟠 HIGH  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Staff Management" section

---

### [TASK-023] GET /api/admin/staff/:id
**Description:** Get staff details (role-specific data)  
**Method:** GET  
**Route:** `/api/admin/staff/:id`  

**Used by EPICs:**
- ✅ SR-102 (Admin Manage accounts - Staff Management)

**Priority:** 🟠 HIGH  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Staff Management" section

---

### [TASK-024] PUT /api/admin/staff/:id
**Description:** Update staff account  
**Method:** PUT  
**Route:** `/api/admin/staff/:id`  
**Body:** `{ name?, email?, role?, assignedTables?, status?: "active|inactive" }`  

**Used by EPICs:**
- ✅ SR-102 (Admin Manage accounts - Staff Management)

**Priority:** 🟠 HIGH  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Staff Management" section

---

### [TASK-025] DELETE /api/admin/staff/:id
**Description:** Delete staff account  
**Method:** DELETE  
**Route:** `/api/admin/staff/:id`  

**Used by EPICs:**
- ✅ SR-102 (Admin Manage accounts - Staff Management)

**Priority:** 🟠 HIGH  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Staff Management" section

---

### [TASK-026] POST /api/admin/staff/:id/send-invite
**Description:** Send invite email (works for all roles)  
**Method:** POST  
**Route:** `/api/admin/staff/:id/send-invite`  
**Body:** `{ email, role: "admin|waiter|kitchen" }`  

**Used by EPICs:**
- ✅ SR-102 (Admin Manage accounts - Staff Management)

**Priority:** 🟡 MEDIUM  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Staff Management" section

---

### [TASK-027] PATCH /api/admin/staff/:id/assign-tables
**Description:** Assign tables to waiter  
**Method:** PATCH  
**Route:** `/api/admin/staff/:id/assign-tables`  
**Body:** `{ tableIds: [...] }`  

**Used by EPICs:**
- ✅ SR-102 (Admin Manage accounts - Waiter-Specific Staff Management)

**Priority:** 🟡 MEDIUM  
**Status:** ❌ Not implemented  

---

### [TASK-028] GET /api/staff/profile
**Description:** Get logged-in staff profile (role-specific)  
**Method:** GET  
**Route:** `/api/staff/profile`  

**Response (Success - Waiter):**
```json
{
  "code": 0,
  "message": "Staff profile retrieved successfully",
  "data": {
    "id": 5,
    "name": "Alice Smith",
    "email": "alice.smith@restaurant.com",
    "phone": "+1234567891",
    "role": "waiter",
    "status": "active",
    "avatar_url": "https://example.com/avatars/alice.jpg",
    "assigned_tables": [1, 3, 5, 7],
    "assigned_tables_details": [
      {
        "id": 1,
        "name": "Table 1",
        "capacity": 4,
        "status": "occupied"
      },
      {
        "id": 3,
        "name": "Table 3",
        "capacity": 2,
        "status": "available"
      },
      {
        "id": 5,
        "name": "Table 5",
        "capacity": 6,
        "status": "occupied"
      },
      {
        "id": 7,
        "name": "Table 7",
        "capacity": 4,
        "status": "available"
      }
    ],
    "created_at": "2025-08-15T09:00:00Z",
    "last_login": "2026-01-11T08:30:00Z",
    "statistics": {
      "total_orders_served": 345,
      "orders_today": 12,
      "average_rating": 4.7,
      "active_orders": 3
    }
  }
}
```

**Response (Success - Kitchen):**
```json
{
  "code": 0,
  "message": "Staff profile retrieved successfully",
  "data": {
    "id": 8,
    "name": "Chef Mike",
    "email": "chef.mike@restaurant.com",
    "phone": "+1234567894",
    "role": "kitchen",
    "status": "active",
    "avatar_url": "https://example.com/avatars/chef-mike.jpg",
    "created_at": "2025-07-01T08:00:00Z",
    "last_login": "2026-01-11T07:00:00Z",
    "statistics": {
      "total_orders_prepared": 1250,
      "orders_today": 45,
      "average_prep_time": 18,
      "active_orders": 8,
      "pending_orders": 3
    }
  }
}
```

**Response (Success - Admin):**
```json
{
  "code": 0,
  "message": "Staff profile retrieved successfully",
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@restaurant.com",
    "phone": "+1234567890",
    "role": "admin",
    "status": "active",
    "avatar_url": "https://example.com/avatars/admin.jpg",
    "permissions": [
      "manage_staff",
      "manage_menu",
      "manage_tables",
      "manage_orders",
      "view_reports"
    ],
    "created_at": "2025-01-01T00:00:00Z",
    "last_login": "2026-01-11T08:00:00Z"
  }
}
```

**Used by EPICs:**
- ✅ SR-69 (Admin Profile)
- ✅ SR-69 (Waiter Profile)
- ✅ SR-120 (Kitchen Staff Profile)

**Priority:** 🟡 MEDIUM  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Staff Profile" section

---

### [TASK-029] PUT /api/staff/profile
**Description:** Update own profile  
**Method:** PUT  
**Route:** `/api/staff/profile`  
**Body:** `{ name?, email?, phone?, avatar? }`  

**Used by EPICs:**
- ✅ SR-69 (Admin Profile)
- ✅ SR-69 (Waiter Profile)
- ✅ SR-120 (Kitchen Staff Profile)

**Priority:** 🟡 MEDIUM  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Staff Profile" section

---

### [TASK-030] PATCH /api/staff/password
**Description:** Change password (all staff)  
**Method:** PATCH  
**Route:** `/api/staff/password`  
**Body:** `{ oldPassword, newPassword }`  

**Used by EPICs:**
- ✅ SR-69 (Admin Profile)
- ✅ SR-69 (Waiter Profile)
- ✅ SR-120 (Kitchen Staff Profile)

**Priority:** 🟡 MEDIUM  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Staff Profile" section

---

## 📊 GROUP 5: DASHBOARD & REPORTS ENDPOINTS

### [TASK-031] GET /api/dashboard (with filters)
**Description:** Get dashboard data (role-specific sections)  
**Method:** GET  
**Route:** `/api/dashboard?role=admin&section=stats&timeRange=today`  
**Query Params:**
- `role`: admin|waiter|kitchen
- `section`: stats|orders|revenue|queue
- `timeRange`: today|week|month

**Response (Success - Admin Dashboard):**
```json
{
  "code": 0,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "stats": {
      "total_revenue_today": 3450.75,
      "total_orders_today": 67,
      "active_orders": 12,
      "completed_orders_today": 55,
      "average_order_value": 51.50,
      "total_customers_today": 89,
      "tables_occupied": 8,
      "tables_available": 12
    },
    "orders": {
      "pending": 5,
      "preparing": 7,
      "ready": 3,
      "served": 52
    },
    "revenue": {
      "hourly_breakdown": [
        {"hour": "08:00", "revenue": 245.50, "orders": 8},
        {"hour": "09:00", "revenue": 389.25, "orders": 12},
        {"hour": "10:00", "revenue": 456.00, "orders": 15},
        {"hour": "11:00", "revenue": 678.50, "orders": 18},
        {"hour": "12:00", "revenue": 1681.50, "orders": 14}
      ],
      "payment_methods": {
        "cash": 1200.00,
        "card": 1850.75,
        "ewallet": 400.00
      }
    },
    "top_items_today": [
      {
        "menu_item_id": 31,
        "name": "Grilled Salmon",
        "orders_count": 24,
        "revenue": 599.76
      },
      {
        "menu_item_id": 7,
        "name": "Lamb Chops",
        "orders_count": 18,
        "revenue": 630.00
      },
      {
        "menu_item_id": 5,
        "name": "Grilled Chicken Breast",
        "orders_count": 15,
        "revenue": 360.00
      }
    ],
    "staff_performance": [
      {
        "staff_id": 5,
        "name": "Alice Smith",
        "role": "waiter",
        "orders_served": 23,
        "revenue_generated": 1189.45
      },
      {
        "staff_id": 8,
        "name": "Chef Mike",
        "role": "kitchen",
        "orders_prepared": 45,
        "average_prep_time": 18
      }
    ]
  }
}
```

**Response (Success - Kitchen Dashboard):**
```json
{
  "code": 0,
  "message": "Kitchen dashboard data retrieved successfully",
  "data": {
    "queue": [
      {
        "id": 1001,
        "order_number": "ORD-2026-001001",
        "table_name": "Table 5",
        "status": "pending",
        "items_count": 3,
        "created_at": "2026-01-11T10:30:00Z",
        "waiting_time_minutes": 5,
        "priority": "normal"
      },
      {
        "id": 1002,
        "order_number": "ORD-2026-001002",
        "table_name": "Table 3",
        "status": "preparing",
        "items_count": 2,
        "created_at": "2026-01-11T10:25:00Z",
        "waiting_time_minutes": 10,
        "priority": "high"
      }
    ],
    "stats": {
      "pending_orders": 3,
      "preparing_orders": 5,
      "ready_orders": 4,
      "average_prep_time_today": 18,
      "orders_completed_today": 45
    },
    "active_orders": 8
  }
}
```

**Response (Success - Waiter Dashboard):**
```json
{
  "code": 0,
  "message": "Waiter dashboard data retrieved successfully",
  "data": {
    "pending_orders": [
      {
        "id": 1003,
        "order_number": "ORD-2026-001003",
        "table_name": "Table 1",
        "status": "ready",
        "items_count": 2,
        "total_amount": 45.99,
        "created_at": "2026-01-11T10:40:00Z"
      }
    ],
    "assigned_tables": [
      {
        "id": 1,
        "name": "Table 1",
        "status": "occupied",
        "capacity": 4,
        "current_order_id": 1003
      },
      {
        "id": 3,
        "name": "Table 3",
        "status": "available",
        "capacity": 2,
        "current_order_id": null
      }
    ],
    "stats": {
      "orders_served_today": 12,
      "revenue_generated_today": 618.00,
      "active_orders": 3,
      "tables_assigned": 4,
      "tables_occupied": 2
    }
  }
}
```

**Used by EPICs:**
- ✅ SR-69 (Admin Dashboard & Analytics)
- ✅ SR-69 (Kitchen Display System - Admin View)
- ✅ SR-69 (Waiter Dashboard)
- ✅ SR-120 (Kitchen Display System - KDS)

**Priority:** 🟠 HIGH  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Dashboard" section  
**Replaces:** 5+ separate dashboard endpoints

---

### [TASK-032] GET /api/admin/reports (with filters)
**Description:** Get reports with flexible type and export format  
**Method:** GET  
**Route:** `/api/admin/reports?type=revenue&format=data&from=2026-01-01&to=2026-01-31`  
**Query Params:**
- `type`: revenue|top-items|peak-hours|sales-by-category
- `format`: data|chart
- `from`: ISO date
- `to`: ISO date
- `exportAs`: json|pdf|csv (optional)

**Response (Success - Revenue Report Data):**
```json
{
  "code": 0,
  "message": "Revenue report retrieved successfully",
  "data": {
    "total": 31,
    "page": 1,
    "page_size": 31,
    "items": [
      {
        "date": "2026-01-01",
        "revenue": 2450.75,
        "orders": 48,
        "customers": 65,
        "average_order_value": 51.06
      },
      {
        "date": "2026-01-02",
        "revenue": 3120.50,
        "orders": 62,
        "customers": 84,
        "average_order_value": 50.33
      },
      {
        "date": "2026-01-03",
        "revenue": 2890.25,
        "orders": 55,
        "customers": 72,
        "average_order_value": 52.55
      }
    ],
    "extra": {
      "total_revenue": 87560.50,
      "total_orders": 1689,
      "total_customers": 2234,
      "average_order_value": 51.84,
      "growth_rate": 12.5,
      "best_day": {
        "date": "2026-01-15",
        "revenue": 4567.89
      },
      "worst_day": {
        "date": "2026-01-08",
        "revenue": 1234.56
      }
    }
  }
}
```

**Response (Success - Top Items Report):**
```json
{
  "code": 0,
  "message": "Top items report retrieved successfully",
  "data": {
    "total": 50,
    "page": 1,
    "page_size": 10,
    "items": [
      {
        "id": 31,
        "name": "Grilled Salmon",
        "category": "Main Courses",
        "orders_count": 456,
        "revenue": 11395.44,
        "percentage_of_total": 13.01,
        "average_rating": 4.8,
        "image_url": "https://images.unsplash.com/photo-1485921325833-c519f76c4927"
      },
      {
        "id": 7,
        "name": "Lamb Chops",
        "category": "Main Courses",
        "orders_count": 389,
        "revenue": 13615.00,
        "percentage_of_total": 15.55,
        "average_rating": 4.9,
        "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947"
      },
      {
        "id": 5,
        "name": "Grilled Chicken Breast",
        "category": "Main Courses",
        "orders_count": 345,
        "revenue": 8280.00,
        "percentage_of_total": 9.46,
        "average_rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1532550907401-a500c9a57435"
      }
    ],
    "extra": {
      "date_range": {
        "from": "2026-01-01",
        "to": "2026-01-31"
      },
      "total_revenue": 87560.50,
      "total_orders": 1689
    }
  }
}
```

**Response (Success - Peak Hours Chart):**
```json
{
  "code": 0,
  "message": "Peak hours chart data retrieved successfully",
  "data": {
    "chart_data": [
      {"hour": "06:00", "orders": 12, "revenue": 245.50},
      {"hour": "07:00", "orders": 28, "revenue": 567.80},
      {"hour": "08:00", "orders": 45, "revenue": 980.25},
      {"hour": "09:00", "orders": 56, "revenue": 1234.75},
      {"hour": "10:00", "orders": 48, "revenue": 1089.50},
      {"hour": "11:00", "orders": 89, "revenue": 2345.90},
      {"hour": "12:00", "orders": 134, "revenue": 3567.45},
      {"hour": "13:00", "orders": 112, "revenue": 2890.35},
      {"hour": "14:00", "orders": 67, "revenue": 1678.90},
      {"hour": "15:00", "orders": 34, "revenue": 789.45},
      {"hour": "16:00", "orders": 23, "revenue": 567.30},
      {"hour": "17:00", "orders": 45, "revenue": 1123.50},
      {"hour": "18:00", "orders": 98, "revenue": 2456.80},
      {"hour": "19:00", "orders": 145, "revenue": 3789.25},
      {"hour": "20:00", "orders": 123, "revenue": 3234.60},
      {"hour": "21:00", "orders": 78, "revenue": 1890.45},
      {"hour": "22:00", "orders": 34, "revenue": 867.50}
    ],
    "peak_hours": [
      {"hour": "19:00", "orders": 145, "revenue": 3789.25},
      {"hour": "12:00", "orders": 134, "revenue": 3567.45},
      {"hour": "20:00", "orders": 123, "revenue": 3234.60}
    ],
    "quiet_hours": [
      {"hour": "06:00", "orders": 12, "revenue": 245.50},
      {"hour": "16:00", "orders": 23, "revenue": 567.30},
      {"hour": "07:00", "orders": 28, "revenue": 567.80}
    ]
  }
}
```

**Response (Success - Sales by Category):**
```json
{
  "code": 0,
  "message": "Sales by category report retrieved successfully",
  "data": {
    "total": 8,
    "page": 1,
    "page_size": 10,
    "items": [
      {
        "category_id": 2,
        "category_name": "Main Courses",
        "orders_count": 1234,
        "revenue": 45678.90,
        "percentage_of_total": 52.16,
        "average_order_value": 37.02
      },
      {
        "category_id": 1,
        "category_name": "Appetizers",
        "orders_count": 567,
        "revenue": 12345.67,
        "percentage_of_total": 14.10,
        "average_order_value": 21.78
      },
      {
        "category_id": 5,
        "category_name": "Desserts",
        "orders_count": 456,
        "revenue": 9876.54,
        "percentage_of_total": 11.28,
        "average_order_value": 21.66
      }
    ],
    "extra": {
      "total_revenue": 87560.50,
      "total_orders": 1689
    }
  }
}
```

**Response (Success - PDF Export):**
```json
{
  "code": 0,
  "message": "Report exported successfully",
  "data": {
    "export_url": "https://storage.example.com/reports/revenue-2026-01.pdf",
    "file_name": "revenue-report-2026-01.pdf",
    "file_size": 245680,
    "expires_at": "2026-01-12T12:00:00Z"
  }
}
```

**Used by EPICs:**
- ✅ SR-69 (Admin Dashboard & Analytics)

**Priority:** 🟡 MEDIUM  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Reports" section  
**Replaces:** 8 separate report endpoints

---

## 🔐 GROUP 6: AUTHENTICATION & UTILITIES ENDPOINTS

### [TASK-033] POST /api/auth/login
**Description:** Generic staff login (Admin, Waiter, Kitchen)  
**Method:** POST  
**Route:** `/api/auth/login`  
**Request Body:**
```json
{
  "email": "alice.smith@restaurant.com",
  "password": "SecurePassword123!",
  "role": "waiter"
}
```

**Response (Success - Waiter):**
```json
{
  "code": 0,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": 5,
      "name": "Alice Smith",
      "email": "alice.smith@restaurant.com",
      "phone": "+1234567891",
      "role": "waiter",
      "status": "active",
      "avatar_url": "https://example.com/avatars/alice.jpg",
      "assigned_tables": [1, 3, 5, 7],
      "permissions": [
        "view_orders",
        "create_bill",
        "process_payment"
      ]
    }
  }
}
```

**Response (Success - Kitchen):**
```json
{
  "code": 0,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": 8,
      "name": "Chef Mike",
      "email": "chef.mike@restaurant.com",
      "phone": "+1234567894",
      "role": "kitchen",
      "status": "active",
      "avatar_url": "https://example.com/avatars/chef-mike.jpg",
      "permissions": [
        "view_orders",
        "update_order_status",
        "send_alerts"
      ]
    }
  }
}
```

**Response (Success - Admin):**
```json
{
  "code": 0,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@restaurant.com",
      "phone": "+1234567890",
      "role": "admin",
      "status": "active",
      "avatar_url": "https://example.com/avatars/admin.jpg",
      "permissions": [
        "manage_staff",
        "manage_menu",
        "manage_tables",
        "manage_orders",
        "view_reports",
        "all_permissions"
      ]
    }
  }
}
```

**Response (Error - Invalid Credentials):**
```json
{
  "code": 401,
  "message": "Invalid email or password",
  "data": null
}
```

**Response (Error - Account Inactive):**
```json
{
  "code": 403,
  "message": "Account is inactive. Please contact administrator",
  "data": {
    "status": "inactive",
    "reason": "Account suspended"
  }
}
```

**Used by EPICs:**
- ✅ SR-69 (Waiter Login)
- ✅ SR-120 (Kitchen Staff Authentication)

**Priority:** 🔴 CRITICAL  
**Status:** ❌ Not implemented  
**Details:** See "Consolidated Common APIs - Authentication" section  
**Replaces:** 3 separate login endpoints

---

### [TASK-034] POST /api/auth/social-login
**Description:** Generic social login (Google, Facebook, Apple)  
**Method:** POST  
**Route:** `/api/auth/social-login`  
**Body:** `{ provider: "google|facebook|apple", token: "..." }`  

**Used by EPICs:**
- ✅ SR-67 (Guest/Public Order Flow - Social Login)

**Priority:** 🟢 LOW  
**Status:** ❌ Not implemented  

---

### [TASK-035] GET /api/tables/:tableToken/info
**Description:** Get table info from QR token (for guest orders)  
**Method:** GET  
**Route:** `/api/tables/:tableToken/info`  
**Example:** `/api/tables/TBL5-QR-ABC123XYZ/info`

**Response (Success - Table Available):**
```json
{
  "code": 0,
  "message": "Table information retrieved successfully",
  "data": {
    "table_id": 5,
    "table_name": "Table 5",
    "table_number": "5",
    "capacity": 6,
    "status": "available",
    "qr_token": "TBL5-QR-ABC123XYZ",
    "location": {
      "area": "Main Hall",
      "section": "Window Side"
    },
    "current_session": null,
    "waiter_assigned": {
      "id": 5,
      "name": "Alice Smith",
      "phone": "+1234567891",
      "avatar_url": "https://example.com/avatars/alice.jpg"
    },
    "restaurant_info": {
      "name": "Smart Restaurant",
      "logo_url": "https://example.com/logo.png",
      "wifi_ssid": "SmartRestaurant_Guest",
      "wifi_password": "guest2026"
    },
    "menu_url": "/api/menu?tableId=5"
  }
}
```

**Response (Success - Table Occupied with Active Order):**
```json
{
  "code": 0,
  "message": "Table information retrieved successfully",
  "data": {
    "table_id": 5,
    "table_name": "Table 5",
    "table_number": "5",
    "capacity": 6,
    "status": "occupied",
    "qr_token": "TBL5-QR-ABC123XYZ",
    "location": {
      "area": "Main Hall",
      "section": "Window Side"
    },
    "current_session": {
      "session_id": "SESSION-2026-5001",
      "started_at": "2026-01-11T10:30:00Z",
      "customer_count": 4,
      "active_order": {
        "order_id": 1001,
        "order_number": "ORD-2026-001001",
        "status": "preparing",
        "total_amount": 67.58,
        "items_count": 3
      }
    },
    "waiter_assigned": {
      "id": 5,
      "name": "Alice Smith",
      "phone": "+1234567891",
      "avatar_url": "https://example.com/avatars/alice.jpg"
    },
    "restaurant_info": {
      "name": "Smart Restaurant",
      "logo_url": "https://example.com/logo.png",
      "wifi_ssid": "SmartRestaurant_Guest",
      "wifi_password": "guest2026"
    },
    "menu_url": "/api/menu?tableId=5",
    "order_url": "/api/orders/1001"
  }
}
```

**Response (Error - Invalid QR Token):**
```json
{
  "code": 404,
  "message": "Invalid QR code. Table not found",
  "data": null
}
```

**Response (Error - QR Token Expired):**
```json
{
  "code": 410,
  "message": "QR code has expired. Please request a new one from staff",
  "data": {
    "expired_at": "2026-01-10T23:59:59Z",
    "contact_waiter": true
  }
}
```

**Response (Error - Table Not Available):**
```json
{
  "code": 423,
  "message": "Table is currently reserved or under maintenance",
  "data": {
    "status": "reserved",
    "reason": "Reserved for party at 7 PM",
    "available_at": "2026-01-11T21:00:00Z"
  }
}
```

**Used by EPICs:**
- ✅ SR-67 (Customer shopping cart + order payment - Utilities)

**Priority:** 🟠 HIGH  
**Status:** ❌ Not implemented  

---

### [TASK-036] GET /api/tables (with filters)
**Description:** Get tables with assignedTo filter (already exists but needs extension)  
**Method:** GET  
**Route:** `/api/tables?assignedTo=waiter_id`  

**Used by EPICs:**
- ✅ SR-69 (Waiter Tables)

**Priority:** 🟠 HIGH  
**Status:** ⚠️ Partially exists (needs extension)  

---

## 📊 SUMMARY TABLE: ENDPOINTS BY GROUP

| Group | Endpoints | Priority Breakdown | Total |
|-------|-----------|-------------------|-------|
| Order Management | TASK-001 to TASK-009 | 🔴 5, 🟠 1, 🟡 2, 🟢 1 | 9 |
| Bills & Payments | TASK-010 to TASK-015 | 🔴 5, 🟡 1 | 6 |
| Customer Profile | TASK-016 to TASK-020 | 🟡 3, 🟢 2 | 5 |
| Staff Management | TASK-021 to TASK-030 | 🟠 5, 🟡 5 | 10 |
| Dashboard & Reports | TASK-031 to TASK-032 | 🟠 1, 🟡 1 | 2 |
| Auth & Utilities | TASK-033 to TASK-036 | 🔴 1, 🟠 2, 🟢 1 | 4 |
| **TOTAL** | **36 unique endpoints** | **🔴 11, 🟠 9, 🟡 12, 🟢 4** | **36** |

---

## 📋 EPIC COVERAGE MATRIX

| EPIC Code | EPIC Name | Tasks Used | Priority |
|-----------|-----------|------------|----------|
| SR-66 | Customer flow (Menu flow) | TASK-001, TASK-002 | HIGH |
| SR-67 | Customer shopping cart + order payment | TASK-001 to TASK-015, TASK-033 to TASK-035 | CRITICAL |
| SR-68 | User profile | TASK-002, TASK-003, TASK-009, TASK-016 to TASK-020 | MEDIUM |
| SR-69 | Admin - Customer order | TASK-002 to TASK-006, TASK-010 to TASK-014, TASK-028 to TASK-032, TASK-036 | CRITICAL |
| SR-102 | Admin Manage accounts | TASK-021 to TASK-027 | HIGH |
| SR-120 | Kitchen Staff Dashboard | TASK-002 to TASK-005, TASK-008, TASK-028 to TASK-031, TASK-033 | HIGH |

---

### 📌 KEY CONSOLIDATION BENEFITS

✅ **33-38 fewer endpoints** to maintain
✅ **Unified access control** - Role checked per endpoint, not per route
✅ **Flexible filtering** - Single endpoint with dynamic query parameters
✅ **Easier to test** - Fewer endpoints to mock/test
✅ **Better performance** - Fewer database connection pools
✅ **Cleaner code** - Less duplication in handlers
✅ **Scalable** - New roles can use same endpoints with permission checks

---

## 🎨 UI COMPONENTS STATUS

### ✅ Already Built
- Button, Input, Select, Checkbox, Radio, Switch, Slider
- Dialog, Drawer, Modal, Toast
- Table, Tabs, Pagination
- Avatar, Badge, Card, Carousel
- Form validation with React Hook Form + Zod
- Responsive layout

### ❌ Need to Build
- **Real-time components** (Polling indicators, Live Updates, Refresh status)
- **KDS-specific components** (Timer, Order Queue Display, Auto-refresh)
- **Payment components** (Stripe form, Payment status polling)
- **Chart components** (for analytics)
- **Enhanced image gallery** (for menu items)
- **Polling utilities** (React Query hooks with auto-refetch, custom polling logic)

---

## 📝 NEXT STEPS RECOMMENDATION

1. **Phase 1 (CRITICAL):**
   - Build Order Confirmation Page
   - Build Payment Page (Stripe)
   - Build Order Tracking Page
   - Create `orderApi.ts` & `paymentApi.ts`

2. **Phase 2 (HIGH PRIORITY):**
   - Build Order Management Pages (Admin)
   - Build Kitchen Display System
   - Build Waiter Dashboard
   - Create supporting API services

3. **Phase 3 (MEDIUM):**
   - Customer Account Pages
   - Reports & Analytics
   - Staff Management

4. **Phase 4 (POLISH):**
   - Guest Landing Page
   - Advanced Features
   - Optimizations

