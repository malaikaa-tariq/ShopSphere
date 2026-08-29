# ShopSphere — Multi-Vendor MERN E-Commerce

An original implementation of the Becodemy-style multi-vendor MERN e-commerce assignment.

## Stack
- Frontend: React + Vite + Tailwind CSS + Redux Toolkit + React Router
- Backend: Node.js + Express + MongoDB/Mongoose
- Auth: JWT + bcrypt + role-based authorization
- Payments: Stripe Checkout + webhook-ready order flow
- Images: Cloudinary-ready upload architecture
- Roles: buyer, seller, admin

## Core acceptance criteria
- Multi-vendor authentication: buyer/seller/admin
- Product lifecycle: seller creates/updates products; buyers browse products
- Cart and checkout
- Stripe Checkout session creation
- Order creation and status lifecycle
- Seller dashboard endpoints
- Admin dashboard endpoints
- Product reviews
- Case study document included

## Folder structure
```text
becodemy-multivendor-mern/
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── utils/
│       └── server.js
├── case-study/
│   └── CASE-STUDY.md
├── .env.example
├── .gitignore
└── README.md
```

## Run locally

### 1. Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 2. Frontend
```bash
cd client
npm install
npm run dev
```

### Environment
Set MongoDB and JWT values. For Stripe, add:
- STRIPE_SECRET_KEY
- CLIENT_URL
- STRIPE_WEBHOOK_SECRET (optional until webhook is configured)

## Demo roles
Register users through the UI. To create a seller/admin, set the role in MongoDB or add an admin-only role-management endpoint before production.

## Important production work
Before submission:
1. Add real image upload (Cloudinary/S3).
2. Configure Stripe webhook and verify signatures.
3. Add email verification/password reset.
4. Add refresh-token rotation or secure session strategy.
5. Add validation/rate limiting/logging.
6. Deploy client and server.
7. Add production MongoDB and Stripe secrets.
8. Run end-to-end tests.
