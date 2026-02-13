import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import './Home.css';

const Home: React.FC = () => {
    const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.3 });
    const [pillarsRef, pillarsInView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true, threshold: 0.2 });

    const stats = [
        { value: 50000, suffix: '+', label: 'Data Points' },
        { value: 98.4, suffix: '%', label: 'Accuracy' },
        { value: 150, suffix: '+', label: 'Companies' },
    ];

    const pillars = [
        {
            icon: '🌍',
            title: 'Environmental',
            description: 'Cutting-edge analysis to evaluate a company\'s impact on the environment and natural resources.',
            features: ['Carbon Footprint', 'Resource Usage', 'Waste Management', 'Renewable Energy'],
        },
        {
            icon: '🤝',
            title: 'Social',
            description: 'Deep dive into workforce dynamics, diversity, and social impact to assess corporate responsibility.',
            features: ['Labor Practices', 'Diversity & Inclusion', 'Community Impact', 'Human Rights'],
        },
        {
            icon: '⚖️',
            title: 'Governance',
            description: 'Rigorous analysis of leadership, compliance, and ethical frameworks to ensure transparency.',
            features: ['Board Structure', 'Ethics & Compliance', 'Shareholder Rights', 'Risk Management'],
        },
    ];

    const aiFeatures = [
        {
            icon: '📊',
            title: 'Sentiment Analysis',
            description: 'Leverage AI to analyze news sentiment and predict market trends with unparalleled accuracy.',
        },
        {
            icon: '🔮',
            title: 'Predictive Segmentation',
            description: 'Identify patterns and segment companies based on their sustainability performance.',
        },
        {
            icon: '🎯',
            title: 'Real-time Monitoring',
            description: 'Track ESG metrics in real-time and receive instant alerts on critical changes.',
        },
        {
            icon: '🤖',
            title: 'ML-Powered Insights',
            description: 'Harness machine learning to uncover hidden insights and actionable recommendations.',
        },
    ];

    const trustedCompanies = ['GOOGLE', 'AMAZON', 'MICROSOFT', 'APPLE', 'TESLA', 'NVIDIA'];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="hero-gradient"></div>
                    <div className="hero-grid"></div>
                </div>

                <div className="container">
                    <motion.div
                        className="hero-content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            className="hero-badge"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="badge badge-success">
                                <span className="pulse-dot"></span>
                                Real-time Analysis
                            </span>
                        </motion.div>

                        <h1 className="hero-title">
                            Predicting Corporate Sustainability{' '}
                            <span className="text-gradient">with Precision.</span>
                        </h1>

                        <p className="hero-description">
                            Harness the power of advanced AI and machine learning to predict ESG performance
                            before it impacts your bottom line. Make data-driven sustainability decisions with confidence.
                        </p>

                        <div className="hero-actions">
                            <Link to="/dashboard" className="btn btn-primary btn-lg">
                                <span>Get Started</span>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
                                </svg>
                            </Link>
                            <Link to="/predict" className="btn btn-secondary btn-lg">
                                <span>View Sample Report</span>
                            </Link>
                        </div>

                        <motion.div
                            className="hero-dashboard-preview"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            <div className="dashboard-card glass-card">
                                <div className="dashboard-header">
                                    <span className="dashboard-title">ESG Dashboard</span>
                                    <div className="dashboard-indicators">
                                        <span className="indicator red"></span>
                                        <span className="indicator yellow"></span>
                                        <span className="indicator green"></span>
                                    </div>
                                </div>
                                <div className="dashboard-content">
                                    <div className="score-cards">
                                        <div className="mini-score-card">
                                            <div className="mini-score-value">85.5</div>
                                            <div className="mini-score-label">ESG Score</div>
                                            <div className="mini-score-trend positive">+5.4%</div>
                                        </div>
                                        <div className="mini-score-card">
                                            <div className="mini-score-value">78.2</div>
                                            <div className="mini-score-label">Environmental</div>
                                            <div className="mini-score-trend positive">+3.2%</div>
                                        </div>
                                        <div className="mini-score-card">
                                            <div className="mini-score-value">91.8</div>
                                            <div className="mini-score-label">Social</div>
                                            <div className="mini-score-trend positive">+7.1%</div>
                                        </div>
                                    </div>
                                    <div className="mini-chart">
                                        <svg viewBox="0 0 200 60" className="chart-svg">
                                            <defs>
                                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                            <path
                                                d="M 0 50 Q 50 40, 100 30 T 200 20"
                                                fill="none"
                                                stroke="#3b82f6"
                                                strokeWidth="2"
                                            />
                                            <path
                                                d="M 0 50 Q 50 40, 100 30 T 200 20 L 200 60 L 0 60 Z"
                                                fill="url(#chartGradient)"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section" ref={statsRef}>
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="stat-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="stat-value">
                                    {statsInView && (
                                        <CountUp
                                            end={stat.value}
                                            duration={2.5}
                                            decimals={stat.value % 1 !== 0 ? 1 : 0}
                                            suffix={stat.suffix}
                                        />
                                    )}
                                </div>
                                <div className="stat-label">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pillars Section */}
            <section className="pillars-section" ref={pillarsRef}>
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        animate={pillarsInView ? { opacity: 1, y: 0 } : {}}
                    >
                        <h2>The Three Pillars of Precision</h2>
                        <p>
                            Our platform analyzes every dimension of ESG performance to give you a complete picture
                            of corporate sustainability.
                        </p>
                    </motion.div>

                    <div className="pillars-grid">
                        {pillars.map((pillar, index) => (
                            <motion.div
                                key={index}
                                className="pillar-card glass-card"
                                initial={{ opacity: 0, y: 30 }}
                                animate={pillarsInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: index * 0.15 }}
                            >
                                <div className="pillar-icon">{pillar.icon}</div>
                                <h3>{pillar.title}</h3>
                                <p>{pillar.description}</p>
                                <ul className="pillar-features">
                                    {pillar.features.map((feature, i) => (
                                        <li key={i}>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Features Section */}
            <section className="ai-features-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>Unparalleled Intelligence Powered by AI</h2>
                        <p>
                            Cutting-edge AI capabilities that transform raw data into actionable ESG insights,
                            helping you stay ahead of the curve.
                        </p>
                    </div>

                    <div className="ai-features-grid">
                        {aiFeatures.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="ai-feature-card"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="ai-feature-icon">{feature.icon}</div>
                                <h4>{feature.title}</h4>
                                <p>{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="trusted-section">
                <div className="container">
                    <h3 className="trusted-title">Trusted by Global Institutions</h3>
                    <div className="trusted-companies">
                        {trustedCompanies.map((company, index) => (
                            <motion.div
                                key={index}
                                className="company-badge"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {company}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <motion.div
                        className="cta-card glass-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>Ready to Transform Your ESG Strategy?</h2>
                        <p>
                            Join leading organizations using ESGPulse to make smarter, data-driven sustainability decisions.
                        </p>
                        <div className="cta-actions">
                            <Link to="/dashboard" className="btn btn-primary btn-lg">
                                Get Started Now
                            </Link>
                            <Link to="/companies" className="btn btn-secondary btn-lg">
                                Explore Companies
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
