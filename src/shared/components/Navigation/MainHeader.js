import React from 'react';

import './MainHeader.css';

//The MainHeader component will wrap MainNavigation and will always be shown
const MainHeader = props => {
  return <header className="main-header">{props.children}</header>;
};

export default MainHeader;
