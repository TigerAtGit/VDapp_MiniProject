import React, { Component } from "react";
import getWeb3 from "../getWeb3";
import ElectionContract from "../contracts/ElectionContract.json";
import "../App.css";
import NavBarAdmin from "./NavBarAdmin";
import NavBarVoter from "./NavBarVoter";
import "../css/homepage.css";
class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      web3: null,
      account: null,
      isOwner: false,
    };
  }

  componentDidMount = async () => {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
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
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        ElectionInstance: instance,
        web3: web3,
        account: accounts[0],
      });

      const owner = await this.state.ElectionInstance.methods.getOwner().call();
      if (this.state.account === owner) {
        this.setState({ isOwner: true });
      }

      let start = await this.state.ElectionInstance.methods.getStart().call();
      let end = await this.state.ElectionInstance.methods.getEnd().call();

      this.setState({ start: start, end: end });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return (
        <div>
          {this.state.isOwner ? <NavBarAdmin /> : <NavBarVoter />}
          <h2>Connecting to Web3...</h2>
        </div>
      );
    }
    return (
      <div className="App">
        {this.state.isOwner ? <NavBarAdmin /> : <NavBarVoter />}
        <div className="container py-4">
          <div className="text-center text-white">
            <div className="col-lg-8 mx-auto">
              <h1 className="display-4">Welcome To VDapp</h1>
            </div>
          </div>
        </div>
        <div class="container-fluid" id="about">
          <div class="row">
            <div class="col-md-6">
              <div>
                VDapp is a e-voting Dapp made using blockchain and React.
              </div>
              Why do we need it?
              <br />
              Current voting systems like ballot box voting or electronic voting suffer from various 
              security threats such as DDoS attacks, polling booth capturing, vote alteration and 
              manipulation, malware attacks, etc, and also require huge amounts of paperwork, human 
              resources, and time. This creates a sense of distrust among existing systems.
            </div>
            <div class="col-md-6">
              <div 
              style={{
                textAlign: "center"
              }}
              >
                {/* <img src="../images/Mobilevoting" style="width: 100%; height: auto;" /> */}
                <img
                  src={require("../images/Mobilevoting.jpg")}
                  style={{
                    width: "80%",
                    height: "auto",
                    textAlign: "center"
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid" id="footer">
          <h5>Your user address is {this.state.account}</h5>
        </div>
      </div>
    );
  }
}

export default Homepage;
