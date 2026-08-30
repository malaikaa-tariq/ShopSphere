# Case Study: ShopSphere Multi-Vendor MERN E-Commerce Architecture

## 1. Executive Summary
ShopSphere is a full-stack, scalable multi-vendor e-commerce platform built on the MERN stack (MongoDB, Express.js, React, Node.js). The system facilitates seamless interactions between **Buyers**, **Vendors (Sellers)**, and **Platform Administrators**. Key implemented features include role-based access control (RBAC), Stripe payment integration via webhooks, order status lifecycles, and verified user reviews.

---

## 2. System Architecture

```text
                 ┌────────────────────────────────┐
                 │          React Client          │
                 │     (Vite + Tailwind CSS)      │
                 └───────────────┬────────────────┘
                                 │ HTTP / REST
                                 ▼
                 ┌────────────────────────────────┐
                 │      Express API Server        │
                 │     (Node.js + JWT Auth)       │
                 └──────┬──────────────────┬──────┘
                        │                  │
           Database Ops │                  │ Payment Events
                        ▼                  ▼
          ┌───────────────────┐    ┌───────────────────┐
          │   MongoDB Atlas   │    │  Stripe Gateway   │
          │  (Mongoose ODM)   │    │ (Checkout/Webhooks│
          └───────────────────┘    └───────────────────┘