import React, {createElement} from 'react';

export default ({
    value,
    handleChange,
    handleBlur,
    options={},
    className,
}) => (
    createElement(
        options.multiline ? 'textarea': 'input',
        {
            type:           options.multiline ? undefined: options.htmlType || 'text',
            value:          value || '',
            onChange:       event => handleChange(event.target.value),
            onBlur:         event => handleBlur(event.target.value),
            placeholder:    options.placeholder,
            className,
        }
    )
);
