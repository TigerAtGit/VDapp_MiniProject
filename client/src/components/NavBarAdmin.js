import React, {Component} from 'react';
import { Link } from 'react-router-dom';
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
      </Nav>
    </>
  );
};

export default NavBarAdmin;
