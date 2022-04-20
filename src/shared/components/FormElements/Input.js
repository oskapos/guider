import React, { useReducer, useEffect } from 'react';

import { validate } from '../../util/validators';
import './Input.css';

//reducer function to update input state
const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state, //copy old state obj
        value: action.val, //override the value with the new one
        isValid: validate(action.val, action.validators), //apply validation types in validators array
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true,
      };
    }
    default:
      return state;
  }
};

const Input = props => {
  //input state to handle the input's value, validity and focus.
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false,
  });

  //destructuring to pass as useEffect dependency
  const { id, onInput } = props;
  const { value, isValid } = inputState;

  //send the input state with its id to dispatch an action and update the overall form state
  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = event => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value, //collect entered data
      validators: props.validators, //validation types array
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH',
    });
  };

  const element = //dynamic, based on the prop we pass
    //either an <input> or <textarea>
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value} //tow-way binding
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && 'form-control--invalid'
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
