import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import esgService, { CompanyESG } from '../api/esgService';
import './CompanyDetail.css';

const CompanyDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [company, setCompany] = useState<CompanyESG | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadCompany(parseInt(id));
        }
    }, [id]);

    const loadCompany = async (companyId: number) => {
        try {
            setLoading(true);
            const data = await esgService.getCompanyDetail(companyId);
            setCompany(data);
        } catch (err) {
            console.error('Failed to load company:', err);
            setError('Failed to load company details.');
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'success';
        if (score >= 60) return 'warning';
        return 'error';
    };

    if (loading) {
        return (
            <div className="company-detail-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading company details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="company-detail-page">
                <div className="container">
                    <div className="error-container">
                        <h2>Error</h2>
                        <p>{error || 'Company not found'}</p>
                        <Link to="/companies" className="btn btn-primary">
                            Back to Companies
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const chartData = [
        { name: 'Environmental', score: company.environmental_score, color: '#10b981' },
        { name: 'Social', score: company.social_score, color: '#3b82f6' },
        { name: 'Governance', score: company.governance_score, color: '#06b6d4' },
    ];

    return (
        <div className="company-detail-page">
            <div className="container">
                <div className="back-link-container">
                    <div className="back-link">
                        <Link to="/companies" className="btn btn-secondary">
                            ← Back to Companies
                        </Link>
                    </div>
                </div>

                <motion.div
                    className="company-header-card glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="company-title-section">
                        <h1>{company.company}</h1>
                        <div className={`score-badge badge-${getScoreColor(company.esg_score)}`}>
                            ESG Score: {company.esg_score.toFixed(1)}
                        </div>
                    </div>
                    <div className="company-meta">
                        <span>ID: {company.id}</span>
                        <span>Last Updated: {new Date(company.created_at).toLocaleDateString()}</span>
                    </div>
                </motion.div>

                <div className="detail-grid">
                    <motion.div
                        className="score-breakdown-card glass-card"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h2>Score Breakdown</h2>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis type="number" domain={[0, 100]} stroke="rgba(255,255,255,0.5)" />
                                    <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.8)" width={100} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', borderColor: 'rgba(255,255,255,0.1)' }}
                                        itemStyle={{ color: '#fff' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        className="metrics-card glass-card"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2>Detailed Metrics</h2>
                        <div className="metrics-list">
                            <div className="metric-item">
                                <div className="metric-header">
                                    <span className="metric-label">Environmental</span>
                                    <span className="metric-value">{company.environmental_score.toFixed(1)}</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${company.environmental_score}%`, background: 'var(--color-success)' }}
                                    ></div>
                                </div>
                            </div>

                            <div className="metric-item">
                                <div className="metric-header">
                                    <span className="metric-label">Social</span>
                                    <span className="metric-value">{company.social_score.toFixed(1)}</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${company.social_score}%`, background: 'var(--color-primary)' }}
                                    ></div>
                                </div>
                            </div>

                            <div className="metric-item">
                                <div className="metric-header">
                                    <span className="metric-label">Governance</span>
                                    <span className="metric-value">{company.governance_score.toFixed(1)}</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${company.governance_score}%`, background: 'var(--color-accent)' }}
                                    ></div>
                                </div>
                            </div>

                            <div className="metric-item">
                                <div className="metric-header">
                                    <span className="metric-label">Sentiment Analysis</span>
                                    <span className="metric-value">{company.sentiment_score ? company.sentiment_score.toFixed(2) : 'N/A'}</span>
                                </div>
                                {company.sentiment_score !== undefined && (
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${((company.sentiment_score + 1) / 2) * 100}%`, // Normalize -1 to 1 range to 0-100%
                                                background: 'var(--gradient-primary)'
                                            }}
                                        ></div>
                                    </div>
                                )}
                                <div className="metric-sublabel">
                                    Range: -1.0 (Negative) to +1.0 (Positive)
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetail;
