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
                <input type={'text'} value={'safsd'} />
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
    state = {
        values: {},
    };

    static propTypes = {
        elements: propTypes.array.isRequired,
        types: propTypes.object.isRequired,
        values: propTypes.object.isRequired,
        errors: propTypes.object,
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
                                    handleChange:   value => this._handleChange(name, value),
                                    handleBlur:     value => this._handleBlur(name, value),
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

export const withValidation = ({
    validators,
    validateOnBlur=true,
    validateOnChange=false,
}) => FormComponent => {
    return class extends PureComponent {
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
                />
            );
        }

        _handleBlur = (name, value) => {
            if (validateOnBlur) {
                this.setState(state => ({
                    ...state,
                    errors: {
                        ...state.errors,
                        [name]: 'Warn!',
                    },
                }));
            }
        };

        _handleChange = (name, value) => {
            if (validateOnChange) {
                this.setState(state => ({
                    ...state,
                    errors: {
                        ...state.errors,
                        [name]: 'Warn!',
                    },
                }));
            }
        };
    };
};
