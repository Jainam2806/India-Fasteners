import './Select.css';

function Select({
    label,
    options = [],
    value,
    onChange,
    placeholder = 'Select an option',
    error,
    disabled = false,
    className = '',
    ...props
}) {
    return (
        <div className={`select-wrapper ${className}`}>
            {label && <label className="select-label">{label}</label>}
            <select
                className={`select ${error ? 'select-error' : ''}`}
                value={value}
                onChange={onChange}
                disabled={disabled}
                {...props}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className="select-error-text">{error}</span>}
        </div>
    );
}

export default Select;
