👑 Princess Beauty App – Full-Stack MERN E-Commerce Platform

A production-ready, multi-service e-commerce platform built with the MERN Stack for a beauty & cosmetics business.
It supports customers, admins, background workers, payments (Stripe), and webhooks, following modern SaaS architecture.

This project demonstrates real-world software engineering practices such as:

Micro-service-like architecture

Secure payments

Webhook-based automation

Admin dashboards

Inventory & order management

🚀 Live Architecture Overview

The system is divided into 4 independent applications:

Service	Purpose
Frontend	Customer-facing beauty shop (React + Vite)
Admin Frontend	Admin dashboard for managing products, orders, users
Backend API	Business logic, auth, products, orders, Stripe
Background Services	Webhook handling, async jobs, payment verification

This architecture is similar to what is used by Shopify, Uber, Stripe, and Amazon-like systems.

🛠 Tech Stack
Frontend (Customer Store)

React (Vite)

Tailwind CSS

Axios

Stripe.js

Admin Frontend

React (Vite)

Dashboard UI

Charts & Tables

Backend API

Node.js

Express.js

MongoDB

JWT Authentication

Stripe API

Background Services

Webhook listeners

Order processors

Payment verifiers

💳 Payments & Webhooks

This system uses Stripe with webhooks, meaning:

User places order

Stripe processes payment

Stripe sends webhook to Background Service

Order is verified

Inventory is updated

Order status changes automatically

This is how real payment systems are built in production.

🔐 Security Features

JWT authentication

Role-based access (Admin vs Customer)

Secure Stripe payment intents

Webhook signature verification

Environment variable protection

📦 Main Features
Customers

Register & Login

Browse beauty products

Add to cart

Checkout with Stripe

View order history

Admin

Product management

Order management

Customer management

Revenue tracking

Payment status tracking

Background Services

Stripe webhook processing

Payment confirmation

Order fulfillment triggers

🗂 Project Structure
princessbeautyshop-app/
│
├── frontend/            # Customer UI
├── admin-frontend/      # Admin dashboard
├── backend/             # REST API
└── backgroundServices/  # Webhooks & async jobs

⚙️ Installation
1️⃣ Clone the repository
git clone git@github.com:AllanLucky/princessbeautyshop-app.git
cd princessbeautyshop-app

2️⃣ Install dependencies

For each folder:

cd backend
npm install

cd ../frontend
npm install

cd ../admin-frontend
npm install

cd ../backgroundServices
npm install

3️⃣ Setup Environment Variables

Create .env files in backend and backgroundServices

Example:

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
CLIENT_URL=http://localhost:5173

4️⃣ Run the system

Start each service:

# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev

# Admin
cd admin-frontend
npm run dev

# Background Services
cd backgroundServices
npm run dev

🧪 Stripe Webhooks (Local)

Use Stripe CLI:

stripe listen --forward-to localhost:8000/webhook


This allows Stripe to send live payment events to your local background service.

📈 Why This Project Is Special

This is NOT a tutorial project.

It shows:

Real payment flow

Microservice thinking

Secure webhooks

Admin + Customer platforms

Production-ready architecture

This is the same architecture used by real startups and SaaS companies.

👨‍💻 Built By

Allan Lucky Tsory
Full-Stack Developer (MERN, MONGODB, EXPRESS, REACT WITH VITE)

“This project represents my ability to design, build, and deploy real-world production systems.”
