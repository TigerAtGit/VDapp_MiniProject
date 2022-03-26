import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink
} from './NavbarElements';

const Navbar = () => {
  return (
    <>
      <Nav>
        <NavLink to='/'>
          <img src={require('../../images/logo.svg')} alt='logo' />
        </NavLink>
        <Bars />
        <NavMenu>
          <NavLink to='/home' activeStyle>
            Home
          </NavLink>
          <NavLink to='/candidates' activeStyle>
            Candidates
          </NavLink>
          <NavLink to='/verify-voter' activeStyle>
            Verify Voter
          </NavLink>
          <NavLink to='/add-candidate' activeStyle>
            Add Candidate
          </NavLink>
          <NavLink to='/results' activeStyle>
            Results
          </NavLink>
          <NavLink to='/phase' activeStyle>
            Start/End
          </NavLink>
          {/* Second Nav */}
          {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
        </NavMenu>
        <NavBtn>
          <NavBtnLink to='/signin'>Sign In</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
};

export default Navbar;
