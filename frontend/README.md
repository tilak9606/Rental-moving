# Rental Platform Frontend

An Airbnb-themed React frontend for the Rental Platform built with Vite.

## Features

- **Airbnb-inspired UI** with rose/gradient theme
- **Role-based access** (Tenant, Landlord, Admin)
- **Environment-based configuration** for easy deployment
- **Property browsing** with category filters and search
- **Visit scheduling** workflow
- **Move-in checklist** management
- **Support ticket** system with real-time chat
- **Admin dashboard** with analytics
- **Lazy loading** for optimal performance

## Tech Stack

- React 19 + Vite 6
- React Router DOM 7
- Tailwind CSS 3
- Axios + React Hot Toast
- Lucide React icons

## Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
# Development
VITE_API_URL=http://localhost:5000/api

# Production (example)
# VITE_API_URL=https://your-api-domain.com/api
```

> **Important:** Vite requires all client-side env variables to use the `VITE_` prefix. Never commit `.env` files to git.

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable: `VITE_API_URL=https://your-api.com/api`
4. Deploy

### Netlify
1. Push code to GitHub
2. Connect repo in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in Site Settings

### Docker
```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Navbar, Footer, ProtectedRoute
│   └── common/          # LoadingSpinner, StatusBadge
├── context/
│   └── AuthContext.jsx  # Global auth state
├── pages/
│   ├── auth/            # Login, Register
│   ├── tenant/          # MyVisits, MyMoveIns, MyTickets
│   ├── landlord/        # LandlordVisits, LandlordMoveIns, MyProperties
│   ├── admin/           # AdminDashboard
│   ├── Home.jsx
│   ├── PropertyDetail.jsx
│   └── Shortlist.jsx
├── services/            # API service layer
├── utils/
│   └── cn.js           # Tailwind class merging
├── App.jsx
└── main.jsx
```

## API Integration

All API calls use `import.meta.env.VITE_API_URL` as the base URL. The `api.js` interceptor automatically:
- Attaches JWT tokens from localStorage
- Handles 401 unauthorized responses
- Redirects to login on auth failure

## License

MIT