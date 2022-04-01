import React, { Component } from 'react';
import getWeb3 from "../getWeb3";
import ElectionContract from "../contracts/ElectionContract.json";
import "../App.css";
import NavBarAdmin from './NavBarAdmin';
import NavBarVoter from './NavBarVoter';

class Homepage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ElectionInstance: undefined,
      web3: null,
      account: null,
      isOwner: false
    };
  }


  componentDidMount = async () => {

    if (!window.location.hash) {
      window.location = window.location + '#loaded';
      window.location.reload();
    }
    try {
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ElectionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ElectionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ ElectionInstance: instance, web3: web3, account: accounts[0] });

      const owner = await this.state.ElectionInstance.methods.getOwner().call();
      if (this.state.account === owner) {
        this.setState({ isOwner: true })
      }

      let start = await this.state.ElectionInstance.methods.getStart().call();
      let end = await this.state.ElectionInstance.methods.getEnd().call();

      this.setState({ start: start, end: end })


    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return (
      <div>
        {this.state.isOwner ? <NavBarAdmin/> : <NavBarVoter/>}
        <h2>Connecting to Web3...</h2>
      </div>
      );
    }
    return (
      <div className='App'>
        {this.state.isOwner ? <NavBarAdmin/> : <NavBarVoter/>}
        <div>
          <h1>WELCOME TO VDAPP</h1>
        </div>
        <div>
          Your user address is {this.state.account}
        </div>
        {this.state.isOwner ?
          <div>
            <h3>You are ADMIN</h3>
          </div> :
          <div>
            <h3>You are NOT ADMIN</h3>
          </div>
        }
      </div>
    );
  }
}

export default Homepage;