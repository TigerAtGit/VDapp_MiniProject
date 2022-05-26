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
          <div className="container"
          style={{
            textAlign: "center",
            marginTop: "200px"
          }}
          >
            <h2>Connecting to Web3...</h2>
          </div>
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
              <b>VDapp</b> is a decentralized e-voting application developed using Blockchain.
            </div>
          </div>
        </div>
        <div class="container-fluid" id="about">
          <div class="row">
            <div class="col-md-6 fs-4">
              {/* <div>
                <b>VDapp</b> is a decentralized e-voting application developed using Blockchain.
              </div><br></br> */}
              <i><b>Why do we need it?</b></i>
              <br /><i>
              E-voting system can be used to conduct secure and efficient elections for a 
              large population with minimal efforts. Blockchain guarantees the security 
              and protection of the voters’ identity and the votes. Thus,
              building the trust in the electoral system.</i>
            </div>
            <div class="col-md-6">
              <div 
              style={{
                textAlign: "center"
              }}
              >
                <img
                  src={require("../images/Mobilevoting.jpg")}
                  alt="Voting Icon"
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
          <h5>Your account address is {this.state.account} {this.state.isOwner ? <p>(Admin)</p> : <p></p>}</h5>
        </div>
      </div>
    );
  }
}

export default Homepage;
