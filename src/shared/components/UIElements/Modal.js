import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';
import './Modal.css';

const ModalOverlay = props => {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass} `}>
        <h2>{props.header}</h2>
      </header>
      {/* this form is just to control buttons click on it */}
      <form
        onSubmit={
          // if there's no handler passed, prevent buttons on form to reload the page
          props.onSubmit ? props.onSubmit : event => event.preventDefault()
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children} {/*the map will render here */}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
};

const Modal = props => {
  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel} />}
      {/* map slide animation */}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        {/* forwarding Modal props to ModalOverlay */}
        <ModalOverlay {...props} />
      </CSSTransition>
    </>
  );
};

export default Modal;
