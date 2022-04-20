import { useCallback, useReducer } from 'react';

//form reducer will update form validity based on inputs validity
const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) continue; //skip, dont validate this input (in login mode 'name' input will be undefined so we don't want to validate it, the app will crash)

        //input we're looking at is the one getting updated?
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          //another one? => use the stored isValid
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          //update either 'title' or 'description':
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    case 'SET_DATA':
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };

    default:
      return state;
  }
};

//CUSTOM FORM HOOK
export const useForm = (initialInputs, initialFormValidity) => {
  //state to handle the overall form
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  //dispatch an action dynamically for an input with its
  //validity state to update form state
  const InputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: 'INPUT_CHANGE',
      value: value,
      isValid: isValid,
      inputId: id,
    });
  }, []);

  //function to set the form with the data(initial data) that has arrived from the backend
  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: 'SET_DATA',
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);

  return [formState, InputHandler, setFormData];
};
