import React, { Component } from "react";
import ElectionContract from '../contracts/ElectionContract.json';
import getWeb3 from "../getWeb3";
import NavBarAdmin from "./NavBarAdmin";
import NavBarVoter from "./NavBarVoter";
import candidateicon from "../images/candidatepic.jpg";
import { Button } from 'react-bootstrap';
import { Bars } from 'react-loader-spinner'

class Results extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      toggle: false,
      result: null,
      isOwner: false,
      candidateList: null,
      start: false,
      end: false
    }
  }


  result = async () => {

    let result = [];
    let candidateList = [];
    let candidateCount = await this.state.ElectionInstance.methods.getTotalCandidates().call();

    for (let i = 0; i < candidateCount; i++) {
      let candidate = await this.state.ElectionInstance.methods.candidateDetails(i).call();

      result.push(candidate);
    }

    this.setState({ result: result });
    this.setState({ toggle: true })
    this.setState({ candidateList: candidateList });

  }

  componentDidMount = async () => {
    if (!window.location.hash) {
      window.location = window.location + '#loaded';
      window.location.reload();
    }

    try {

      const web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ElectionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ElectionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ ElectionInstance: instance, web3: web3, account: accounts[0] });

      const owner = await this.state.ElectionInstance.methods.getOwner().call();
      if (this.state.account === owner) {
        this.setState({ isOwner: true });
      }

      let start = await this.state.ElectionInstance.methods.getStart().call();
      let end = await this.state.ElectionInstance.methods.getEnd().call();

      this.setState({ start: start, end: end });

    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract`,
      );
      console.error(error);
    }
  };

  render() {
    let candidateList;
    console.log(this.state.result);
    if (this.state.result) {
      candidateList = this.state.result.map((candidate) => {
        return (
          <div className="col-xl-3 col-sm-6 mb-5">
            <div className="bg-white rounded shadow-sm py-5 px-4">
              <img
                src={candidateicon}
                alt="candidate's pic"
                width="200"
                height="200"
                className="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"
              />
              <h5 className="mb-0">{candidate.name}</h5>
              <h5 className="mb-0">Total votes: {candidate.voteCount}</h5>
              <span className="small text-uppercase text-muted">
                Party: {candidate.party} <br />
              </span>
              <span className="small text-uppercase text-muted">
                Candidate Id: {candidate.candidateId}
              </span>
            </div>
          </div>
        );
      });
    }


    if (!this.state.web3) {
      return (

        <div >
          {this.state.isOwner ? <NavBarAdmin /> : <NavBarVoter />}
          <div className='p-t-250'>
            <div className="d-flex justify-content-center align-items-center">
              <h2>  Getting Results... </h2>
            </div>
            <div className="d-flex justify-content-center align-items-center" >
              <Bars heigth="100" width="100" color="black" ariaLabel="loading - indicator" />
            </div>
          </div>
        </div >
        // <div>
        //   {this.state.isOwner ? <NavBarAdmin /> : <NavBarVoter />}
        //   <h2>Getting Results...</h2>
        // </div>

      );
    }

    if (!this.state.isOwner) {
      return (
        <div>
          {this.state.isOwner ? <NavBarAdmin /> : <NavBarVoter />}
          <h2>THIS CAN BE ACCESSED BY ADMIN ONLY!</h2>
        </div>
      );
    }


    return (
      <div>
        {this.state.isOwner ? <NavBarAdmin /> : <NavBarVoter />}
        <div className="text-center">
          <h1> RESULTS </h1><br></br>
          <Button onClick={this.result}>See Results</Button>
        </div>

        <br></br>

        <div className="container">
          <div className="row text-center">
            {candidateList}
          </div>
        </div>
      </div>
    );
  }
}

export default Results;