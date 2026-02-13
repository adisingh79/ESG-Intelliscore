import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import esgService, { CompanyESG } from '../api/esgService';
import './Companies.css';

const Companies: React.FC = () => {
    const [companies, setCompanies] = useState<CompanyESG[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'esg' | 'env' | 'social' | 'gov'>('esg');

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        try {
            setLoading(true);
            const data = await esgService.getCompanies();
            setCompanies(data);
        } catch (err) {
            console.error('Failed to load companies:', err);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'success';
        if (score >= 60) return 'warning';
        return 'error';
    };

    const filteredAndSortedCompanies = companies
        .filter((company) =>
            company.company.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.company.localeCompare(b.company);
                case 'esg':
                    return b.esg_score - a.esg_score;
                case 'env':
                    return b.environmental_score - a.environmental_score;
                case 'social':
                    return b.social_score - a.social_score;
                case 'gov':
                    return b.governance_score - a.governance_score;
                default:
                    return 0;
            }
        });

    if (loading) {
        return (
            <div className="companies-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading companies...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="companies-page">
            <div className="container">
                <motion.div
                    className="page-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <h1>Companies</h1>
                        <p className="page-subtitle">
                            Comprehensive ESG scores for {companies.length} tracked companies
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="filters-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="search-box">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search companies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="sort-buttons">
                        <button
                            className={`sort-btn ${sortBy === 'esg' ? 'active' : ''}`}
                            onClick={() => setSortBy('esg')}
                        >
                            ESG Score
                        </button>
                        <button
                            className={`sort-btn ${sortBy === 'env' ? 'active' : ''}`}
                            onClick={() => setSortBy('env')}
                        >
                            Environmental
                        </button>
                        <button
                            className={`sort-btn ${sortBy === 'social' ? 'active' : ''}`}
                            onClick={() => setSortBy('social')}
                        >
                            Social
                        </button>
                        <button
                            className={`sort-btn ${sortBy === 'gov' ? 'active' : ''}`}
                            onClick={() => setSortBy('gov')}
                        >
                            Governance
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    className="companies-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {filteredAndSortedCompanies.map((company, index) => (
                        <motion.div
                            key={company.id}
                            className="company-card glass-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="company-header">
                                <h3>{company.company}</h3>
                                <span className={`score-badge badge-${getScoreColor(company.esg_score)}`}>
                                    {company.esg_score.toFixed(1)}
                                </span>
                            </div>

                            <div className="company-scores">
                                <div className="score-item">
                                    <div className="score-item-header">
                                        <span className="score-item-label">🌍 Environmental</span>
                                        <span className="score-item-value">{company.environmental_score.toFixed(1)}</span>
                                    </div>
                                    <div className="score-bar">
                                        <div
                                            className="score-bar-fill"
                                            style={{
                                                width: `${company.environmental_score}%`,
                                                background: 'var(--color-success)',
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="score-item">
                                    <div className="score-item-header">
                                        <span className="score-item-label">🤝 Social</span>
                                        <span className="score-item-value">{company.social_score.toFixed(1)}</span>
                                    </div>
                                    <div className="score-bar">
                                        <div
                                            className="score-bar-fill"
                                            style={{
                                                width: `${company.social_score}%`,
                                                background: 'var(--color-primary)',
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="score-item">
                                    <div className="score-item-header">
                                        <span className="score-item-label">⚖️ Governance</span>
                                        <span className="score-item-value">{company.governance_score.toFixed(1)}</span>
                                    </div>
                                    <div className="score-bar">
                                        <div
                                            className="score-bar-fill"
                                            style={{
                                                width: `${company.governance_score}%`,
                                                background: 'var(--color-accent)',
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="company-footer">
                                <span className="company-date">
                                    Updated {new Date(company.created_at).toLocaleDateString()}
                                </span>
                                <Link to={`/companies/${company.id}`} className="view-details-btn">
                                    View Details →
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {filteredAndSortedCompanies.length === 0 && (
                    <div className="no-results">
                        <p>No companies found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Companies;
