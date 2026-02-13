import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import esgService from '../api/esgService';
import './Upload.css';

const Upload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.name.endsWith('.zip')) {
                setFile(selectedFile);
                setError(null);
                setSuccess(false);
                setResult(null);
            } else {
                setError('Please select a valid ZIP file');
                setFile(null);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.name.endsWith('.zip')) {
            setFile(droppedFile);
            setError(null);
            setSuccess(false);
            setResult(null);
        } else {
            setError('Please drop a valid ZIP file');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            setUploading(true);
            setError(null);
            setProgress(0);

            const response = await esgService.uploadZip(file, (progressValue) => {
                setProgress(progressValue);
            });

            setResult(response);
            setSuccess(true);
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to upload file');
            setSuccess(false);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="upload-page">
            <div className="container">
                <motion.div
                    className="page-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1>Upload ESG Data</h1>
                    <p className="page-subtitle">
                        Upload a ZIP file containing ESG data, company reports, and news articles
                    </p>
                </motion.div>

                <div className="upload-layout">
                    <motion.div
                        className="upload-section glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div
                            className={`dropzone ${file ? 'has-file' : ''}`}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".zip"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />

                            {!file ? (
                                <>
                                    <div className="dropzone-icon">📦</div>
                                    <h3>Drop your ZIP file here</h3>
                                    <p>or click to browse</p>
                                    <span className="dropzone-hint">Maximum file size: 500 MB</span>
                                </>
                            ) : (
                                <>
                                    <div className="file-preview">
                                        <div className="file-icon">📄</div>
                                        <div className="file-info">
                                            <div className="file-name">{file.name}</div>
                                            <div className="file-size">{formatFileSize(file.size)}</div>
                                        </div>
                                        <button
                                            className="remove-file-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFile(null);
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = '';
                                                }
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {uploading && (
                            <div className="upload-progress">
                                <div className="progress-header">
                                    <span>Uploading...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="error-message">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {success && result && (
                            <motion.div
                                className="success-message"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h4>Upload Successful!</h4>
                                    <p>Your data has been processed successfully</p>
                                </div>
                            </motion.div>
                        )}

                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="btn btn-primary btn-lg upload-btn"
                        >
                            {uploading ? (
                                <>
                                    <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Upload File
                                </>
                            )}
                        </button>

                        {success && result && (
                            <div className="upload-results">
                                <h3>Processing Results</h3>
                                <div className="results-grid">
                                    {result.companies_created !== undefined && (
                                        <div className="result-item">
                                            <div className="result-icon">🏢</div>
                                            <div className="result-value">{result.companies_created}</div>
                                            <div className="result-label">Companies Created</div>
                                        </div>
                                    )}
                                    {result.news_created !== undefined && (
                                        <div className="result-item">
                                            <div className="result-icon">📰</div>
                                            <div className="result-value">{result.news_created}</div>
                                            <div className="result-label">News Articles</div>
                                        </div>
                                    )}
                                    {result.reports_created !== undefined && (
                                        <div className="result-item">
                                            <div className="result-icon">📊</div>
                                            <div className="result-value">{result.reports_created}</div>
                                            <div className="result-label">Reports Generated</div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="btn btn-secondary btn-lg"
                                >
                                    View Dashboard
                                </button>
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        className="upload-info glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2>Upload Requirements</h2>

                        <div className="info-section">
                            <h3>📋 File Format</h3>
                            <p>Upload a ZIP archive containing your ESG data files in the supported formats.</p>
                        </div>

                        <div className="info-section">
                            <h3>📊 Expected Data</h3>
                            <ul>
                                <li>Company ESG scores (CSV/JSON)</li>
                                <li>Environmental, Social, Governance metrics</li>
                                <li>News articles with sentiment data</li>
                                <li>Company reports and documentation</li>
                            </ul>
                        </div>

                        <div className="info-section">
                            <h3>⚡ Processing</h3>
                            <p>
                                Once uploaded, our system will automatically:
                            </p>
                            <ul>
                                <li>Extract and validate all data files</li>
                                <li>Process ESG scores and metrics</li>
                                <li>Analyze news sentiment</li>
                                <li>Generate comprehensive reports</li>
                            </ul>
                        </div>

                        <div className="info-section">
                            <h3>🔒 Security</h3>
                            <p>
                                All uploaded data is encrypted and securely stored. We follow industry best
                                practices to protect your sensitive information.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Upload;
