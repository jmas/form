import React, {createElement, PureComponent} from 'react';

const Form = ({
    handleSubmit,
    elements,
}) => (
    <form onSubmit={handleSubmit}>
        {elements}
        <div>
            <input type={'submit'} />
        </div>
    </form>
);

const Element = ({
    label,
    element,
    error=null,
}) => (
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

export default class extends PureComponent {
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
            ElementComponent=Element,
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
                    }, index) => (
                        <ElementComponent
                            key={index}
                            label={label}
                            error={errors[name]}
                            element={createElement(types[type], {
                                value:          values[name],
                                handleChange:   value => this._handleChange(name, value),
                                handleBlur:     value => this._handleBlur(name, value),
                            })}
                        />
                    ))
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
