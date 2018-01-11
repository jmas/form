import React, {createElement, PureComponent} from 'react';
import propTypes from 'prop-types';
import defaultTypes from './types';
import defaultConditions from './conditions';
import defaultFieldClassNames from './field.css';
import defaultFormClassNames from './form.css';
import {withValidation} from './validation';

export * from './validation';

function DefaultForm({
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

function DefaultField({
    label,
    field,
    error=null,
    validators=[],
    isValidation=false,
    classNames={},
    options={},
}) {
    return (
        <div className={`${classNames.field} ${error ? classNames.hasError: ''} ${validators.indexOf('required') !== -1 ? classNames.required: ''}`}>
            {
                label
                    ?
                        <label className={classNames.label}>
                            {label}
                        </label>
                    : null
            }
            {
                options.helpText
                    ?
                        <small className={classNames.helpText}>
                            {options.helpText}
                        </small>
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

class FieldCondition extends PureComponent {
    static state = {
        valid: false,
    };

    componentDidUpdate() {
        Promise.all(
            this.props.conditions.map(([conditionFn, options={}]) => 
                conditionFn(this.props.value, options, this.props.values)
            )
        )
            .then(() => this.setState(state => ({...state, valid: true})))
            .catch(() => this.setState(state => ({...state, valid: false})));
    }

    render() {
        return (
            this.state && this.state.valid ? this.props.content: null
        );
    }
}

const normalizeConditions = (fieldConditions=[], conditions) => (
    fieldConditions.map(item => {
        const [name, options] = (
            item instanceof Array
                ? item
                : [item, {}]
        );
        if (!conditions[name]) {
            throw `Condition '${name}' is not defined.`;
        }
        return [conditions[name], options];
    })
);

export class Form extends PureComponent {
    static propTypes = {
        fields:     propTypes.array.isRequired,
        types:      propTypes.object.isRequired,
        values:     propTypes.object.isRequired,
        errors:     propTypes.object,
        classNames: propTypes.object,
    };

    static defaultProps = {
        fields:     [],
        types:      defaultTypes,
        values:     {},
        errors:     {},
        classNames: {},
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
            conditions=defaultConditions,
            formClassNames=defaultFormClassNames,
            fieldClassNames=defaultFieldClassNames,
            FieldComponent=DefaultField,
            FormComponent=DefaultForm,
        } = this.props;
        const {
            values={},
        } = this.state;
        const getFieldElement = ({
            label,
            type,
            name,
            validators=[],
            options={},
            key=null,
            ...field,
        }) => {
            if (!types[type]) {
                throw `Field type '${type}' is not defined.`;
            }
            const content = (
                <FieldComponent
                    label={label}
                    error={errors[name]}
                    validators={validators}
                    options={options}
                    field={
                        createElement(types[type], {
                            value:          values[name],
                            handleChange:   value => this._handleChange(name, value, values),
                            handleBlur:     value => this._handleBlur(name, value, values),
                            hasError:       !!errors[name],
                            className:      fieldClassNames.input,
                            options,
                        })
                    }
                    classNames={fieldClassNames}
                    key={key}
                />
            );
            return (
                field.conditions
                    ?
                        <FieldCondition
                            conditions={normalizeConditions(field.conditions, conditions)}
                            content={content}
                            value={values[name]}
                            values={values}
                            key={key}
                        />
                    : content
            );
        };
        return (
            <FormComponent
                fields={
                    fields.map((field, index) => 
                        getFieldElement({...field, key: index})
                    )
                }
                getField={
                    name => {
                        const field = fields.find(item => item.name === name);
                        if (!field) {
                            throw `Field '${name}' is not found in fields list.`
                        }
                        return getFieldElement({...field});
                    }
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
        if (this.state.values[name] !== value) {
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
        }
    };

    _handleBlur = (name, value) => {
        if (this.props.handleBlur) {
            this.props.handleBlur(name, value);
        }
    };
}

export function FormWithValidation(props) {
    const FormWithValidation = withValidation(props)(Form);
    return (
        <FormWithValidation {...props} />
    );
}
