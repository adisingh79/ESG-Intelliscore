import React, { useState } from 'react';
import { motion } from 'framer-motion';
import esgService, { PredictRequest } from '../api/esgService';
import './Predict.css';

const Predict: React.FC = () => {
    const [formData, setFormData] = useState<PredictRequest>({
        sentiment_score: 0,
        environmental_score: 50,
        social_score: 50,
        governance_score: 50,
    });
    const [prediction, setPrediction] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (field: keyof PredictRequest, value: number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setPrediction(null); // Reset prediction when inputs change
    };

    const handlePredict = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await esgService.predictESG(formData);
            setPrediction(result.predicted_esg_score);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to generate prediction');
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'var(--color-success)';
        if (score >= 60) return 'var(--color-warning)';
        return 'var(--color-error)';
    };

    const getScoreGrade = (score: number) => {
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B';
        if (score >= 60) return 'C';
        return 'D';
    };

    return (
        <div className="predict-page">
            <div className="container">
                <motion.div
                    className="page-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1>ESG Score Prediction</h1>
                    <p className="page-subtitle">
                        Use our AI-powered model to predict ESG scores based on custom inputs
                    </p>
                </motion.div>

                <div className="predict-layout">
                    <motion.div
                        className="predict-form glass-card"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h2>Input Parameters</h2>

                        <div className="form-group">
                            <label htmlFor="sentiment">
                                <span className="label-text">Sentiment Score</span>
                                <span className="label-value">{formData.sentiment_score.toFixed(2)}</span>
                            </label>
                            <input
                                id="sentiment"
                                type="range"
                                min="-1"
                                max="1"
                                step="0.01"
                                value={formData.sentiment_score}
                                onChange={(e) => handleInputChange('sentiment_score', parseFloat(e.target.value))}
                                className="slider"
                            />
                            <div className="range-labels">
                                <span>Negative (-1)</span>
                                <span>Neutral (0)</span>
                                <span>Positive (+1)</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="environmental">
                                <span className="label-text">🌍 Environmental Score</span>
                                <span className="label-value">{formData.environmental_score.toFixed(1)}</span>
                            </label>
                            <input
                                id="environmental"
                                type="range"
                                min="0"
                                max="100"
                                step="0.1"
                                value={formData.environmental_score}
                                onChange={(e) => handleInputChange('environmental_score', parseFloat(e.target.value))}
                                className="slider"
                                style={{ '--slider-color': 'var(--color-success)' } as React.CSSProperties}
                            />
                            <div className="range-labels">
                                <span>0</span>
                                <span>100</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="social">
                                <span className="label-text">🤝 Social Score</span>
                                <span className="label-value">{formData.social_score.toFixed(1)}</span>
                            </label>
                            <input
                                id="social"
                                type="range"
                                min="0"
                                max="100"
                                step="0.1"
                                value={formData.social_score}
                                onChange={(e) => handleInputChange('social_score', parseFloat(e.target.value))}
                                className="slider"
                                style={{ '--slider-color': 'var(--color-primary)' } as React.CSSProperties}
                            />
                            <div className="range-labels">
                                <span>0</span>
                                <span>100</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="governance">
                                <span className="label-text">⚖️ Governance Score</span>
                                <span className="label-value">{formData.governance_score.toFixed(1)}</span>
                            </label>
                            <input
                                id="governance"
                                type="range"
                                min="0"
                                max="100"
                                step="0.1"
                                value={formData.governance_score}
                                onChange={(e) => handleInputChange('governance_score', parseFloat(e.target.value))}
                                className="slider"
                                style={{ '--slider-color': 'var(--color-accent)' } as React.CSSProperties}
                            />
                            <div className="range-labels">
                                <span>0</span>
                                <span>100</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePredict}
                            disabled={loading}
                            className="btn btn-primary btn-lg predict-btn"
                        >
                            {loading ? (
                                <>
                                    <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                                    Predicting...
                                </>
                            ) : (
                                <>
                                    <span>Generate Prediction</span>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                                    </svg>
                                </>
                            )}
                        </button>

                        {error && (
                            <div className="error-message">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        className="predict-result glass-card"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2>Predicted ESG Score</h2>

                        {prediction !== null ? (
                            <motion.div
                                className="result-display"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                            >
                                <div
                                    className="prediction-circle"
                                    style={{ borderColor: getScoreColor(prediction) }}
                                >
                                    <div className="prediction-value" style={{ color: getScoreColor(prediction) }}>
                                        {prediction.toFixed(1)}
                                    </div>
                                    <div className="prediction-grade">{getScoreGrade(prediction)}</div>
                                </div>

                                <div className="prediction-breakdown">
                                    <h3>Input Summary</h3>
                                    <div className="breakdown-grid">
                                        <div className="breakdown-item">
                                            <span className="breakdown-label">Sentiment</span>
                                            <span className="breakdown-value">{formData.sentiment_score.toFixed(2)}</span>
                                        </div>
                                        <div className="breakdown-item">
                                            <span className="breakdown-label">Environmental</span>
                                            <span className="breakdown-value">{formData.environmental_score.toFixed(1)}</span>
                                        </div>
                                        <div className="breakdown-item">
                                            <span className="breakdown-label">Social</span>
                                            <span className="breakdown-value">{formData.social_score.toFixed(1)}</span>
                                        </div>
                                        <div className="breakdown-item">
                                            <span className="breakdown-label">Governance</span>
                                            <span className="breakdown-value">{formData.governance_score.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="prediction-info">
                                    <p>
                                        This prediction is generated using our machine learning model trained on
                                        historical ESG data. The score represents the expected overall ESG performance
                                        based on the input parameters.
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="result-placeholder">
                                <div className="placeholder-icon">🔮</div>
                                <p>Adjust the parameters and click "Generate Prediction" to see the predicted ESG score</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Predict;
