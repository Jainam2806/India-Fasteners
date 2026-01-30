import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bolt, Menu, X } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from '../ThemeToggle';
import './Header.css';

const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/calculator', label: 'Weight Calculator' },
    { path: '/diagrams', label: 'Diagrams' },
    { path: '/hsn', label: 'HSN Codes' },
    { path: '/standards', label: 'Standards' },
];

function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        <motion.div
                            className="logo-icon"
                            whileHover={{ rotate: 90 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Bolt size={28} />
                        </motion.div>
                        <span className="logo-text">
                            India <span className="logo-highlight">Fasteners</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="nav-desktop">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            >
                                {link.label}
                                {location.pathname === link.path && (
                                    <motion.div
                                        className="nav-indicator"
                                        layoutId="nav-indicator"
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side: Theme Toggle + Mobile Menu */}
                    <div className="header-actions">
                        <ThemeToggle />

                        {/* Mobile Menu Button */}
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <motion.nav
                    className={`nav-mobile ${mobileMenuOpen ? 'open' : ''}`}
                    initial={false}
                    animate={{
                        height: mobileMenuOpen ? 'auto' : 0,
                        opacity: mobileMenuOpen ? 1 : 0
                    }}
                    transition={{ duration: 0.2 }}
                >
                    {navLinks.map((link, index) => (
                        <motion.div
                            key={link.path}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{
                                opacity: mobileMenuOpen ? 1 : 0,
                                x: mobileMenuOpen ? 0 : -20
                            }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                to={link.path}
                                className={`nav-link-mobile ${location.pathname === link.path ? 'active' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        </motion.div>
                    ))}
                </motion.nav>
            </div>
        </header>
    );
}

export default Header;
