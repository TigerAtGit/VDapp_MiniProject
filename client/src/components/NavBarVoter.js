import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
} from './NavbarElements2';

const NavBarVoter = () => {
  return (
    <>
      <Nav>
        <NavLink to='/'>
          <img src={require('../images/logo.svg')} alt='logo' />
        </NavLink>
        <Bars />
        <NavMenu>
          <NavLink to='/' activeStyle>
            HOME
          </NavLink>
          <NavLink to='/CandidateDetails' activeStyle>
            CANDIDATES
          </NavLink>
          <NavLink to='/Vote' activeStyle>
            VOTE
          </NavLink>
          <NavLink to='/Register' activeStyle>
            REGISTER
          </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};

export default NavBarVoter;