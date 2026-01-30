import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calculator,
    FileText,
    BookOpen,
    Scale,
    ArrowRight,
    CheckCircle2,
    Zap,
    Shield
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './Home.css';

const features = [
    {
        icon: Calculator,
        title: 'Weight Calculator',
        description: 'Calculate weight from pieces or pieces from weight for any fastener type',
        path: '/calculator',
        color: 'primary'
    },
    {
        icon: FileText,
        title: 'Fastener Diagrams',
        description: 'Interactive diagrams with dimensions for DIN, ISO, and IS standards',
        path: '/diagrams',
        color: 'secondary'
    },
    {
        icon: Scale,
        title: 'HSN & GST Codes',
        description: 'Search HSN codes and find applicable GST rates for fasteners',
        path: '/hsn',
        color: 'info'
    },
    {
        icon: BookOpen,
        title: 'Standards Reference',
        description: 'Quick reference for DIN, ISO, and Indian Standards specifications',
        path: '/standards',
        color: 'success'
    }
];

const benefits = [
    {
        icon: Zap,
        title: 'Instant Calculations',
        description: 'Get accurate weight and count results in milliseconds'
    },
    {
        icon: Shield,
        title: 'Industry Standards',
        description: 'Based on DIN, ISO, and BIS specifications'
    },
    {
        icon: CheckCircle2,
        title: 'Comprehensive Data',
        description: '20+ fastener types and 10+ materials supported'
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' }
    }
};

function Home() {
    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <motion.div
                        className="hero-content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="hero-badge">🇮🇳 Made for Indian Fastener Industry</span>
                        <h1 className="hero-title">
                            Simplify Your <span className="hero-highlight">Fastener Calculations</span>
                        </h1>
                        <p className="hero-subtitle">
                            Weight count solutions, fastener diagrams, GST/HSN codes, and industry standards —
                            all in one place. Built for manufacturers, traders, and engineers.
                        </p>
                        <div className="hero-actions">
                            <Link to="/calculator">
                                <Button variant="secondary" size="lg" icon={Calculator}>
                                    Start Calculating
                                </Button>
                            </Link>
                            <Link to="/diagrams">
                                <Button variant="outline" size="lg">
                                    View Diagrams
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Animated Bolt/Nut Illustration */}
                    <motion.div
                        className="hero-illustration"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="bolt-animation">
                            <svg viewBox="0 0 200 200" className="bolt-svg">
                                {/* Hex Bolt Head */}
                                <motion.polygon
                                    points="100,20 160,50 160,110 100,140 40,110 40,50"
                                    fill="none"
                                    stroke="var(--secondary-400)"
                                    strokeWidth="3"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                />
                                {/* Bolt Shank */}
                                <motion.rect
                                    x="85"
                                    y="140"
                                    width="30"
                                    height="50"
                                    fill="none"
                                    stroke="var(--primary-400)"
                                    strokeWidth="3"
                                    rx="2"
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    transition={{ duration: 0.5, delay: 1.2 }}
                                    style={{ transformOrigin: '100px 140px' }}
                                />
                                {/* Thread Lines */}
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <motion.line
                                        key={i}
                                        x1="82"
                                        y1={148 + i * 10}
                                        x2="118"
                                        y2={148 + i * 10}
                                        stroke="var(--primary-300)"
                                        strokeWidth="1"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.5 + i * 0.1 }}
                                    />
                                ))}
                            </svg>
                            {/* Floating particles */}
                            <motion.div
                                className="particle particle-1"
                                animate={{
                                    y: [0, -10, 0],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }}
                            />
                            <motion.div
                                className="particle particle-2"
                                animate={{
                                    y: [0, -15, 0],
                                    opacity: [0.3, 0.8, 0.3]
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: 0.5
                                }}
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">Everything You Need</h2>
                        <p className="section-subtitle">
                            Comprehensive tools for fastener weight calculations and industry reference
                        </p>
                    </motion.div>

                    <motion.div
                        className="features-grid"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {features.map((feature) => (
                            <motion.div key={feature.path} variants={itemVariants}>
                                <Link to={feature.path} className="feature-link">
                                    <Card hover className="feature-card">
                                        <div className={`feature-icon feature-icon-${feature.color}`}>
                                            <feature.icon size={28} />
                                        </div>
                                        <h3 className="feature-title">{feature.title}</h3>
                                        <p className="feature-description">{feature.description}</p>
                                        <span className="feature-cta">
                                            Explore <ArrowRight size={16} />
                                        </span>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits-section">
                <div className="container">
                    <motion.div
                        className="benefits-grid"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                className="benefit-item"
                                variants={itemVariants}
                            >
                                <div className="benefit-icon">
                                    <benefit.icon size={24} />
                                </div>
                                <div className="benefit-content">
                                    <h4 className="benefit-title">{benefit.title}</h4>
                                    <p className="benefit-description">{benefit.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <motion.div
                        className="cta-content"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="cta-title">Ready to Calculate?</h2>
                        <p className="cta-subtitle">
                            Start with our weight calculator — no signup required
                        </p>
                        <Link to="/calculator">
                            <Button variant="secondary" size="lg" icon={ArrowRight} iconPosition="right">
                                Get Started Now
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

export default Home;
