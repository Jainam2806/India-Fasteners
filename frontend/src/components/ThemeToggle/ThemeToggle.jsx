import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import './ThemeToggle.css';

function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        // Check for saved preference or system preference
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved) {
                return saved === 'dark';
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    return (
        <motion.button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <motion.div
                className="theme-toggle-track"
                animate={{
                    backgroundColor: isDark ? 'var(--primary-600)' : 'var(--gray-200)'
                }}
                transition={{ duration: 0.2 }}
            >
                <motion.div
                    className="theme-toggle-thumb"
                    animate={{
                        x: isDark ? 24 : 0,
                        backgroundColor: isDark ? 'var(--gray-800)' : 'var(--bg-secondary)'
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                    {isDark ? (
                        <Moon size={14} className="theme-icon" />
                    ) : (
                        <Sun size={14} className="theme-icon" />
                    )}
                </motion.div>
            </motion.div>
        </motion.button>
    );
}

export default ThemeToggle;
