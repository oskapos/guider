import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css';

//a backdrop behind the drawer to click on it and close the drawer
const Backdrop = props => {
  return ReactDOM.createPortal(
    // props.onClick = closeDrawer() coming from MainNavigation
    <div className="backdrop" onClick={props.onClick}></div>,
    document.getElementById('backdrop-hook')
  );
};

export default Backdrop;
