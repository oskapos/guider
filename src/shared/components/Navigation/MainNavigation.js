import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../UIElements/Backdrop';
import './MainNavigation.css';

const MainNavigation = () => {
  //state to handle backdrop and drawer visibility
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  //open drawer click handler
  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  //close drawer click handler
  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  return (
    <>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}

      {drawerIsOpen && (
        <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
          <nav className="main-navigation__drawer-nav">
            {/* nav links for mobile view drawer */}
            <NavLinks />
          </nav>
        </SideDrawer>
      )}
      <MainHeader>
        {/* hamburger button */}
        <button
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">Guider</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          {/* nav link for desktop view header */}
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
