import React, { useRef, useState, useEffect } from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = props => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  //accessing the input element to call click() on it
  const filePickerRef = useRef();

  //Preview the image
  useEffect(() => {
    if (!file) {
      //file changed (undefined) ?
      return;
    }
    //built in browser API
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result); //load the read file to state
    };
    fileReader.readAsDataURL(file); //upon reading the file the cb function above will run
  }, [file]);

  //open file picker when clicking
  const pickImageHandler = () => {
    filePickerRef.current.click(); //open file picker
  };

  //upon choosing an image
  const pickedHandler = event => {
    let pickedFile;
    let fileIsValid = isValid; //because the state will be registered and we want an immediate value

    // there is files uploaded and it's one file
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0]; //extract the picked file
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    //this function is from the custom-hook
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }} //hide it (we need it just to open the picker)
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {/* picked a wrong file */}
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
