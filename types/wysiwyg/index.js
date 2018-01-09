import React from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

export default ({
    value,
    handleChange,
    handleBlur,
}) => (
    <textarea
        value={value || ''}
        onChange={event => handleChange(event.target.value)}
        onBlur={event => handleBlur(event.target.value)}
    />
);
