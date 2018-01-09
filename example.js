import React from 'react';
import Form, {withValidation} from './stateful_form';
import validators from './validators';
import types from './types';

const FormWithValidation = withValidation({
    validators,
    validateOnBlur: true,
    validateOnChange: false,
})(Form);

const elements = [
    {
        "type": "text",
        "name": "firstname",
        "validation": [
            "firstname",
            "required"
        ]
    },
    {
        "type": "text",
        "name": "secondname",
        "validation": [
            "secondname",
            "required"
        ]
    },
    {
        "type": "text",
        "name": "email",
        "validation": [
            "email",
            "required",
            ["min", 10],
            ["max", 200]
        ]
    },
    {
        "type": "wysiwyg",
        "name": "bio",
        "options": {
            "tools": ["b", "i", "u"]
        }
    }
];

const values = {
    "firstname": "John",
    "secondname": "Doe",
    "email": "john@doe.com",
    "bio": "<b>Be the best to mean something.</b>"
};

const handleSubmit = values => {
    console.log(values);
};

const Example = () => (
    <div>
        <Form
            elements={elements}
            types={types}
            values={values}
            handleSubmit={handleSubmit}
        />
        <FormWithValidation
            elements={elements}
            types={types}
            values={values}
            handleSubmit={handleSubmit}
        />
    </div>
);

export default Example;
