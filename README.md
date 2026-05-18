# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with:

- React
- TypeScript
- Node.js
- Express
- MongoDB
- Tailwind CSS
- JWT Authentication
- Role-Based Access Control (RBAC)

---

# Features

## Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Persistent Login
- Role-Based Access

## Lead Management
- Create Lead
- Edit Lead
- Delete Lead (Admin only)
- View Leads
- Search Leads
- Filter by Status
- Filter by Source
- Sorting
- Pagination
- CSV Export

## Frontend
- Responsive Dashboard
- Modal Forms
- Toast Notifications
- Debounced Search
- Role-based UI

---

# Tech Stack

## Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Axios
- React Router

## Backend
- Node.js
- Express
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT
- Zod

---

# Project Structure

smart-leads-dashboard/

├── backend/

├── frontend/

├── README.md

---

# Environment Variables

## Backend (.env)

PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret_key

---

# Backend Setup

cd backend

npm install

npm run dev

---

# Frontend Setup

cd frontend

npm install

npm run dev

---

# API Endpoints

## Auth
POST /api/auth/register

POST /api/auth/login

GET /api/auth/me

## Leads
GET /api/leads

POST /api/leads

PUT /api/leads/:id

DELETE /api/leads/:id

GET /api/leads/export/csv

---
# API Documentation

Base URL:

http://localhost:5000/api

---

## Authentication APIs

### Register User

POST /auth/register

Request Body:

{
  "name": "Harshal",
  "email": "harshal@gmail.com",
  "password": "123456",
  "role": "admin"
}

Response:

{
  "success": true,
  "message": "User registered successfully"
}

---

### Login User

POST /auth/login

Request Body:

{
  "email": "harshal@gmail.com",
  "password": "123456"
}

Response:

{
  "success": true,
  "token": "jwt_token"
}

---

### Get Current User

GET /auth/me

Headers:

Authorization: Bearer TOKEN

---

## Leads APIs

### Get All Leads

GET /leads

Query Params:

- page
- search
- status
- source
- sort

Example:

/leads?page=1&search=rahul&status=Qualified

---

### Create Lead

POST /leads

Headers:

Authorization: Bearer TOKEN

Request Body:

{
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "status": "Qualified",
  "source": "Instagram"
}

---

### Update Lead

PUT /leads/:id

Headers:

Authorization: Bearer TOKEN

---

### Delete Lead

DELETE /leads/:id

Headers:

Authorization: Bearer TOKEN

Admin only

---

### Export CSV

GET /leads/export/csv

Headers:

Authorization: Bearer TOKEN

# Roles

## Admin
- Full access
- Delete leads
- Export CSV

## Sales
- Create/Edit/View leads
- Cannot delete leads

---

# Future Improvements

- Dark Mode
- Charts & Analytics
- Email Integration
- Lead Activity Timeline
- Team Management

---

# Author

Harshal