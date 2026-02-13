import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import News from './pages/News';
import Predict from './pages/Predict';
import Upload from './pages/Upload';
import './styles.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
