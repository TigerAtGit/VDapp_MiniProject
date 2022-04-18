import React, { Component } from "react";
import ElectionContract from "../contracts/ElectionContract.json";
import getWeb3 from "../getWeb3";
import NavBarAdmin from './NavBarAdmin';
import NavBarVoter from './NavBarVoter';
import "../css/candidates.css";
import candidateicon from "../images/candidatepic.jpg";

class Candidates extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      candidateCount: 0,
      candidateList: null,
      isOwner: false
    }
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

      let candidateCount = await this.state.ElectionInstance.methods.getTotalCandidates().call();
      this.setState({ candidateCount: candidateCount });

      let candidateList = [];
      for (let i = 0; i < candidateCount; i++) {
        let candidate = await this.state.ElectionInstance.methods.candidateDetails(i).call();
        candidateList.push(candidate);
      }
      this.setState({ candidateList: candidateList });

      const owner = await this.state.ElectionInstance.methods.getOwner().call();
      if (this.state.account === owner) {
        this.setState({ isOwner: true })
      }

    } catch (error) {
      alert(
        `Failed to load candidate details!`,
      );
      console.error(error);
    }
  };

  render() {
    let candidateList;
    if (this.state.candidateList) {
      candidateList = this.state.candidateList.map((candidate) => {
        return (
          <div className="card-heading border">
            <div className="row" id="mainrow">
              <div className="row" id="insiderow">
                <div
                  className="col-md-3"
                  style={{
                    textAlign: "center",
                  }}
                >
                  <img
                    src={`https://ipfs.infura.io/ipfs/${candidate.imghash}`}
                    style={{
                      height: "150px",
                      width: "120px",
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <div className="title" id="name">
                    {candidate.name}
                  </div>
                  <div className="row">
                    <div className="col-6">Gender: {candidate.gender}</div>
                    <div className="col-6">Age: {candidate.age}</div>
                  </div>
                </div>
                <div
                  className="col-md-3"
                  style={{
                    textAlign: "center",
                  }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/1200px-Bharatiya_Janata_Party_logo.svg.png"
                    style={{
                      height: "150px",
                      width: "120px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          // <div className="col-2xl-3 col-sm-6 mb-5">
          //   <div className="bg-white rounded shadow-sm py-5 px-4">
          //     <img
          //       src={`https://ipfs.infura.io/ipfs/${candidate.imghash}`}
          //       alt="candidate's pic"
          //       width="200"
          //       height="200"
          //       className="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"
          //     />
          //     <h5 className="mb-0">{candidate.name}</h5>
          //     <span className="small text-uppercase text-muted">
          //       Party: {candidate.party} <br />
          //     </span>
          //     <span className="small text-uppercase text-muted">
          //       Candidate Id: {candidate.candidateId}
          //     </span>
          //   </div>
          // </div>

        );
      });
    }

    if (!this.state.web3) {
      return (
        <div >
          {this.state.isOwner ? <NavBarAdmin /> : <NavBarVoter />}
          <div className=" d-flex align-items-center justify-content-center">
            <h2>Getting details...</h2>

          </div>
        </div>
      )
    }
    return (
      <div>
        {this.state.isOwner ? <NavBarAdmin /> : <NavBarVoter />}
        <div className="container py-5">
          <div className="row text-center text-white">
            <div className="col-lg-8 mx-auto">
              <h1 className="display-4">List of Candidates</h1>
              <h3>Total candidates: {this.state.candidateCount}</h3>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row text-center">
            <div className="page-wrapper p-t-100 p-b-100 font-poppins">
              <div className="wrapper">
                {candidateList}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Candidates;
