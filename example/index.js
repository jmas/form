import React from 'react';
import {FormWithValidation} from '../StatefulForm';
import fields from './fields.json';

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

const handleErrors = errors => {
    console.log(errors);
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
