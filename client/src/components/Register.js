import React, { Component } from "react";
import getWeb3 from "../getWeb3";
import ElectionContract from "../contracts/ElectionContract.json";
import NavBarAdmin from "./NavBarAdmin";
import NavBarVoter from "./NavBarVoter";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      web3: null,
      account: null,
      isOwner: false,
      name: "",
      voterId: "",
      errors: {},
    };
  }

  updateName = (event) => {
    this.setState({ name: event.target.value });
  };

  updateVID = (event) => {
    this.setState({ voterId: event.target.value });
  };
  handleValidation() {
    let errors = {};
    let formIsValid = true;

    if (typeof this.state.name !== "undefined") {
      if (!this.state.name.match(/^[a-z ,.'-]+$/i)) {
        formIsValid = false;
        errors["name"] = "Invalid Name";
      }
    }
    if (!this.state.name) {
      formIsValid = false;
      errors["name"] = "Please enter your name";
    }

    if (typeof this.state.voterId !== "undefined") {
      if (!this.state.voterId.match(/^[A-Z]{3}[0-9]{7}$/)) {
        formIsValid = false;
        errors["voterid"] = "Voter ID should be of format ABC1234567";
      }
    }
    if (!this.state.voterId) {
      formIsValid = false;
      errors["voterid"] = "Please provide your voter ID";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  registerVoter = async () => {
    if (this.handleValidation()) {
      await this.state.ElectionInstance.methods
        .registerVoter(this.state.name, this.state.voterId)
        .send({ from: this.state.account, gas: 1000000 });
      window.location.reload(false);
    } else {
      alert("Form validation error!");
    }
  };

  componentDidMount = async () => {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
    try {
      const web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ElectionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ElectionContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({
        ElectionInstance: instance,
        web3: web3,
        account: accounts[0],
      });

      const owner = await this.state.ElectionInstance.methods.getOwner().call();
      if (this.state.account === owner) {
        this.setState({ isOwner: true });
      }

      let voterCount = await this.state.ElectionInstance.methods
        .getVoterCount()
        .call();

      for (let i = 0; i < voterCount; ++i) {
        let voterAddress = await this.state.ElectionInstance.methods
          .voters(i)
          .call();
        if (voterAddress === this.state.account) {
          this.setState({ registered: true });
          break;
        }
      }
    } catch (error) {
      alert(`Failed to connect with Web3!`);
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return (
        <div>
          {this.state.isOwner ? <NavBarAdmin /> : <NavBarVoter />}
          <div
            className="container"
            style={{
              textAlign: "center",
              marginTop: "200px",
            }}
          >
            <h2>Loading...</h2>
          </div>
        </div>
      );
    }

    if (this.state.registered) {
      return (
        <div>
          <NavBarVoter />
          <div
            className="container"
            style={{
              textAlign: "center",
              marginTop: "200px",
            }}
          >
            <h2>Already Requested to Register</h2>
          </div>
        </div>
      );
    }

    return (
      <div>
        <NavBarVoter />
        <div className="page-wrapper bg-gra-01 p-t-100 p-b-100 font-poppins">
          <div className="wrapper wrapper--w780">
            <div className="card card-3">
              <div className="card-body">
                <h2 className="title">Voter Details</h2>
                <div className="form">
                  <div
                    className="input-group"
                    style={{ paddingBottom: "0px", marginBottom: "0px" }}
                  >
                    <input
                      className="input--style-3"
                      type="text"
                      placeholder="Name"
                      value={this.state.name}
                      onChange={this.updateName}
                      style={{ marginBottom: "0px" }}
                    />
                  </div>
                  <div
                    style={{
                      height: "10px",
                      width: "auto",
                      float: "left",
                      display: "block",
                      marginBottom: "20px",
                      marginTop: "10px",
                      marginLeft: "0px",
                      padding: "0px",
                      textAlign: "left"
                    }}
                  >
                    <span style={{ color: "red", paddingLeft: "0px", marginLeft:"0px" }}>
                      {this.state.errors["name"]}
                    </span>
                  </div>
                  <div className="input-group" style={{ paddingBottom: "0px", marginBottom: "0px", marginTop:"30px" }}>
                    <input
                      className="input--style-3"
                      type="text"
                      placeholder="Voter Id (ABC1234567)"
                      value={this.state.voterId}
                      onChange={this.updateVID}
                    />
                  </div>
                  <div
                    style={{
                      height: "10px",
                      width: "auto",
                      float: "left",
                      display: "block",
                      marginBottom: "20px",
                      marginTop: "10px",
                      marginLeft: "0px",
                      padding: "0px",
                      textAlign: "left"
                    }}
                  >
                    <span style={{ color: "red" }}>
                      {this.state.errors["voterid"]}
                    </span>
                  </div>
                  <div style={{clear: "both"}}></div>
                  <div className="p-t-10">
                    <button
                      className="btn  btn--blue"
                      onClick={this.registerVoter}
                    >
                      Request to Add Voter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Register;
