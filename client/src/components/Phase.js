import React, { Component } from "react";
import ElectionContract from "../contracts/ElectionContract.json";
import getWeb3 from "../getWeb3";
import NavBarAdmin from "./NavBarAdmin";
import NavBarVoter from "./NavBarVoter";
import { Button } from 'react-bootstrap';
import "../css/candidates.css";
import { Bars } from 'react-loader-spinner'

class Phase extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isOwner: false,
      start: false,
      end: false
    }
  }

  startElection = async () => {
    await this.state.ElectionInstance.methods.startElection().send(
      { from: this.state.account, gas: 1000000 }
    );
    window.location.reload(false);
  }

  endElection = async () => {
    await this.state.ElectionInstance.methods.endElection().send(
      { from: this.state.account, gas: 1000000 }
    );
    window.location.reload(false);
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
        `Failed to connect with Web3!`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return (

        <div >
          {this.state.isOwner ? <NavBarAdmin /> : <NavBarVoter />}
          <div className='p-t-250'>
            <div className="d-flex justify-content-center align-items-center">
              <h2>  Connecting to Web3... </h2>
            </div>
            <div className="d-flex justify-content-center align-items-center" >
              <Bars heigth="100" width="100" color="black" ariaLabel="loading - indicator" />
            </div>
          </div>
        </div >
        // <div>
        //   {this.state.isOwner ? <NavBarAdmin /> : <NavBarVoter />}
        //   <h2>Connecting to Web3...</h2>
        // </div>
      );
    }

    if (!this.state.isOwner) {
      return (
        <div>
          {this.state.isOwner ? <NavBarAdmin /> : <NavBarVoter />}
          <h1>THIS CAN BE ACCESSED BY ADMIN ONLY!</h1>
        </div>
      );
    }
    return (
      <div>
        {this.state.isOwner ? <NavBarAdmin /> : <NavBarVoter />}
        <div className="h-100 d-flex justify-content-center align-items-center">
          {this.state.start
            ? <Button onClick={this.startElection} className="btn btn-lg btn-warning mt-4">Start Election</Button>
            : <Button onClick={this.startElection} className="btn btn-lg btn-success mt-4">Start Election</Button>
          }
          {this.state.end
            ? <Button onClick={this.endElection} className="btn btn-lg btn-secondary mt-4 mx-4">End Election</Button>
            : <Button onClick={this.endElection} className="btn btn-lg btn-danger mt-4 mx-4">End Election</Button>
          }
        </div>
      </div>
    );
  }
}

export default Phase;
