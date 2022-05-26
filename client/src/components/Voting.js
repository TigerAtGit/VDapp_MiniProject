import React, { Component } from "react";
import ElectionContract from "../contracts/ElectionContract.json";
import getWeb3 from "../getWeb3";
import NavBarAdmin from "./NavBarAdmin";
import NavBarVoter from "./NavBarVoter";
import "../css/voting.css";
import candidateicon from "../images/candidatepic.jpg";

class Voting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      candidateList: null,
      candidateId: "",
      // toggle: false,
      myAccount: null,
      start: false,
      end: false,
      isOwner: false,
    };
  }

  updateCandidateId = (event) => {
    this.setState({ candidateId: event.target.value });
  };

  castVote = async (candidateId) => {
    console.log(candidateId);
    await this.state.ElectionInstance.methods
      .castVote(candidateId)
      .send({ from: this.state.account, gas: 1000000 });
    //this.setState({ toggle: false });
    window.location.reload(false);
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

      let myAccount = await this.state.ElectionInstance.methods
        .voterDetails(this.state.account)
        .call();
      this.setState({ myAccount: myAccount });

      let candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidates()
        .call();

      let candidateList = [];
      for (let i = 0; i < candidateCount; i++) {
        let candidate = await this.state.ElectionInstance.methods
          .candidateDetails(i)
          .call();
        candidateList.push(candidate);
      }
      this.setState({ candidateList: candidateList });

      let start = await this.state.ElectionInstance.methods.getStart().call();
      let end = await this.state.ElectionInstance.methods.getEnd().call();

      this.setState({ start: start, end: end });

      const owner = await this.state.ElectionInstance.methods.getOwner().call();
      if (this.state.account === owner) {
        this.setState({ isOwner: true });
      }
    } catch (error) {
      alert(`Failed to load candidates!`);
      console.error(error);
    }
  };

  render() {
    let candidateList;
    if (this.state.candidateList) {
      candidateList = this.state.candidateList.map((candidate) => {
        return (
          <div className="col-md-4">
            <div className="bg-white rounded shadow-sm py-5 px-4 mb-4">
              <img
              style={{height:200, width:200}}
                src={candidate.imghash === "" ? candidateicon : `https://ipfs.infura.io/ipfs/${candidate.imghash}`}
                alt="candidate's pic"
                width="200"
                height="200"
                className="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"
              />
              <h5 className="mb-0">{candidate.name}</h5>
              <span className="small text-uppercase text-muted">
                Party: {candidate.party} <br />
              </span>
              <span className="small text-uppercase text-muted">
                Candidate Id: {candidate.candidateId}
              </span>
              <div className="p-t-10">
                <button
                  className="btn  btn--blue"
                  onClick={() => this.castVote(candidate.candidateId)}
                >
                  Vote
                </button>
              </div>
            </div>
          </div>
        );
      });
    }

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
            <h2>Loading candidates...</h2>
          </div>
        </div>
      );
    }

    if (this.state.end) {
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
            <h2>VOTING HAS ENDED!</h2>
          </div>
        </div>
      );
    }

    if (!this.state.start) {
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
            <h1>VOTING HAS NOT STARTED YET</h1>
          </div>
        </div>
      );
    }

    if (this.state.myAccount) {
      if (!this.state.myAccount.isVerified) {
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
              <h2 className="text-center">YOU ARE NOT VERFIED TO VOTE</h2>
              <h5 className="text-center">
                If you have registered kindly wait to be verified.
              </h5>
            </div>
          </div>
        );
      }
    }

    if (this.state.myAccount) {
      if (this.state.myAccount.hasVoted) {
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
              <h2>YOU HAVE SUCCESSFULLY CASTED YOUR VOTE</h2>
            </div>
          </div>
        );
      }
    }

    return (
      <div>
        {this.state.isOwner ? <NavBarAdmin /> : <NavBarVoter />}
        <br></br>
        <br></br>
        <div className="container">
          <div className="row text-center">{candidateList}</div>
        </div>
      </div>
    );
  }
}

export default Voting;
