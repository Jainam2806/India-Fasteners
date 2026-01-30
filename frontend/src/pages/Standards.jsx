import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink } from 'lucide-react';
import { Card } from '../components/common';
import { standardsAPI } from '../services/api';
import './Standards.css';

function Standards() {
    const [standards, setStandards] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStandards() {
            try {
                const data = await standardsAPI.getAll();
                setStandards(data);
            } catch (err) {
                console.error('Failed to load standards:', err);
            } finally {
                setLoading(false);
            }
        }
        loadStandards();
    }, []);

    const filteredStandards = activeTab === 'all'
        ? standards
        : standards.filter(s => s.type === activeTab);

    const tabs = [
        { id: 'all', label: 'All Standards' },
        { id: 'DIN', label: 'DIN (German)' },
        { id: 'ISO', label: 'ISO (International)' },
        { id: 'IS', label: 'IS (Indian)' },
    ];

    // Group standards by fastener type
    const groupedStandards = filteredStandards.reduce((acc, std) => {
        const type = std.fastener_type;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(std);
        return acc;
    }, {});

    const fastenerTypeLabels = {
        'hex_bolt': 'Hex Bolts',
        'socket_head_cap_screw': 'Socket Head Cap Screws',
        'hex_nut': 'Hex Nuts',
        'plain_washer': 'Plain Washers',
        'spring_washer': 'Spring Washers',
    };

    return (
        <div className="standards-page">
            <div className="container">
                {/* Page Header */}
                <motion.div
                    className="page-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="page-icon">
                        <BookOpen size={32} />
                    </div>
                    <div>
                        <h1 className="page-title">Standards Reference</h1>
                        <p className="page-subtitle">
                            DIN, ISO, and Indian Standards for fasteners
                        </p>
                    </div>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    className="standards-tabs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </motion.div>

                {/* Standards Content */}
                {loading ? (
                    <div className="loading-grid">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="skeleton" style={{ height: 200 }} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        className="standards-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {Object.keys(groupedStandards).length === 0 ? (
                            <div className="no-results">
                                <p>No standards found for this filter.</p>
                            </div>
                        ) : (
                            Object.entries(groupedStandards).map(([type, stds]) => (
                                <div key={type} className="standards-group">
                                    <h3 className="group-title">
                                        {fastenerTypeLabels[type] || type.replace('_', ' ')}
                                    </h3>
                                    <div className="standards-grid">
                                        {stds.map((std, index) => (
                                            <motion.div
                                                key={`${std.code}-${index}`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <Card hover className="standard-card">
                                                    <div className="standard-header">
                                                        <span className={`standard-type type-${std.type.toLowerCase()}`}>
                                                            {std.type}
                                                        </span>
                                                        <span className="standard-code">{std.code}</span>
                                                    </div>
                                                    <p className="standard-description">{std.description}</p>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                )}

                {/* Reference Links */}
                <motion.div
                    className="reference-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="section-title">External Resources</h2>
                    <div className="reference-grid">
                        <Card className="reference-card">
                            <h4>DIN Standards</h4>
                            <p>German Institute for Standardization - Deutsches Institut für Normung</p>
                            <a href="https://www.din.de" target="_blank" rel="noopener noreferrer" className="reference-link">
                                Visit DIN <ExternalLink size={14} />
                            </a>
                        </Card>
                        <Card className="reference-card">
                            <h4>ISO Standards</h4>
                            <p>International Organization for Standardization</p>
                            <a href="https://www.iso.org" target="_blank" rel="noopener noreferrer" className="reference-link">
                                Visit ISO <ExternalLink size={14} />
                            </a>
                        </Card>
                        <Card className="reference-card">
                            <h4>BIS (Indian Standards)</h4>
                            <p>Bureau of Indian Standards - National standards body of India</p>
                            <a href="https://www.bis.gov.in" target="_blank" rel="noopener noreferrer" className="reference-link">
                                Visit BIS <ExternalLink size={14} />
                            </a>
                        </Card>
                    </div>
                </motion.div>

                {/* Standards Comparison Table */}
                <motion.div
                    className="comparison-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="section-title">Common Standard Equivalents</h2>
                    <Card>
                        <div className="table-wrapper">
                            <table className="comparison-table">
                                <thead>
                                    <tr>
                                        <th>Fastener Type</th>
                                        <th>DIN</th>
                                        <th>ISO</th>
                                        <th>IS (Indian)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Hex Bolt (Partial Thread)</td>
                                        <td className="mono">DIN 931</td>
                                        <td className="mono">ISO 4014</td>
                                        <td className="mono">IS 1363-1</td>
                                    </tr>
                                    <tr>
                                        <td>Hex Bolt (Full Thread)</td>
                                        <td className="mono">DIN 933</td>
                                        <td className="mono">ISO 4017</td>
                                        <td className="mono">IS 1364-1</td>
                                    </tr>
                                    <tr>
                                        <td>Socket Head Cap Screw</td>
                                        <td className="mono">DIN 912</td>
                                        <td className="mono">ISO 4762</td>
                                        <td className="mono">IS 2269</td>
                                    </tr>
                                    <tr>
                                        <td>Hex Nut</td>
                                        <td className="mono">DIN 934</td>
                                        <td className="mono">ISO 4032</td>
                                        <td className="mono">IS 1364-3</td>
                                    </tr>
                                    <tr>
                                        <td>Plain Washer</td>
                                        <td className="mono">DIN 125</td>
                                        <td className="mono">ISO 7089</td>
                                        <td className="mono">IS 2016</td>
                                    </tr>
                                    <tr>
                                        <td>Spring Washer</td>
                                        <td className="mono">DIN 127</td>
                                        <td className="mono">-</td>
                                        <td className="mono">IS 6735</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

export default Standards;
