import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calculator,
    Scale,
    Hash,
    ArrowRightLeft,
    Info,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { Card, Button, Select, Input } from '../components/common';
import { fastenerTypesAPI, materialsAPI, calculatorAPI, dimensionsAPI } from '../services/api';
import './WeightCalculator.css';

function WeightCalculator() {
    // State
    const [mode, setMode] = useState('pieces_to_weight'); // or 'weight_to_pieces'
    const [fastenerTypes, setFastenerTypes] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [diameters, setDiameters] = useState([]);

    const [formData, setFormData] = useState({
        fastenerType: '',
        material: '',
        diameter: '',
        length: '',
        quantity: '',
        weight: ''
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFastener, setSelectedFastener] = useState(null);

    // Load initial data
    useEffect(() => {
        async function loadData() {
            try {
                const [types, mats] = await Promise.all([
                    fastenerTypesAPI.getAll(),
                    materialsAPI.getAll()
                ]);
                setFastenerTypes(types);
                setMaterials(mats);

                // Auto-select first fastener type
                if (types.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        fastenerType: types[0].id
                    }));
                }
            } catch (err) {
                setError('Failed to load data. Make sure the backend is running.');
                console.error(err);
            }
        }
        loadData();
    }, []);

    // Load diameters when fastener type changes
    useEffect(() => {
        async function loadDiameters() {
            if (!formData.fastenerType) {
                setDiameters([]);
                return;
            }

            try {
                // Find the base type for diameters
                const typeMap = {
                    'hex_bolt_full_thread': 'hex_bolt',
                    'lock_nut': 'hex_nut',
                    'flange_nut': 'hex_nut',
                    'wing_nut': 'hex_nut',
                    'castle_nut': 'hex_nut',
                    'thin_hex_nut': 'hex_nut',
                    'heavy_duty_washer': 'plain_washer',
                };
                const baseType = typeMap[formData.fastenerType] || formData.fastenerType;

                const dims = await dimensionsAPI.getDiameters(baseType);
                setDiameters(dims);

                // Find selected fastener details
                const fastener = fastenerTypes.find(f => f.id === formData.fastenerType);
                setSelectedFastener(fastener);
            } catch (err) {
                // Fallback to default diameters
                setDiameters(['M3', 'M4', 'M5', 'M6', 'M8', 'M10', 'M12', 'M14', 'M16', 'M20', 'M24', 'M30']);
            }
        }
        loadDiameters();
    }, [formData.fastenerType, fastenerTypes]);

    // Handle form changes
    const handleChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        setResult(null);
        setError(null);
    };

    // Toggle calculation mode
    const toggleMode = () => {
        setMode(prev => prev === 'pieces_to_weight' ? 'weight_to_pieces' : 'pieces_to_weight');
        setResult(null);
    };

    // Validate form
    const isFormValid = () => {
        if (!formData.fastenerType || !formData.material || !formData.diameter) {
            return false;
        }

        if (selectedFastener?.has_length && !formData.length) {
            return false;
        }

        if (mode === 'pieces_to_weight' && !formData.quantity) {
            return false;
        }

        if (mode === 'weight_to_pieces' && !formData.weight) {
            return false;
        }

        return true;
    };

    // Calculate
    const handleCalculate = async () => {
        if (!isFormValid()) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let response;

            const params = {
                fastener_type_id: formData.fastenerType,
                material_id: formData.material,
                diameter: formData.diameter,
                length: selectedFastener?.has_length ? parseFloat(formData.length) : null
            };

            if (mode === 'pieces_to_weight') {
                response = await calculatorAPI.calculateWeight({
                    ...params,
                    quantity: parseInt(formData.quantity)
                });
            } else {
                response = await calculatorAPI.calculatePieces({
                    ...params,
                    weight: parseFloat(formData.weight)
                });
            }

            setResult(response);
        } catch (err) {
            setError(err.response?.data?.detail || 'Calculation failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Prepare options for selects
    const fastenerOptions = fastenerTypes.map(f => ({
        value: f.id,
        label: f.name
    }));

    const materialOptions = materials.map(m => ({
        value: m.id,
        label: m.grade ? `${m.name} (${m.grade})` : m.name
    }));

    const diameterOptions = diameters.map(d => ({
        value: d,
        label: d
    }));

    return (
        <div className="calculator-page">
            <div className="container">
                {/* Page Header */}
                <motion.div
                    className="page-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="page-icon">
                        <Calculator size={32} />
                    </div>
                    <div>
                        <h1 className="page-title">Weight Calculator</h1>
                        <p className="page-subtitle">
                            Calculate weight from pieces or pieces from weight
                        </p>
                    </div>
                </motion.div>

                <div className="calculator-layout">
                    {/* Calculator Form */}
                    <motion.div
                        className="calculator-form-section"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Card className="overflow-visible">
                            {/* Mode Toggle */}
                            <div className="mode-toggle">
                                <button
                                    className={`mode-btn ${mode === 'pieces_to_weight' ? 'active' : ''}`}
                                    onClick={() => setMode('pieces_to_weight')}
                                >
                                    <Hash size={18} />
                                    <span>Pieces → Weight</span>
                                </button>
                                <button
                                    className={`mode-btn ${mode === 'weight_to_pieces' ? 'active' : ''}`}
                                    onClick={() => setMode('weight_to_pieces')}
                                >
                                    <Scale size={18} />
                                    <span>Weight → Pieces</span>
                                </button>
                            </div>

                            {/* Form Fields */}
                            <div className="form-grid">
                                <Select
                                    label="Fastener Type"
                                    options={fastenerOptions}
                                    value={formData.fastenerType}
                                    onChange={handleChange('fastenerType')}
                                    placeholder="Select fastener type"
                                />

                                <Select
                                    label="Material"
                                    options={materialOptions}
                                    value={formData.material}
                                    onChange={handleChange('material')}
                                    placeholder="Select material"
                                />

                                <Select
                                    label="Diameter"
                                    options={diameterOptions}
                                    value={formData.diameter}
                                    onChange={handleChange('diameter')}
                                    placeholder="Select diameter"
                                    disabled={!formData.fastenerType}
                                />

                                {selectedFastener?.has_length && (
                                    <Input
                                        label="Length"
                                        type="number"
                                        value={formData.length}
                                        onChange={handleChange('length')}
                                        placeholder="Enter length"
                                        suffix="mm"
                                        min="1"
                                    />
                                )}

                                {mode === 'pieces_to_weight' ? (
                                    <Input
                                        label="Quantity (Pieces)"
                                        type="number"
                                        value={formData.quantity}
                                        onChange={handleChange('quantity')}
                                        placeholder="Enter quantity"
                                        suffix="pcs"
                                        min="1"
                                    />
                                ) : (
                                    <Input
                                        label="Weight"
                                        type="number"
                                        value={formData.weight}
                                        onChange={handleChange('weight')}
                                        placeholder="Enter weight"
                                        suffix="kg"
                                        min="0.001"
                                        step="0.001"
                                    />
                                )}
                            </div>

                            {/* Error Message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        className="error-message"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <AlertCircle size={18} />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Calculate Button */}
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={handleCalculate}
                                loading={loading}
                                disabled={!isFormValid()}
                                icon={Calculator}
                                className="calculate-btn"
                            >
                                Calculate
                            </Button>
                        </Card>
                    </motion.div>

                    {/* Results Section */}
                    <motion.div
                        className="calculator-results-section"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="result-card">
                                        <div className="result-header">
                                            <CheckCircle2 className="result-icon" size={24} />
                                            <h3>Calculation Result</h3>
                                        </div>

                                        <div className="result-summary">
                                            <div className="result-item">
                                                <span className="result-label">Fastener</span>
                                                <span className="result-value">{result.fastener_type}</span>
                                            </div>
                                            <div className="result-item">
                                                <span className="result-label">Material</span>
                                                <span className="result-value">
                                                    {result.material}
                                                    {result.material_grade && ` (${result.material_grade})`}
                                                </span>
                                            </div>
                                            <div className="result-item">
                                                <span className="result-label">Size</span>
                                                <span className="result-value mono">
                                                    {result.diameter}
                                                    {result.length && ` × ${result.length}mm`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="result-main">
                                            <div className="result-highlight">
                                                <span className="result-highlight-label">Unit Weight</span>
                                                <span className="result-highlight-value mono">
                                                    {result.unit_weight_grams.toFixed(3)} g
                                                </span>
                                            </div>

                                            {mode === 'pieces_to_weight' ? (
                                                <div className="result-highlight primary">
                                                    <span className="result-highlight-label">Total Weight</span>
                                                    <span className="result-highlight-value mono">
                                                        {result.total_weight_kg.toFixed(4)} kg
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="result-highlight primary">
                                                    <span className="result-highlight-label">Total Pieces</span>
                                                    <span className="result-highlight-value mono">
                                                        {result.total_pieces?.toLocaleString() || '-'} pcs
                                                    </span>
                                                </div>
                                            )}

                                            <div className="result-highlight secondary">
                                                <span className="result-highlight-label">Pieces per 50 kg</span>
                                                <span className="result-highlight-value mono">
                                                    {result.pieces_per_50kg?.toLocaleString()} pcs
                                                </span>
                                            </div>
                                        </div>

                                        <div className="result-note">
                                            <Info size={14} />
                                            <span>Weights are approximate. Actual weight may vary ±5% based on tolerances.</span>
                                        </div>
                                    </Card>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="result-placeholder"
                                >
                                    <div className="placeholder-icon">
                                        <Scale size={48} />
                                    </div>
                                    <h3>Awaiting Calculation</h3>
                                    <p>Fill in the form and click Calculate to see results</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Info Cards */}
                <motion.div
                    className="info-cards"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card padding="sm" className="info-card">
                        <h4>How it works</h4>
                        <p>
                            Weight is calculated using the formula: Volume × Material Density.
                            We use standard DIN/ISO dimensions for accurate volume calculations.
                        </p>
                    </Card>
                    <Card padding="sm" className="info-card">
                        <h4>Supported Standards</h4>
                        <p>
                            Dimensions based on DIN 931/933, DIN 934, DIN 125, ISO 4014/4017,
                            ISO 4032, and corresponding Indian Standards (IS).
                        </p>
                    </Card>
                    <Card padding="sm" className="info-card">
                        <h4>Materials</h4>
                        <p>
                            Supports Mild Steel, High Tensile (8.8, 10.9, 12.9), Stainless Steel
                            (304, 316), Brass, and Aluminium with accurate density values.
                        </p>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

export default WeightCalculator;
