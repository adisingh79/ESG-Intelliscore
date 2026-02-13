import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import esgService, { ESGNews } from '../api/esgService';
import './News.css';

const News: React.FC = () => {
    const [news, setNews] = useState<ESGNews[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            setLoading(true);
            const data = await esgService.getNews();
            setNews(data);
        } catch (err) {
            console.error('Failed to load news:', err);
        } finally {
            setLoading(false);
        }
    };

    const getSentimentLabel = (score: number) => {
        if (score > 0.3) return 'positive';
        if (score < -0.3) return 'negative';
        return 'neutral';
    };

    const getSentimentColor = (score: number) => {
        if (score > 0.3) return 'var(--color-success)';
        if (score < -0.3) return 'var(--color-error)';
        return 'var(--color-warning)';
    };

    const filteredNews = news.filter((item) => {
        if (filter === 'all') return true;
        return getSentimentLabel(item.sentiment_score) === filter;
    });

    if (loading) {
        return (
            <div className="news-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading news...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="news-page">
            <div className="container">
                <motion.div
                    className="page-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <h1>ESG News & Sentiment</h1>
                        <p className="page-subtitle">
                            Real-time sentiment analysis of {news.length} ESG-related news articles
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="news-filters"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All News
                    </button>
                    <button
                        className={`filter-btn ${filter === 'positive' ? 'active' : ''}`}
                        onClick={() => setFilter('positive')}
                    >
                        <span className="sentiment-dot positive"></span>
                        Positive
                    </button>
                    <button
                        className={`filter-btn ${filter === 'neutral' ? 'active' : ''}`}
                        onClick={() => setFilter('neutral')}
                    >
                        <span className="sentiment-dot neutral"></span>
                        Neutral
                    </button>
                    <button
                        className={`filter-btn ${filter === 'negative' ? 'active' : ''}`}
                        onClick={() => setFilter('negative')}
                    >
                        <span className="sentiment-dot negative"></span>
                        Negative
                    </button>
                </motion.div>

                <motion.div
                    className="news-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {filteredNews.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className="news-card glass-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="news-header">
                                <span className="news-label">{item.sentiment_label || 'News'}</span>
                                <div
                                    className="sentiment-badge"
                                    style={{ background: getSentimentColor(item.sentiment_score) }}
                                >
                                    {(item.sentiment_score * 100).toFixed(0)}%
                                </div>
                            </div>

                            <h3 className="news-headline">{item.title}</h3>
                            <p className="news-summary">{item.summary}</p>

                            <div className="news-footer">
                                <span className="news-date">
                                    {new Date(item.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>

                            <div className="sentiment-bar">
                                <div
                                    className="sentiment-bar-fill"
                                    style={{
                                        width: `${Math.abs(item.sentiment_score) * 100}%`,
                                        background: getSentimentColor(item.sentiment_score),
                                    }}
                                ></div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {filteredNews.length === 0 && (
                    <div className="no-results">
                        <p>No {filter !== 'all' ? filter : ''} news found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default News;
