import { motion } from 'framer-motion';
import './Card.css';

function Card({
    children,
    className = '',
    hover = false,
    padding = 'default',
    onClick,
    ...props
}) {
    const Component = onClick ? motion.button : motion.div;

    return (
        <Component
            className={`card ${hover ? 'card-hover' : ''} ${padding === 'none' ? '' : `card-padding-${padding}`} ${className}`}
            onClick={onClick}
            whileHover={hover ? { y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.12)' } : {}}
            transition={{ duration: 0.2 }}
            {...props}
        >
            {children}
        </Component>
    );
}

function CardHeader({ children, className = '' }) {
    return <div className={`card-header ${className}`}>{children}</div>;
}

function CardBody({ children, className = '' }) {
    return <div className={`card-body ${className}`}>{children}</div>;
}

function CardFooter({ children, className = '' }) {
    return <div className={`card-footer ${className}`}>{children}</div>;
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
