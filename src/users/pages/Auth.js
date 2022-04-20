import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';

const Auth = props => {
  const auth = useContext(AuthContext);
  //handle login state (login || signup)
  const [isLoginMode, setIsLoginMode] = useState(true);
  //utilizing custom http hook
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //utilizing custom form-hook
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  //switch mode handler
  const switchModeHandler = () => {
    if (!isLoginMode) {
      //from sighnup to login
      setFormData(
        {
          ...formState.inputs,
          //dropping the name input going to login mode
          name: undefined,
          image: undefined, //for image uploading
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      //from login to sighnup
      setFormData(
        {
          ...formState.inputs,
          //adding name input
          name: {
            value: '',
            isValid: false,
          },
          image: {
            //for image uploading
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  //form submit handler
  const authSubmitHandler = async event => {
    event.preventDefault();

    if (isLoginMode) {
      //LOGIN
      try {
        //SIGNUP HTTP REQUEST TO BACKEND
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
        //update context state with data from backend, (also forwarding the token)
        auth.login(responseData.userId, responseData.token);
      } catch (err) {
        //handled in the custom hook
      }
    } else {
      //SIGNUP
      try {
        //building the body with the image
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);
        //SIGNUP HTTP REQUEST TO BACKEND
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/signup',
          'POST',
          formData
        );

        //update context state with data from backend, (also forwarding the token)
        auth.login(responseData.userId, responseData.token);
      } catch (err) {
        //handled in the custom hook
      }
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />{' '}
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name"
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image."
            />
          )}
          <Input
            id="email"
            element="input"
            type="email"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password (at least 6 charachters) ."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
