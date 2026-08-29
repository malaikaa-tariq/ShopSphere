# Case Study — ShopSphere Multi-Vendor MERN E-Commerce Platform

## 1. Project overview
ShopSphere is a multi-vendor e-commerce marketplace built with the MERN stack. It supports buyers, sellers and administrators through role-based authentication and separate workflows.

## 2. Problem
Traditional single-store e-commerce applications do not model independent sellers well. A marketplace needs seller ownership, product lifecycle management, order visibility, reviews, payment processing and administrative oversight.

## 3. Objectives
- Build a responsive marketplace interface.
- Implement buyer and seller authentication.
- Protect seller/admin routes with role-based authorization.
- Implement product creation, updates, deletion and reviews.
- Implement cart and order creation.
- Integrate Stripe Checkout.
- Provide seller and admin dashboard foundations.

## 4. Technology choices
### Frontend
React, Vite, Tailwind CSS, Redux Toolkit and React Router were selected for a fast component-based UI, predictable state management and clean routing.

### Backend
Node.js and Express provide a REST API. Mongoose provides schema validation and MongoDB persistence.

### Security
Passwords are hashed with bcrypt. JWT tokens are used for API authorization. Server-side role checks prevent buyers from accessing seller/admin resources.

### Payments
Stripe Checkout is used so card data is handled by Stripe rather than the application. A webhook endpoint changes an order from pending to paid/confirmed after Stripe reports successful checkout.

## 5. Architecture
```text
React/Vite
   |
   | REST + JWT
   v
Express API
   |
   +---- Auth / RBAC
   +---- Products / Reviews
   +---- Orders
   +---- Stripe
   |
   v
MongoDB
```

## 6. Main user journeys

### Buyer
1. Register/login.
2. Browse/search products.
3. Open product details.
4. Add products to cart.
5. Enter shipping information.
6. Create order.
7. Redirect to Stripe Checkout.
8. Stripe webhook marks payment successful.
9. Buyer can review purchased products in the completed version.

### Seller
1. Register as seller.
2. Access seller dashboard.
3. Create products.
4. Edit/archive own products.
5. View orders containing their products.
6. Update fulfilment status.

### Admin
1. Admin account is provisioned securely.
2. Admin dashboard shows users, sellers, products, orders and paid revenue.
3. Admin can moderate products and order status in the extended version.

## 7. Data model
### User
- name
- email
- password hash
- role
- avatar

### Product
- seller
- name
- slug
- description
- category
- price
- stock
- images
- reviews
- rating
- status

### Order
- buyer
- items
- seller ownership per item
- shipping address
- total
- payment status
- order status
- Stripe session ID

## 8. Challenges and solutions
### Challenge: Multiple sellers in one marketplace
Solution: every product stores a seller reference and order items preserve seller ownership.

### Challenge: Authorization
Solution: JWT authentication plus a reusable `authorize()` middleware.

### Challenge: Payment confirmation
Solution: Stripe Checkout plus a server-side webhook rather than trusting a browser success page.

### Challenge: Product reviews
Solution: reviews are embedded on the product and duplicate reviews are prevented by user ID.

## 9. Future improvements
- Cloudinary image uploads
- Seller payout ledger
- Product variants
- Coupons
- Wishlist
- Notifications with Socket.IO
- Email verification and password reset
- Refresh tokens
- Advanced admin analytics
- Automated tests
- CI/CD
- Production observability

## 10. Acceptance checklist
- [x] Buyer authentication
- [x] Seller authentication
- [x] Admin authorization layer
- [x] Product lifecycle API
- [x] Order creation API
- [x] Stripe Checkout session
- [x] Stripe webhook endpoint
- [x] Seller order view
- [x] Admin overview API
- [x] Review API
- [ ] Production secrets
- [ ] Production deployment
- [ ] Live URL
- [ ] GitHub repository URL
