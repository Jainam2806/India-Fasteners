import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Info } from 'lucide-react';
import { Card, Select } from '../components/common';
import { fastenerTypesAPI, calculatorAPI, dimensionsAPI } from '../services/api';
import './Diagrams.css';

// SVG Diagram Components
const HexBoltDiagram = ({ dimensions }) => (
    <svg viewBox="0 0 400 300" className="fastener-diagram">
        {/* Bolt Head - Hexagon */}
        <motion.polygon
            points="100,40 150,20 200,40 200,80 150,100 100,80"
            fill="var(--primary-100)"
            stroke="var(--primary-500)"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        />
        {/* Head top surface */}
        <motion.polygon
            points="100,40 150,20 200,40 150,60"
            fill="var(--primary-200)"
            stroke="var(--primary-500)"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
        />
        {/* Shank */}
        <motion.rect
            x="125"
            y="100"
            width="50"
            height="150"
            fill="var(--gray-100)"
            stroke="var(--primary-500)"
            strokeWidth="2"
            rx="2"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{ transformOrigin: '150px 100px' }}
        />
        {/* Thread lines */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.line
                key={i}
                x1="122"
                y1={160 + i * 12}
                x2="178"
                y2={160 + i * 12}
                stroke="var(--gray-400)"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
            />
        ))}
        {/* Dimension lines */}
        {/* Across flats (s) */}
        <line x1="95" y1="60" x2="205" y2="60" stroke="var(--secondary-400)" strokeWidth="1" strokeDasharray="4" />
        <line x1="95" y1="55" x2="95" y2="65" stroke="var(--secondary-400)" strokeWidth="2" />
        <line x1="205" y1="55" x2="205" y2="65" stroke="var(--secondary-400)" strokeWidth="2" />
        <text x="150" y="52" textAnchor="middle" className="dim-label">s = {dimensions?.head_across_flats || dimensions?.across_flats || '?'}mm</text>
        {/* Head height (k) */}
        <line x1="220" y1="40" x2="220" y2="100" stroke="var(--secondary-400)" strokeWidth="1" strokeDasharray="4" />
        <line x1="215" y1="40" x2="225" y2="40" stroke="var(--secondary-400)" strokeWidth="2" />
        <line x1="215" y1="100" x2="225" y2="100" stroke="var(--secondary-400)" strokeWidth="2" />
        <text x="240" y="75" className="dim-label">k = {dimensions?.head_height || dimensions?.height || '?'}mm</text>
        {/* Diameter (d) */}
        <line x1="122" y1="270" x2="178" y2="270" stroke="var(--secondary-400)" strokeWidth="1" strokeDasharray="4" />
        <line x1="122" y1="265" x2="122" y2="275" stroke="var(--secondary-400)" strokeWidth="2" />
        <line x1="178" y1="265" x2="178" y2="275" stroke="var(--secondary-400)" strokeWidth="2" />
        <text x="150" y="290" textAnchor="middle" className="dim-label">d = {dimensions?.diameter || '?'}</text>
    </svg>
);

const HexNutDiagram = ({ dimensions }) => (
    <svg viewBox="0 0 400 250" className="fastener-diagram">
        {/* Nut body - Hexagon */}
        <motion.polygon
            points="100,50 180,20 260,50 260,130 180,160 100,130"
            fill="var(--primary-100)"
            stroke="var(--primary-500)"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        />
        {/* Top face */}
        <motion.polygon
            points="100,50 180,20 260,50 180,80"
            fill="var(--primary-200)"
            stroke="var(--primary-500)"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
        />
        {/* Thread hole */}
        <motion.ellipse
            cx="180"
            cy="90"
            rx="30"
            ry="15"
            fill="var(--gray-300)"
            stroke="var(--primary-600)"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
        />
        {/* Dimension lines */}
        <line x1="90" y1="90" x2="270" y2="90" stroke="var(--secondary-400)" strokeWidth="1" strokeDasharray="4" />
        <line x1="90" y1="85" x2="90" y2="95" stroke="var(--secondary-400)" strokeWidth="2" />
        <line x1="270" y1="85" x2="270" y2="95" stroke="var(--secondary-400)" strokeWidth="2" />
        <text x="180" y="200" textAnchor="middle" className="dim-label">s = {dimensions?.across_flats || '?'}mm</text>
        {/* Height */}
        <line x1="280" y1="50" x2="280" y2="130" stroke="var(--secondary-400)" strokeWidth="1" strokeDasharray="4" />
        <line x1="275" y1="50" x2="285" y2="50" stroke="var(--secondary-400)" strokeWidth="2" />
        <line x1="275" y1="130" x2="285" y2="130" stroke="var(--secondary-400)" strokeWidth="2" />
        <text x="300" y="95" className="dim-label">m = {dimensions?.height || '?'}mm</text>
    </svg>
);

