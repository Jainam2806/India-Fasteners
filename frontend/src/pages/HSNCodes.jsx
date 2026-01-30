import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale, Search, Info, Percent } from 'lucide-react';
import { Card, Input } from '../components/common';
import { hsnAPI, gstAPI } from '../services/api';
import './HSNCodes.css';

function HSNCodes() {
    const [hsnCodes, setHsnCodes] = useState([]);
    const [gstInfo, setGstInfo] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCodes, setFilteredCodes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load data
    useEffect(() => {
        async function loadData() {
            try {
                const [codes, info] = await Promise.all([
                    hsnAPI.getAll(),
                    gstAPI.getRates()
                ]);
                setHsnCodes(codes);
                setFilteredCodes(codes);
                setGstInfo(info);
            } catch (err) {
                console.error('Failed to load HSN data:', err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Filter codes on search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredCodes(hsnCodes);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = hsnCodes.filter(
            hsn => hsn.code.toLowerCase().includes(query) ||
                hsn.description.toLowerCase().includes(query)
        );
        setFilteredCodes(filtered);
    }, [searchQuery, hsnCodes]);

    return (
        <div className="hsn-page">
            <div className="container">
                {/* Page Header */}
                <motion.div
                    className="page-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="page-icon">
                        <Scale size={32} />
                    </div>
                    <div>
                        <h1 className="page-title">HSN Codes & GST</h1>
                        <p className="page-subtitle">
                            Search HSN codes and GST rates for fasteners
                        </p>
                    </div>
                </motion.div>

                {/* GST Info Banner */}
                {gstInfo && (
                    <motion.div
                        className="gst-banner"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="gst-rate-display">
                            <Percent size={24} />
                            <div>
                                <span className="gst-rate">{gstInfo.current_rate}%</span>
                                <span className="gst-label">Standard GST Rate</span>
                            </div>
                        </div>
                        <p className="gst-note">{gstInfo.note}</p>
                    </motion.div>
                )}

                {/* Search */}
                <motion.div
                    className="search-section"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="search-wrapper">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by HSN code or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <span className="result-count">
                        {filteredCodes.length} code{filteredCodes.length !== 1 ? 's' : ''} found
                    </span>
                </motion.div>

                {/* HSN Codes Grid */}
                {loading ? (
                    <div className="loading-grid">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="skeleton" style={{ height: 150 }} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        className="hsn-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {filteredCodes.map((hsn, index) => (
                            <motion.div
                                key={hsn.code}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * Math.min(index, 10) }}
                            >
                                <Card hover className="hsn-card">
                                    <div className="hsn-code-badge">{hsn.code}</div>
                                    <p className="hsn-description">{hsn.description}</p>
                                    <div className="hsn-footer">
                                        <span className={`material-tag ${hsn.material_type}`}>
                                            {hsn.material_type?.replace('_', ' ')}
                                        </span>
                                        <span className="gst-badge">{hsn.gst_rate}% GST</span>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Material Categories */}
                {gstInfo?.categories && (
                    <motion.div
                        className="categories-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="section-title">GST Rates by Material Category</h2>
                        <div className="categories-grid">
                            {Object.entries(gstInfo.categories).map(([key, cat]) => (
                                <Card key={key} className="category-card">
                                    <h4>{cat.name}</h4>
                                    <div className="category-info">
                                        <span className="hsn-main">HSN {cat.main_hsn}</span>
                                        <span className="rate-main">{cat.rate}%</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Info Section */}
                <motion.div
                    className="info-section"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card padding="sm" className="info-card">
                        <Info size={20} />
                        <div>
                            <h4>About HSN Codes</h4>
                            <p>
                                HSN (Harmonized System of Nomenclature) codes are used to classify goods
                                for taxation purposes under GST. The main HSN code for iron and steel
                                fasteners is 7318, which covers screws, bolts, nuts, washers, and similar
                                articles.
                            </p>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

export default HSNCodes;
