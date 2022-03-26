import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import getWeb3 from "./getWeb3";
import ElectionContract from "./contracts/ElectionContract.json";
import Navbar from './components/Navbar/NavBar';
import Home from './pages/admin/home';
import Candidates from './pages/admin/Candidates';
import Verifyvoter from './pages/admin/Verifyvoter';
import Addcandidates from './pages/admin/Addcandidates';
import Phase from './pages/admin/Phase';
import Results from './pages/admin/Results';

import "./App.css";

class App extends Component {

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
      console.log(accounts[0]);

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
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    return (
      // <div>
      //   Hello Piyush!
      //   <div>
      //     your user address is {this.state.account}
      //   </div>
      //   {this.state.isOwner ?
      //     <div>Yes you are the owner</div> :
      //     <div>No you are not the owner</div>
      //   }

      // </div>
      <Router>
      <Navbar />
      <Switch>
        <Route path='/home' exact component={Home} />
        <Route path='/candidates' component={Candidates} />
        <Route path='/verify-voter' component={Verifyvoter} />
        <Route path='/add-candidate' component={Addcandidates} />
        <Route path='/results' component={Results} />
        <Route path='/phase' component={Phase} />
      </Switch>
    </Router>
    );
  }
}

export default App;
