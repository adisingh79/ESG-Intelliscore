import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Companies', path: '/companies' },
        { name: 'News', path: '/news' },
        { name: 'Predict', path: '/predict' },
    ];

    return (
        <motion.nav
            className="navbar"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-brand">
                        <div className="brand-icon">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <rect width="32" height="32" rx="8" fill="url(#gradient)" />
                                <path
                                    d="M16 8L20 12L16 16L12 12L16 8Z"
                                    fill="white"
                                    opacity="0.9"
                                />
                                <path
                                    d="M16 16L20 20L16 24L12 20L16 16Z"
                                    fill="white"
                                    opacity="0.6"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                                        <stop stopColor="#2563eb" />
                                        <stop offset="1" stopColor="#7c3aed" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <span className="brand-text">
                            ESG<span className="text-gradient">Pulse</span>
                        </span>
                    </Link>

                    <div className="navbar-links">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                {item.name}
                                {location.pathname === item.path && (
                                    <motion.div
                                        className="nav-link-indicator"
                                        layoutId="navbar-indicator"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    <Link to="/upload" className="btn btn-primary btn-sm">
                        Upload Data
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
