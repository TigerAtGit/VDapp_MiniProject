import React, {Component} from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
} from './NavbarElements';

const NavBarAdmin = () => {
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
          <NavLink to='/VerifyVoter' activeStyle>
            VERIFY VOTER
          </NavLink>
          <NavLink to='/AddCandidate' activeStyle>
            ADD CANDIDATE
          </NavLink>
          <NavLink to='/Result' activeStyle>
            RESULTS
          </NavLink>
          <NavLink to='/Phase' activeStyle>
            ELECTION PHASE
          </NavLink>
        </NavMenu>
        <NavLink to='/' style={{color:"white",cursor:"arrow",marginRight:"20px"}}>
          Hi Admin!
        </NavLink>
      </Nav>
    </>
  );
};

export default NavBarAdmin;
