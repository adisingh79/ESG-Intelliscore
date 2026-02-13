# ESG IntelliScore 📈

ESG IntelliScore is a premium, AI-powered platform for Environmental, Social, and Governance (ESG) analytics. It provides a comprehensive suite of tools for monitoring company performance, predicting ESG scores using machine learning, and analyzing sentiment in ESG-related news.

## ✨ Features

- **Dynamic Dashboard**: Real-time overview of ESG metrics and top-performing companies.
- **AI-Powered Predictions**: Interactive tool for predicting ESG scores based on key parameters.
- **Sentiment Analysis**: News feed with AI-driven sentiment classification (Positive/Negative/Neutral).
- **Company Insights**: Detailed breakdown of ESG scores for individual companies with visual progress indicators.
- **Data Ingestion**: Smooth drag-and-drop file upload for processing ESG data.
- **Premium Design**: Modern, responsive UI with glassmorphism, smooth animations, and a polished aesthetic.

## 🛠️ Tech Stack

### Backend
- **Framework**: Django & Django REST Framework
- **Data Processing**: Pandas, NumPy
- **Machine Learning**: Scikit-learn
- **Database**: SQLite (Development) / PostgreSQL (Production ready)
- **API**: RESTful architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with modern design patterns
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons & UI**: Material UI

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup
1. Navigate to the root directory.
2. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/scripts/activate  # On Windows: .venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the `esg-frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📋 Available API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/companies/` | GET | List all companies with ESG scores |
| `/api/news/` | GET | Fetch ESG news with sentiment analysis |
| `/api/predict/` | POST | Predict ESG score based on inputs |
| `/api/upload/` | POST | Upload ESG data files |

## 🎨 Design Principles
- **Clarity**: High contrast and clear typography for data visualization.
- **Feedback**: Immediate visual feedback for user interactions and loading states.
- **Premium Aesthetic**: Subtle use of gradients, glassmorphism, and micro-animations.

## 📄 License
MIT

---
Built with ❤️ by the ESG IntelliScore Team
