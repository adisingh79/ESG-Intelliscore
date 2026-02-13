import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import esgService, { CompanyESG } from '../api/esgService';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const [companies, setCompanies] = useState<CompanyESG[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const data = await esgService.getCompanies();
            setCompanies(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const calculateAverages = () => {
        if (companies.length === 0) return { esg: 0, env: 0, social: 0, gov: 0 };

        const totals = companies.reduce(
            (acc, company) => ({
                esg: acc.esg + company.esg_score,
                env: acc.env + company.environmental_score,
                social: acc.social + company.social_score,
                gov: acc.gov + company.governance_score,
            }),
            { esg: 0, env: 0, social: 0, gov: 0 }
        );

        return {
            esg: totals.esg / companies.length,
            env: totals.env / companies.length,
            social: totals.social / companies.length,
            gov: totals.gov / companies.length,
        };
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'success';
        if (score >= 60) return 'warning';
        return 'error';
    };

    const getScoreGrade = (score: number) => {
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B';
        if (score >= 60) return 'C';
        return 'D';
    };

    const averages = calculateAverages();
    const topCompanies = [...companies].sort((a, b) => b.esg_score - a.esg_score).slice(0, 5);

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading dashboard data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <div className="container">
                    <div className="error-container">
                        <h2>Error Loading Dashboard</h2>
                        <p>{error}</p>
                        <button onClick={loadDashboardData} className="btn btn-primary">
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <motion.div
                    className="dashboard-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <h1>ESG Dashboard</h1>
                        <p className="dashboard-subtitle">
                            Real-time insights into corporate sustainability performance
                        </p>
                    </div>
                    <Link to="/upload" className="btn btn-primary">
                        Upload New Data
                    </Link>
                </motion.div>

                {/* Overview Cards */}
                <div className="overview-grid">
                    <motion.div
                        className="overview-card glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="overview-header">
                            <span className="overview-label">Average ESG Score</span>
                            <span className={`badge badge-${getScoreColor(averages.esg)}`}>
                                {getScoreGrade(averages.esg)}
                            </span>
                        </div>
                        <div className="overview-value">{averages.esg.toFixed(1)}</div>
                        <div className="overview-footer">
                            <span className="overview-companies">{companies.length} companies tracked</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="overview-card glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="overview-header">
                            <span className="overview-label">Environmental</span>
                            <span className="overview-icon">🌍</span>
                        </div>
                        <div className="overview-value">{averages.env.toFixed(1)}</div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${averages.env}%`, background: 'var(--color-success)' }}
                            ></div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="overview-card glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="overview-header">
                            <span className="overview-label">Social</span>
                            <span className="overview-icon">🤝</span>
                        </div>
                        <div className="overview-value">{averages.social.toFixed(1)}</div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${averages.social}%`, background: 'var(--color-primary)' }}
                            ></div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="overview-card glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="overview-header">
                            <span className="overview-label">Governance</span>
                            <span className="overview-icon">⚖️</span>
                        </div>
                        <div className="overview-value">{averages.gov.toFixed(1)}</div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${averages.gov}%`, background: 'var(--color-accent)' }}
                            ></div>
                        </div>
                    </motion.div>
                </div>

                {/* Top Performers */}
                <motion.div
                    className="top-performers-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2>Top Performers</h2>
                    <div className="top-performers-grid">
                        {topCompanies.map((company, index) => (
                            <Link
                                key={company.id}
                                to={`/companies/${company.id}`}
                                className="performer-card glass-card"
                            >
                                <div className="performer-rank">#{index + 1}</div>
                                <div className="performer-info">
                                    <h3>{company.company}</h3>
                                    <div className="performer-scores">
                                        <div className="score-pill">
                                            <span className="score-pill-label">ESG</span>
                                            <span className="score-pill-value">{company.esg_score.toFixed(1)}</span>
                                        </div>
                                        <div className="score-pill">
                                            <span className="score-pill-label">E</span>
                                            <span className="score-pill-value">{company.environmental_score.toFixed(1)}</span>
                                        </div>
                                        <div className="score-pill">
                                            <span className="score-pill-label">S</span>
                                            <span className="score-pill-value">{company.social_score.toFixed(1)}</span>
                                        </div>
                                        <div className="score-pill">
                                            <span className="score-pill-label">G</span>
                                            <span className="score-pill-value">{company.governance_score.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`performer-badge badge-${getScoreColor(company.esg_score)}`}>
                                    {getScoreGrade(company.esg_score)}
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    className="quick-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Link to="/companies" className="action-card glass-card">
                        <div className="action-icon">📊</div>
                        <h3>View All Companies</h3>
                        <p>Explore detailed ESG scores for all tracked companies</p>
                    </Link>
                    <Link to="/news" className="action-card glass-card">
                        <div className="action-icon">📰</div>
                        <h3>ESG News</h3>
                        <p>Stay updated with latest sustainability news and sentiment</p>
                    </Link>
                    <Link to="/predict" className="action-card glass-card">
                        <div className="action-icon">🔮</div>
                        <h3>Predict Score</h3>
                        <p>Use AI to predict ESG scores based on custom inputs</p>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
