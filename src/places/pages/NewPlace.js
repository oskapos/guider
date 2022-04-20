import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
//importing validator functions
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //utilizing custom form-hook
  const [formState, InputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      address: {
        value: '',
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const navigate = useNavigate();

  //FORM SUBMIT HANDLER
  const placeSubmitHandler = async event => {
    event.preventDefault();
    try {
      //building body
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('creator', auth.userId);
      formData.append('image', formState.inputs.image.value);
      //ADD PLACE HTTP REQUEST
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/places',
        'POST',
        formData,
        {
          Authorization: 'Bearer ' + auth.token, //attaching the token as a header
        }
      );
      //Redirect user to starting page
      navigate('/', { replace: true });
    } catch (err) {}
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          type="text"
          label="Title"
          element="input"
          validators={[VALIDATOR_REQUIRE()]} //will return an object with a type property
          errorText="Please enter a valid title."
          onInput={InputHandler}
        />
        <Input
          id="description"
          label="Description"
          element="textarea"
          validators={[VALIDATOR_MINLENGTH(5)]} //will return an object with a type property
          errorText="Please enter a valid description(at least 5 charachters)."
          onInput={InputHandler}
        />
        <Input
          id="address"
          type="text"
          label="Address"
          element="input"
          validators={[VALIDATOR_REQUIRE()]} //will return an object with a type property
          errorText="Please enter a valid address."
          onInput={InputHandler}
        />
        <ImageUpload
          id="image"
          onInput={InputHandler}
          errorText="Please provide an image."
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
