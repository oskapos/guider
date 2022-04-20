import React from 'react';
import ReactDOM from 'react-dom';
// import { CSSTransition } from 'react-transition-group';

import './SideDrawer.css';

//A side drawer component for mobile view
const SideDrawer = props => {
  const content = (
    // //3rd party component to achieve side drawer animation (I'll Fix later)
    // <CSSTransition
    // //props.show = drawerIsOpen (state)
    //   in={show}
    //   timeout={200}
    //   classNames="slide-in-left"
    //   mountOnEnter
    //   unmountOnExit
    // >
    //   {' '}
    // // props.onClick = closeDrawerHandler
    <aside className="side-drawer" onClick={props.onClick}>
      {props.children}
    </aside>
    // </CSSTransition>
  );

  //rendering the drawer in a portal (outside the component tree)
  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};

export default SideDrawer;
