import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default ({
    value,
    handleChange,
    handleBlur,
    options={},
    className,
}) => (
    <ReactQuill
        value={value || ''}
        onChange={(content, delta, source, editor) => handleChange(!editor.getText().trim() ? '': editor.getHTML())}
        onBlur={(previousRange, source, editor) => handleBlur(!editor.getText().trim() ? '': editor.getHTML())}
        className={className}
    />
);
