import React, {PureComponent} from 'react';
import propTypes from 'prop-types';
import defaultValidators from './validators';

const normalizeValidator = (validator, validators) => {
    const [name, options] = (
        validator instanceof Array
            ? validator
            : [validator, {}]
    );
    if (!validators[name]) {
        throw `Validator '${name}' is not defined.`;
    }
    return [validators[name], options];
};

const validate = (field, value, validators=[], values={}) => (
    Promise.all(
        (field.validators || []).map(validator => 
            normalizeValidator(validator, validators)
        ).map(([validateFn, options]) => 
            validateFn(value, options, values)
        )
    )
);

export const validators = defaultValidators;

export const withValidation = ({
    validators=defaultValidators,
    validateOnBlur=true,
    validateOnChange=false,
}) => FormComponent => (
    class FormValidationState extends PureComponent {
        static propTypes = {
            fields: propTypes.array.isRequired,
        };

        state = {
            errors: {},
            isValidating: false,
        };

        render() {
            return (
                <FormComponent
                    {...this.props}
                    errors={{...this.props.errors, ...this.state.errors}}
                    handleChange={validateOnChange ? this._handleChange: undefined}
                    handleBlur={validateOnBlur ? this._handleBlur: undefined}
                    handleSubmit={this._handleSubmit}
                />
            );
        }

        _getFieldByName = name => (
            this.props.fields.find(item => item.name === name)
        );

        _handleBlur = (name, value, values={}) => {
            this._validateField(name, value, values);
        };

        _handleChange = (name, value, values={}) => {
            this._validateField(name, value, values);
        };

        _handleSubmit = (values={}) => {
            let errors = {};
            this.setState(state => ({
                ...state,
                isValidating: true,
            }));
            Promise.all(
                this.props.fields.map(field =>
                    values[field.name] || (field.validators || []).indexOf('required') !== -1
                        ?
                            new Promise((resolve, reject) =>
                                validate(field, values[field.name], validators, values)
                                    .then(() => {
                                        resolve();
                                        errors = {
                                            ...errors,
                                            [field.name]: null,
                                        };
                                    })
                                    .catch(error => {
                                        reject();
                                        errors = {
                                            ...errors,
                                            [field.name]: error,
                                        };
                                    })
                            )
                        : null
                ).filter(item => item !== null)
            )
                .then(() => {
                    if (this.props.handleSubmit) {
                        this.props.handleSubmit(values);
                    }
                    this.setState(state => ({
                        ...state,
                        isValidating: false,
                        errors,
                    }));
                })
                .catch(() => {
                    if (this.props.handleErrors) {
                        this.props.handleErrors(errors);
                    }
                    this.setState(state => ({
                        ...state,
                        isValidating: false,
                        errors,
                    }));
                });
        };

        _validateField = (name, value, values={}) => {
            this.setState(state => ({
                ...state,
                isValidating: true,
            }));
            validate(this._getFieldByName(name), value, validators, values)
                .then(() => {
                    this.setState(state => ({
                        ...state,
                        isValidating: false,
                        errors: {
                            ...state.errors,
                            [name]: null,
                        },
                    }));
                })
                .catch(error => {
                    this.setState(state => ({
                        ...state,
                        isValidating: false,
                        errors: {
                            ...state.errors,
                            [name]: error,
                        },
                    }));
                });
        };
    }
);
