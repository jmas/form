import React, {PureComponent} from 'react';
import propTypes from 'prop-types';

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

export const withValidation = ({
    validators={},
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
                    handleChange={this._handleChange}
                    handleBlur={this._handleBlur}
                    handleSubmit={this._handleSubmit}
                />
            );
        }

        _getFieldByName = name => (
            this.props.fields.find(item => item.name === name)
        );

        _handleBlur = (name, value, values={}) => {
            if (validateOnBlur) {
                this._validateField(name, value, values);
            }
        };

        _handleChange = (name, value, values={}) => {
            if (validateOnChange) {
                this._validateField(name, value, values);
            }
        };

        _handleSubmit = (values={}) => {
            this.setState(state => ({
                ...state,
                isValidating: true,
            }));
            Promise.all(
                this.props.fields.map(field =>
                    new Promise((resolve, reject) =>
                    validate(field, values[field.name], validators, values)
                            .then(() => {
                                resolve();
                                this.setState(state => ({
                                    ...state,
                                    isValidating: false,
                                    errors: {
                                        ...state.errors,
                                        [field.name]: null,
                                    },
                                }));
                            })
                            .catch(error => {
                                reject();
                                this.setState(state => ({
                                    ...state,
                                    isValidating: false,
                                    errors: {
                                        ...state.errors,
                                        [field.name]: error,
                                    },
                                }));
                            })
                    )
                )
            )
                .then(() => this.props.handleSubmit(values))
                .catch(() => {});
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
