import React, {createElement, PureComponent} from 'react';
import propTypes from 'prop-types';

function Form({
    handleSubmit,
    elements,
}) {
    return (
        <form onSubmit={handleSubmit}>
            {elements}
            <div>
                <input type={'submit'} />
            </div>
        </form>
    );
}

function FormElement({
    label,
    element,
    error=null,
}) {
    return (
        <div>
            {
                label
                    ?
                        <label>
                            {label}
                        </label>
                    : null
            }
            { element }
            {
                error
                    ?
                        <small className={'error'}>
                            {error}
                        </small>
                    : null
            }
        </div>
    );    
}

export default class StatefulForm extends PureComponent {
    static propTypes = {
        elements: propTypes.array.isRequired,
        types: propTypes.object.isRequired,
        values: propTypes.object.isRequired,
        errors: propTypes.object,
    };

    state = {
        values: {},
    };

    componentDidMount() {
        this.setState(state => ({
            ...state,
            values:  this.props.values,
        }));
    }

    render() {
        const {
            elements=[],
            types={},
            errors={},
            FormElementComponent=FormElement,
            FormComponent=Form,
        } = this.props;
        const {
            values={},
        } = this.state;
        return (
            <FormComponent
                elements={
                    elements.map(({
                        label,
                        type,
                        name,
                    }, index) => {
                        if (!types[type]) {
                            throw `Type '${type}' is not defined in types array.`;
                        }
                        return (
                            <FormElementComponent
                                key={index}
                                label={label}
                                error={errors[name]}
                                element={createElement(types[type], {
                                    value:          values[name],
                                    handleChange:   value => this._handleChange(name, value, values),
                                    handleBlur:     value => this._handleBlur(name, value, values),
                                })}
                            />
                        );
                    })
                }
                handleSubmit={this._handleSubmit}
            />
        );
    }

    _handleSubmit = event => {
        event.preventDefault();
        this.props.handleSubmit(this.state.values);
    };

    _handleChange = (name, value) => {
        if (this.props.handleChange) {
            this.props.handleChange(name, value);
        }
        this.setState(state => ({
            ...state,
            values: {
                ...state.values,
                [name]: value,
            },
        }));
    };

    _handleBlur = (name, value) => {
        if (this.props.handleBlur) {
            this.props.handleBlur(name, value);
        }
    };
}

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
                this._validate(name, value, values);
            }
        };

        _handleChange = (name, value, values={}) => {
            if (validateOnChange) {
                this._validate(name, value, values);
            }
        };

        _handleSubmit = (values={}) => {

        };

        _validate = (fieldName, fieldValue, values={}) => {
            validate(
                fieldName,
                fieldValue,
                [...this.props.elements.find(item => item.name === fieldName).validators].map(item => {
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
            )
                .then(() => {
                    this.setState(state => ({
                        ...state,
                        errors: {
                            ...state.errors,
                            [fieldName]: null,
                        },
                    }));
                })
                .catch(error => {
                    this.setState(state => ({
                        ...state,
                        errors: {
                            ...state.errors,
                            [fieldName]: error,
                        },
                    }));
                });
        };
    };
};
