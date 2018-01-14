import React from 'react';
import {FormWithValidation} from '../stateful_form';
import fields from './fields.json';

const values = {
    "firstname": "John",
    "secondname": "Doe",
    "email": "john@doe.com",
    "bio": "<b>Be the best to mean something.</b>",
    "notes": "Notes text has 10 chars"
};

const handleSubmit = values => {
    console.log('submit', values);
};

const handleErrors = errors => {
    console.log('errors', errors);
};

const Example = () => (
    <FormWithValidation
        validateOnBlur={true}
        validateOnChange={false}
        fields={fields}
        values={values}
        handleSubmit={handleSubmit}
        handleErrors={handleErrors}
    />
);

export default Example;
