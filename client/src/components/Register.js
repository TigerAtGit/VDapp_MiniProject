import React, { Component } from 'react';
import getWeb3 from "../getWeb3";
import ElectionContract from "../contracts/ElectionContract.json";
import NavBarAdmin from './NavBarAdmin';
import NavBarVoter from './NavBarVoter';

class Register extends Component {

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
        this.setState({ isOwner: true })
      }

      let start = await this.state.ElectionInstance.methods.getStart().call();
      let end = await this.state.ElectionInstance.methods.getEnd().call();

      this.setState({ start: start, end: end })


    } catch (error) {
      alert(
        `Failed to connect with Web3!`,
      );
      console.error(error);
    }
  };

  render(){
    return(
      <div>
        {this.state.isOwner ? <NavBarAdmin /> : <NavBarVoter />}
        <h2>Register Request</h2>
      </div>
    )
  }
}
export default Register;
