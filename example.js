import React from 'react';
import {FormWithValidation} from './StatefulForm';

const fields = [
    {
        "label": "First name",
        "type": "text",
        "name": "firstname",
        "validators": [
            "required"
        ]
    },
    {
        "label": "Second name",
        "type": "text",
        "name": "secondname",
        "validators": [
            "required"
        ]
    },
    {
        "label": "Email",
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
        "label": "Bio",
        "type": "wysiwyg",
        "name": "bio",
        "options": {
            "tools": ["b", "i", "u"]
        },
        "validators": [
            "required"
        ]
    },
    {
        "label": "Notes",
        "type": "text",
        "name": "notes",
        "options": {
            "multiline": true,
            "helpText": "Min 10, max 200",
            "placeholder": "Note description"
        },
        "conditions": [
            ["ifFieldValue", {"fieldName": "firstname", "condition": "notEmpty"}],
            ["ifFieldValue", {"fieldName": "firstname", "condition": "in", "inValues": ["abba"]}],
        ],
        "validators": [
            ["min", {"size": 10}],
            ["max", {"size": 200}]
        ]
    },
];

const values = {
    "firstname": "John",
    "secondname": "Doe",
    "email": "john@doe.com",
    "bio": "<b>Be the best to mean something.</b>",
    "notes": "Notes"
};

const handleSubmit = values => {
    console.log(values);
};

const Example = () => (
    <FormWithValidation
        validateOnBlur={true}
        validateOnChange={false}
        validateOnSubmit={true}
        fields={fields}
        values={values}
        handleSubmit={handleSubmit}
    />
);

export default Example;