const PlainWasherDiagram = ({ dimensions }) => (
    <svg viewBox="0 0 400 250" className="fastener-diagram">
        {/* Outer circle */}
        <motion.ellipse
            cx="200"
            cy="100"
            rx="100"
            ry="40"
            fill="var(--primary-100)"
            stroke="var(--primary-500)"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
        />
        {/* Inner circle (hole) */}
        <motion.ellipse
            cx="200"
            cy="100"
            rx="40"
            ry="16"
            fill="var(--bg-secondary)"
            stroke="var(--primary-600)"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
        />
        {/* Side view */}
        <motion.rect
            x="100"
            y="160"
            width="200"
            height="20"
            fill="var(--primary-100)"
            stroke="var(--primary-500)"
            strokeWidth="2"
            rx="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
        />
        {/* Hole in side view */}
        <rect x="160" y="160" width="80" height="20" fill="var(--bg-secondary)" stroke="var(--primary-500)" strokeWidth="2" />
        {/* Dimensions */}
        <text x="200" y="220" textAnchor="middle" className="dim-label">
            d1 = {dimensions?.inner_diameter || '?'}mm | d2 = {dimensions?.outer_diameter || '?'}mm | h = {dimensions?.thickness || '?'}mm
        </text>
    </svg>
);

function Diagrams() {
    const [fastenerTypes, setFastenerTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('hex_bolt');
    const [selectedDiameter, setSelectedDiameter] = useState('M10');
    const [diameters, setDiameters] = useState([]);
    const [diagramData, setDiagramData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load fastener types
    useEffect(() => {
        async function loadTypes() {
            try {
                const types = await fastenerTypesAPI.getAll();
                setFastenerTypes(types.filter(t => t.diagram_available));
            } catch (err) {
                console.error('Failed to load fastener types:', err);
            }
        }
        loadTypes();
    }, []);

    // Load diameters when type changes
    useEffect(() => {
        async function loadDiameters() {
            if (!selectedType) return;

            try {
                // Map fastener types to their base dimension types
                // Many types share the same dimension data
                const typeMap = {
                    // Bolts - use hex_bolt dimensions
                    'hex_bolt_full_thread': 'hex_bolt',
                    'carriage_bolt': 'hex_bolt',
                    'stud_bolt': 'hex_bolt',
                    'flange_bolt': 'hex_bolt',
                    'eye_bolt': 'hex_bolt',
                    'anchor_bolt': 'hex_bolt',
                    // Nuts - use hex_nut dimensions
                    'lock_nut': 'hex_nut',
                    'flange_nut': 'hex_nut',
                    'wing_nut': 'hex_nut',
                    'castle_nut': 'hex_nut',
                    'thin_hex_nut': 'hex_nut',
                    // Washers - use plain_washer dimensions
                    'heavy_duty_washer': 'plain_washer',
                    // Screws - use socket_head_cap_screw dimensions
                    'machine_screw': 'socket_head_cap_screw',
                    'self_tapping_screw': 'socket_head_cap_screw',
                    'wood_screw': 'socket_head_cap_screw',
                    'set_screw': 'socket_head_cap_screw',
                };
                const baseType = typeMap[selectedType] || selectedType;
                const dims = await dimensionsAPI.getDiameters(baseType);

                // If no dimensions returned, use common diameters
                if (!dims || dims.length === 0) {
                    const defaultDiameters = ['M3', 'M4', 'M5', 'M6', 'M8', 'M10', 'M12', 'M14', 'M16', 'M20'];
                    setDiameters(defaultDiameters);
                    if (!defaultDiameters.includes(selectedDiameter)) {
                        setSelectedDiameter('M10');
                    }
                } else {
                    setDiameters(dims);
                    if (!dims.includes(selectedDiameter)) {
                        setSelectedDiameter(dims[0]);
                    }
                }
            } catch (err) {
                console.error('Failed to load diameters:', err);
                // Fallback to common diameters
                const fallbackDiameters = ['M3', 'M4', 'M5', 'M6', 'M8', 'M10', 'M12', 'M14', 'M16', 'M20'];
                setDiameters(fallbackDiameters);
                if (!fallbackDiameters.includes(selectedDiameter)) {
                    setSelectedDiameter('M10');
                }
            }
        }
        loadDiameters();
    }, [selectedType]);

    // Load diagram data
    useEffect(() => {
        async function loadDiagram() {
            if (!selectedType || !selectedDiameter) return;

            setLoading(true);
            try {
                const data = await calculatorAPI.getDiagramData(selectedType, selectedDiameter);
                setDiagramData(data);
            } catch (err) {
                console.error('Failed to load diagram:', err);
                setDiagramData(null);
            } finally {
                setLoading(false);
            }
        }
        loadDiagram();
    }, [selectedType, selectedDiameter]);

    // Get diagram component based on type
    const getDiagramComponent = () => {
        if (!diagramData) return null;

        const category = fastenerTypes.find(f => f.id === selectedType)?.category;

        if (selectedType.includes('bolt') || selectedType.includes('screw')) {
            return <HexBoltDiagram dimensions={diagramData.dimensions} />;
        } else if (selectedType.includes('nut')) {
            return <HexNutDiagram dimensions={diagramData.dimensions} />;
        } else if (selectedType.includes('washer')) {
            return <PlainWasherDiagram dimensions={diagramData.dimensions} />;
        }

        return <HexBoltDiagram dimensions={diagramData.dimensions} />;
    };

    return (
        <div className="diagrams-page">
            <div className="container">
                {/* Page Header */}
                <motion.div
                    className="page-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="page-icon">
                        <FileText size={32} />
                    </div>
                    <div>
                        <h1 className="page-title">Fastener Diagrams</h1>
                        <p className="page-subtitle">
                            Interactive dimension diagrams for DIN/ISO/IS standards
                        </p>
                    </div>
                </motion.div>

                <div className="diagrams-layout">
                    {/* Selector */}
                    <motion.div
                        className="diagrams-selector"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Card>
                            <h3 className="selector-title">Select Fastener</h3>

                            <Select
                                label="Fastener Type"
                                options={fastenerTypes.map(f => ({ value: f.id, label: f.name }))}
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            />

                            <div style={{ marginTop: 'var(--space-4)' }}>
                                <Select
                                    label="Diameter"
                                    options={diameters.map(d => ({ value: d, label: d }))}
                                    value={selectedDiameter}
                                    onChange={(e) => setSelectedDiameter(e.target.value)}
                                />
                            </div>

                            {diagramData && (
                                <div className="dimension-list">
                                    <h4>Dimensions</h4>
                                    {diagramData.labels?.map((label) => (
                                        <div key={label.key} className="dimension-item">
                                            <span className="dim-key">{label.key}</span>
                                            <span className="dim-name">{label.name}</span>
                                            <span className="dim-value mono">{label.value} {label.unit}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </motion.div>

                    {/* Diagram Display */}
                    <motion.div
                        className="diagram-display"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="diagram-card">
                            {loading ? (
                                <div className="diagram-loading">
                                    <div className="skeleton" style={{ width: '100%', height: 300 }} />
                                </div>
                            ) : diagramData ? (
                                <>
                                    <div className="diagram-header">
                                        <h3>{diagramData.fastener_type_name}</h3>
                                        <span className="diameter-badge">{selectedDiameter}</span>
                                    </div>
                                    <div className="diagram-container">
                                        {getDiagramComponent()}
                                    </div>
                                    <div className="diagram-note">
                                        <Info size={14} />
                                        <span>Dimensions per DIN/ISO standards. Tolerances may vary.</span>
                                    </div>
                                </>
                            ) : (
                                <div className="diagram-placeholder">
                                    <FileText size={48} />
                                    <p>Select a fastener type and diameter to view its diagram</p>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default Diagrams;
