import React, {createElement, PureComponent} from 'react';
import propTypes from 'prop-types';
import defaultFieldClassNames from './field.css';
import defaultFormClassNames from './form.css';

export * from './validation';

function Form({
    handleSubmit,
    fields,
    classNames={},
}) {
    return (
        <form onSubmit={handleSubmit} className={classNames.form}>
            <div className={classNames.fields}>
                {fields}
            </div>
            <div className={classNames.submit}>
                <input type={'submit'} />
            </div>
        </form>
    );
}

function Field({
    label,
    field,
    error=null,
    isValidation=false,
    classNames={},
}) {
    return (
        <div className={classNames.field}>
            {
                label
                    ?
                        <label className={classNames.label}>
                            {label}
                        </label>
                    : null
            }
            <div className={classNames.holder}>
                { field }
            </div>
            {
                error
                    ?
                        <small className={classNames.error}>
                            {error}
                        </small>
                    : null
            }
        </div>
    );    
}

export default class StatefulForm extends PureComponent {
    static propTypes = {
        fields:     propTypes.array.isRequired,
        types:      propTypes.object.isRequired,
        values:     propTypes.object.isRequired,
        errors:     propTypes.object,
        classNames: propTypes.object,
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
            fields=[],
            types={},
            errors={},
            formClassNames=defaultFormClassNames,
            fieldClassNames=defaultFieldClassNames,
            FieldComponent=Field,
            FormComponent=Form,
        } = this.props;
        const {
            values={},
        } = this.state;
        return (
            <FormComponent
                fields={
                    fields.map(({
                        label,
                        type,
                        name,
                    }, index) => {
                        if (!types[type]) {
                            throw `Type '${type}' is not defined in types array.`;
                        }
                        return (
                            <FieldComponent
                                key={index}
                                label={label}
                                error={errors[name]}
                                field={createElement(types[type], {
                                    value:          values[name],
                                    handleChange:   value => this._handleChange(name, value, values),
                                    handleBlur:     value => this._handleBlur(name, value, values),
                                })}
                                classNames={fieldClassNames}
                            />
                        );
                    })
                }
                handleSubmit={this._handleSubmit}
                classNames={formClassNames}
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
