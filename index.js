import {createElement} from 'react';
import React, {PureComponent} from 'react';
import {render} from 'react-dom';
import Form, {withValidation} from './form';
import formElements from './form_elements.json';
import types from './types';
import validators from './validators';
import classNames from './index.css';

const FormWithValidation = withValidation({
    validators,
    validateOnBlur: true,
    validateOnChange: false,
})(Form);

const ElementComponent = ({
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
                    <small className={classNames.error}>
                        {error}
                    </small>
                : null
        }
    </div>
);

class App extends PureComponent {
    state = {
        formElements,
    };

    render() {
        const {formElements} = this.state;
        const values = {
            firstname:  'John',
            secondname: 'Doe',
            email:      'john@doe.com',
            bio:        '<b>Be the best to mean something.</b>',
        };
        return (
            <div>
                <FormWithValidation
                    elements={formElements}
                    types={types}
                    values={values}
                    errors={{ firstname: 'Error!' }}
                    ElementComponent={ElementComponent}
                    handleSubmit={this._handleSubmit}
                />
                <button type={'button'} onClick={this._addElement}>Add Element</button>
            </div>
        );
    }

    _addElement = () => {
        this.setState(state => ({
            ...state,
            formElements: [
                ...state.formElements,
                {
                    label: 'First Name',
                    type: 'text',
                    name: 'firstname' + Math.ceil(Math.random() * 1000),
                    validation: [
                        'firstname',
                        'required'
                    ],
                },
            ],
        }));
    };

    _handleSubmit = values => {
        console.log(values);
    };
}

render(<App />, document.getElementById('root'));
