# Lakshya Yadav Portfolio Platform

A premium full-stack personal portfolio and admin platform built with Next.js, Tailwind CSS, Framer Motion, Express.js, MongoDB, and JWT authentication.

## Structure

- `frontend`: portfolio website and admin panel UI
- `backend`: Express API, auth, database models, uploads, and dashboard metrics

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create environment files:

- `frontend/.env.local`
- `backend/.env`

3. Add the following values:

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5001/api

# backend/.env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/lakshya-portfolio
JWT_SECRET=change-this-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123!
ADMIN_NOTIFICATION_EMAIL=admin@example.com
CLIENT_URL=http://localhost:3000
```

4. Run both apps:

```bash
npm run dev
```

## Features

- Premium animated portfolio with dark and light theme
- Lead generation form with MongoDB persistence
- Admin login with JWT
- Lead, portfolio, service, testimonial, blog, resume, and contact management
- Analytics-ready dashboard cards and charts
- Upload endpoints for project images and resume files
- Deployment-ready split frontend/backend architecture

## Notes

- The API seeds a default admin account from environment variables.
- Uploaded files are stored in `backend/uploads`.
- The frontend includes polished sample content that can be replaced through the admin panel or API.
# Portfolio
