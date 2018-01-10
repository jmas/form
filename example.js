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
        "validators": [
            "required"
        ]
    },
    {
        "type": "text",
        "name": "secondname",
        "validators": [
            "required"
        ]
    },
    {
        "type": "text",
        "name": "email",
        "validators": [
            "required",
            "email",
            ["min", {"size": 10}],
            ["max", {"size": 200}]
        ]
    },
    {
        "type": "wysiwyg",
        "name": "bio",
        "options": {
            "tools": ["b", "i", "u"]
        },
        "validators": [
            "required"
        ]
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
    <FormWithValidation
        elements={elements}
        types={types}
        values={values}
        handleSubmit={handleSubmit}
    />
);

export default Example;
