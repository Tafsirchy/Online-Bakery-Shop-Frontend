# Bakery & Co. - Premium Online Bakery E-Commerce Platform
A modern, full-stack e-commerce application built with Next.js 16, featuring a museum-grade shopping experience, interactive product galleries, secure checkout, and comprehensive administration dashboards.

**Next.js | React | TailwindCSS | Express | MongoDB | Stripe**

---

## 🎯 Project Description
**Bakery & Co.** is a feature-rich online bakery e-commerce platform that provides a high-end, artisan shopping experience. Users can browse freshly baked goods, manage a dynamic shopping cart, proceed through a secure checkout with Stripe, and track their orders in real-time. The platform includes sophisticated role-based dashboards for Customers, Managers, and Admins, ensuring a complete business workflow from product management to delivery tracking.

---

## ✨ Implemented Features

### 🌐 Public Features
**Landing Page** - Stunning homepage with 10+ comprehensive sections:
- **Hero Section**: High-impact visuals with refined typography and smooth entry animations.
- **Offer Slider**: Interactive promotional carousel for seasonal deals.
- **Category Discovery**: Quick-access grid for different bakery sections (Bread, Pastry, Cakes).
- **Featured Products**: Highlighted artisan items with quick "Add to Cart" and Wishlist actions.
- **Why Choose Us**: Value proposition section focusing on quality and freshness.
- **Customer Testimonials**: Social proof with ratings and feedback.
- **Delivery Map**: Interactive Leaflet map showing delivery coverage areas.
- **Newsletter**: Subscription system with toast notifications.

**Product Browsing** - Comprehensive bakery catalog:
- **Search & Filtering**: Search by name and filter by category or price range.
- **Dynamic Grid**: Responsive layout with premium hover effects and skeleton loading states.
- **Product Details**: In-depth information including ingredients, nutritional facts, and dietary tags.

### 🔐 Authentication System
**Zustand & Google OAuth** - Robust security:
- **Google One-Tap Login**: Seamless integration using `@react-oauth/google`.
- **Credentials Auth**: Secure Email/Password registration and login.
- **JWT Management**: Persistent sessions with automated token validation and expiration checks.
- **Protected Routes**: Middleware and client-side guards for sensitive areas (Dashboards/Checkout).

### 🛒 Shopping Features (Authenticated Users)
**Shopping Cart & Wishlist**:
- **Real-time Management**: Add, update, and remove items with instant state synchronization.
- **Persistent Storage**: Cart and Wishlist data persisted across sessions.
- **Smart Badge**: Dynamic count indicators in the global Navbar.

**Checkout System**:
- **Secure Processing**: Integrated with **Stripe** for credit/debit card payments.
- **Order Confirmation**: Beautiful certificate-style order confirmation with unique order IDs.
- **Coupon System**: Support for promotional codes and instant discount calculation.

### 👤 User Dashboards (Role-Based)
- **Customer Dashboard**: Overview of acquisition history, active orders, and profile settings.
- **Manager Dashboard**: Inventory oversight, stock management, and campaign controls.
- **Admin Dashboard**: Full platform control—user management, order oversight, and analytics.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16.2.4 (App Router)
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS 4.0
- **Components**: shadcn/ui (Radix UI)
- **Animations**: Framer Motion 12.0
- **State Management**: Zustand 5.0
- **Payments**: Stripe JS (@stripe/stripe-js)
- **Maps**: Leaflet & React-Leaflet
- **Icons**: Lucide React

### Backend
- **Server**: Express.js 5.2 (Latest)
- **Database**: MongoDB Atlas with Mongoose 9.5
- **Mailing**: Nodemailer with custom HTML templates
- **Security**: JWT (jsonwebtoken), bcryptjs, CORS
- **Logging**: Morgan

---

## 📁 Project Structure
```text
Online-Bakery-Shop/
├── client/                  # Frontend Next.js application
│   ├── app/                # App Router (auth, dashboard, shop)
│   ├── components/         # Shared & feature-specific UI
│   ├── store/              # Zustand stores (auth, cart, wishlist)
│   ├── lib/                # Shared utilities & Axios config
│   └── public/             # Optimized assets & certificates
│
└── server/                  # Backend Express server
    ├── controllers/        # Business logic (auth, order, product)
    ├── models/             # Mongoose schemas (User, Product, Order)
    ├── services/           # External services (Stripe, Mail)
    ├── config/             # DB & middleware configuration
    └── index.js            # Entry point
```

---

## 🚀 Setup & Installation

### Step 1: Setup Backend API
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   STRIPE_SECRET_KEY=your_stripe_key
   CLIENT_URL=http://localhost:3000
   ```
4. Start the server: `npm run dev`

### Step 2: Setup Frontend
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_id
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key
   ```
4. Start the app: `npm run dev`

---

## 🗺️ Routes Summary

| Route | Description | Access |
| :--- | :--- | :--- |
| `/` | Landing page with full bakery experience | Public |
| `/shop` | Product catalog with filters | Public |
| `/login` | Authentication entry | Public |
| `/cart` | Shopping cart management | Auth |
| `/checkout` | Stripe-powered checkout flow | Auth |
| `/customer` | User profile and order history | Customer |
| `/admin/*` | Platform oversight and user mgmt | Admin |
| `/management` | Product and stock control | Manager |

---

## 📊 API Filtering
`GET /api/products` supports advanced query parameters:
- `category`: Filter by bakery section.
- `search`: Keyword matching for titles and descriptions.
- `minPrice / maxPrice`: Range-based filtering.
- `sort`: Sort by price (asc/desc) or newest items.

---

## 📄 License
This project is for educational and demonstration purposes.

**Made with ❤️ using Next.js 16, React 19, Tailwind CSS 4, and Stripe**
