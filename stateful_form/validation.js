import React, {PureComponent} from 'react';
import propTypes from 'prop-types';

export const validate = (fieldName, fieldValue, validators=[], values={}) => (
    Promise.all(
        validators.map(([validator, validatorOptions]) => (
            validator(fieldName, fieldValue, validatorOptions, values)
        ))
    )
);

export const withValidation = ({
    validators={},
    validateOnBlur=true,
    validateOnChange=false,
}) => FormComponent => {
    return class FormValidation extends PureComponent {
        static propTypes = {
            elements: propTypes.array.isRequired,
        };

        state = {
            errors: {},
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

        _handleBlur = (name, value, values={}) => {
            if (validateOnBlur) {
                this._validate(name, value, values)
                    .then(() => {
                        this.setState(state => ({
                            ...state,
                            errors: {
                                ...state.errors,
                                [name]: null,
                            },
                        }));
                    })
                    .catch(error => {
                        this.setState(state => ({
                            ...state,
                            errors: {
                                ...state.errors,
                                [name]: error,
                            },
                        }));
                    });;
            }
        };

        _handleChange = (name, value, values={}) => {
            if (validateOnChange) {
                this._validate(name, value, values)
                    .then(() => {
                        this.setState(state => ({
                            ...state,
                            errors: {
                                ...state.errors,
                                [name]: null,
                            },
                        }));
                    })
                    .catch(error => {
                        this.setState(state => ({
                            ...state,
                            errors: {
                                ...state.errors,
                                [name]: error,
                            },
                        }));
                    });;
            }
        };

        _handleSubmit = (values={}) => {
            Promise.all(
                this.props.elements.map(({name}) =>
                    new Promise((resolve, reject) =>
                        this._validate(name, values[name], values)
                            .then(() => {
                                resolve();
                                this.setState(state => ({
                                    ...state,
                                    errors: {
                                        ...state.errors,
                                        [name]: null,
                                    },
                                }));
                            })
                            .catch(error => {
                                reject();
                                this.setState(state => ({
                                    ...state,
                                    errors: {
                                        ...state.errors,
                                        [name]: error,
                                    },
                                }));
                            })
                    )
                )
            ).then(() => {
                this.props.handleSubmit(values);
            })
            .catch(() => {});
        };

        _validate = (fieldName, fieldValue, values={}) => {
            return validate(
                fieldName,
                fieldValue,
                (this.props.elements.find(item => item.name === fieldName).validators || []).map(item => {
                    let validatorName;
                    let validatorOptions = {};
                    if (item instanceof Array) {
                        [validatorName, validatorOptions] = item;
                    } else {
                        validatorName = item;
                    }
                    if (!validators[validatorName]) {
                        throw `Validator with name '${validatorName}' is not found.`
                    }
                    return [validators[validatorName], validatorOptions];
                }),
                values
            );   
        };
    };
};
