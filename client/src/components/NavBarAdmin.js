import React from 'react';
import {
  Nav,
  NavLink,
  NavBtn,
  NavBtnLink,
  Bars,
  NavMenu,
} from './NavbarElements';

const NavBarAdmin = () => {
  return (
    <>
      <Nav>
        <img src={require('../images/logo.svg')} alt='logo' />
        <Bars />
        <NavMenu className='fw-bold m-auto'>
          <NavLink to='/CandidateDetails' activeStyle>
            CANDIDATES
          </NavLink>
          <NavLink to='/AddCandidate' activeStyle>
            ADD CANDIDATE
          </NavLink>
          <NavLink to='/VerifyVoter' activeStyle>
            VERIFY VOTER
          </NavLink>
          <NavLink to='/Phase' activeStyle>
            ELECTION PHASE
          </NavLink>
          <NavLink to='/Result' activeStyle>
            RESULTS
          </NavLink>
        </NavMenu>
        <NavBtn className='fw-bolder'>
          <NavBtnLink to='/'>ADMIN PORTAL</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
};

export default NavBarAdmin;
