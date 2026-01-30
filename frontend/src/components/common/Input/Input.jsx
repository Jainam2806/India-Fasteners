import './Input.css';

function Input({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    disabled = false,
    suffix,
    className = '',
    ...props
}) {
    return (
        <div className={`input-wrapper ${className}`}>
            {label && <label className="input-label">{label}</label>}
            <div className="input-container">
                <input
                    type={type}
                    className={`input ${error ? 'input-error' : ''} ${suffix ? 'input-with-suffix' : ''}`}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    {...props}
                />
                {suffix && <span className="input-suffix">{suffix}</span>}
            </div>
            {error && <span className="input-error-text">{error}</span>}
        </div>
    );
}

export default Input;
