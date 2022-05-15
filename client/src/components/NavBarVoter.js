import React from 'react';
import {
  Nav,
  NavLink,
  NavBtn,
  NavBtnLink,
  Bars,
  NavMenu,
} from './NavbarElements2';

const NavBarVoter = () => {
  return (
    <>
      <Nav>
        <img className='justify-content-start' src={require('../images/logo.svg')} alt='logo' />
        <Bars />
        <NavMenu className='fw-bold m-auto'>
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
        <NavBtn className='fw-bolder'>
          <NavBtnLink to='/'>VOTER PORTAL</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
};

export default NavBarVoter;