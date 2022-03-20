import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import ElectionContract from "./contracts/ElectionContract.json";

import "./App.css";

class App extends Component {
  
  constructor(props){
    super(props)
    this.state = { ElectionInstance: undefined, web3: null, accounts: null, isOwner: false };

  }

  
  componentDidMount = async () => {
    try {

      // FOR REFRESHING PAGE ONLY ONCE -
      // if(!window.location.hash){
      //   window.location = window.location + '#loaded';
      //   window.location.reload();
      //   }
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      // const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ElectionContract.abi,
        // deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ ElectionInstance: instance, web3: web3, accounts: accounts[0] });

    const owner = await this.state.ElectionInstance.methods.getOwner().call();
    if(this.state.account == owner){
      this.setState({isOwner : true})
    }

    let start = await this.state.ElectionInstance.methods.getStart().call();
    let end = await this.state.ElectionInstance.methods.getEnd().call();

    this.setState({start : start, end : end })


    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        Hello
        <div>
          your user address is {this.state.account}
        </div>
        {this.state.isOwner?
        <div>Yes you are the owner</div> :
        <div>No you are not the owner</div>
        }

      </div>
    );
  }
}

export default App;
