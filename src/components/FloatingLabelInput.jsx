import React, { useState } from 'react';

const FloatingLabelInput = ({ label, value, onChangeText, type = 'text', ...props }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const labelStyle = {
        position: 'absolute',
        left: '12px',
        zIndex: 1,
        top: (isFocused || value) ? '-10px' : '12px', 
        fontSize: (isFocused || value) ? '12px' : '16px',
        color: (isFocused || value) ? '#FFD700' : '#999', 
        transition: 'top 0.3s, font-size 0.3s, color 0.3s',
    };

    return (
        <div style={{ position: 'relative', marginBottom: '15px' }}>
            <label style={labelStyle}>{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChangeText(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{
                    backgroundColor: '#1c1c1e',
                    borderRadius: '10px',
                    padding: '12px',
                    paddingTop: '20px',
                    color: '#fff',
                    fontSize: '16px',
                    width: '97%',
                }}
                {...props}
            />
        </div>
    );
};

export default FloatingLabelInput;
