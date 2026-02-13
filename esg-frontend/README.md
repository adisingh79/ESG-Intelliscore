# ESG IntelliScore - Frontend

A modern, premium React + TypeScript frontend for ESG (Environmental, Social, Governance) score prediction and analysis.

## Features

- 🎨 **Premium UI Design** - Glassmorphism, gradients, and smooth animations
- 📊 **Interactive Dashboard** - Real-time ESG metrics and company performance
- 🔮 **AI-Powered Predictions** - Machine learning-based ESG score predictions
- 📰 **News Sentiment Analysis** - Track ESG-related news with sentiment scores
- 📤 **Data Upload** - Drag-and-drop ZIP file upload with progress tracking
- 🎯 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Material-UI** - Component library
- **CountUp.js** - Animated number counters
- **Recharts** - Data visualization (optional)

## Prerequisites

- Node.js 18+ and npm
- Backend server running on `http://localhost:8000`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:8000/api
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

Create an optimized production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── api/                    # API configuration and services
│   ├── config.ts          # Axios instance and interceptors
│   └── esgService.ts      # ESG API service functions
├── components/            # Reusable components
│   ├── Navbar.tsx         # Navigation bar
│   └── Navbar.css
├── pages/                 # Page components
│   ├── Home.tsx           # Landing page
│   ├── Dashboard.tsx      # Main dashboard
│   ├── Companies.tsx      # Companies list
│   ├── News.tsx           # News feed
│   ├── Predict.tsx        # ESG prediction tool
│   └── Upload.tsx         # Data upload page
├── styles.css             # Global styles and design system
├── App.tsx                # Main app component with routing
└── main.tsx               # Application entry point
```

## Available Routes

- `/` - Home page with hero section and features
- `/dashboard` - Overview dashboard with ESG metrics
- `/companies` - List of all companies with ESG scores
- `/companies/:id` - Detailed ESG analysis for a specific company
- `/news` - ESG news with sentiment analysis
- `/predict` - AI-powered ESG score prediction
- `/upload` - Upload ESG data files

## API Integration

The frontend connects to the Django backend API via Vite proxy (`/api` -> `http://localhost:8000`).
All API requests should use the relative `/api` path to avoid CORS issues.

Endpoints:
- `GET /api/companies/` - List all companies
- `GET /api/companies/:id/` - Get company details
- `GET /api/news/` - List all news articles
- `GET /api/reports/:company/` - Get company report
- `POST /api/predict/` - Predict ESG score
- `POST /api/upload-zip/` - Upload data ZIP file

## Design System

The application uses a comprehensive design system with:

- **Color Palette** - Primary blues, accent cyans, and semantic colors
- **Typography** - Inter for body text, Outfit for headings
- **Spacing** - Consistent spacing scale (xs to 2xl)
- **Components** - Glassmorphism cards, premium buttons, badges
- **Animations** - Framer Motion for smooth transitions

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT
