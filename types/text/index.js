import React from 'react';

export default ({
    value,
    handleChange,
    handleBlur,
}) => (
    <input
        type={'text'}
        value={value || ''}
        onChange={event => handleChange(event.target.value)}
        onBlur={event => handleBlur(event.target.value)}
    />
);
