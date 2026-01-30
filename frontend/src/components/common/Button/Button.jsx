import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import './Button.css';

function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    ...props
}) {
    return (
        <motion.button
            className={`button button-${variant} button-${size} ${className}`}
            disabled={disabled || loading}
            whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
            transition={{ duration: 0.1 }}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2 className="button-spinner" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
                    {children}
                    {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
                </>
            )}
        </motion.button>
    );
}

export default Button;
