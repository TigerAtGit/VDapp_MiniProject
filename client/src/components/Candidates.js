import React, { Component } from "react";
import ElectionContract from "../contracts/ElectionContract.json";
import getWeb3 from "../getWeb3";
import NavBarAdmin from "./NavBarAdmin";
import NavBarVoter from "./NavBarVoter";
import "../css/candidates.css";
import candidateicon from "../images/candidatepic.jpg";

class Candidates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      candidateCount: 0,
      candidateList: null,
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

      let candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidates()
        .call();
      this.setState({ candidateCount: candidateCount });

      let candidateList = [];
      for (let i = 0; i < candidateCount; i++) {
        let candidate = await this.state.ElectionInstance.methods
          .candidateDetails(i)
          .call();
        candidateList.push(candidate);
      }
      this.setState({ candidateList: candidateList });

      const owner = await this.state.ElectionInstance.methods.getOwner().call();
      if (this.state.account === owner) {
        this.setState({ isOwner: true });
      }
    } catch (error) {
      alert(`Failed to load candidate details!`);
      console.error(error);
    }
  };

  render() {
    let candidateList;
    const sampleJSON = {
      BJP: "BJP.webp",
      AITC: "AITC.png",
      BSP: "BSP.webp",
      CPI: "CPI.png",
      CPIM: "CPI(M).png",
      INC: "INC.webp",
      NCP: "NCP.webp",
      AAP: "AAP.png",
      Others: "other.png"
    };
    if (this.state.candidateList) {
      candidateList = this.state.candidateList.map((candidate) => {
        return (
          <>
            <div
              className="col-md-3"
              style={{
                textAlign: "center",
              }}
              id="rowitem"
            >
              <img
                src={ candidate.imghash === "" ? candidateicon : `https://ipfs.infura.io/ipfs/${candidate.imghash}`}
                alt="Unable to load candidate's image"
                style={{
                  height: "150px",
                  width: "120px",
                }}
              />
            </div>
            <div className="col-md-6" id="rowitem">
              <div className="display-4" id="name">
                {candidate.name}
              </div>
              <div className="row mt-5">
                <div className="col-6 fs-4">Gender: {candidate.gender}</div>
                <div className="col-6 fs-4">Age: {candidate.age}</div>
              </div>
            </div>
            <div
              className="col-md-3"
              style={{
                textAlign: "center",
              }}
              id="rowitem"
            >
              <img
                src={require(`../images/PartyLogo/${sampleJSON[candidate.party]}`)}
                style={{
                  height: "180px",
                  width: "160px",
                }}
              />
            </div>
          </>
        );
      });
    }

    if (!this.state.web3) {
      return (
        <div>
          {this.state.isOwner ? <NavBarAdmin /> : <NavBarVoter />}
          <div className=" d-flex align-items-center justify-content-center">
            <h2>Getting details...</h2>
          </div>
        </div>
      );
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
            <div className="page-wrapper p-t-40 p-b-100 font-poppins">
              <div className="wrapper">
                <div className="card-heading border">
                  <div className="row" id="mainrow">
                    <div className="row" id="insiderow">
                      <div className="row" id="header">
                        <div className="col-md-3">
                          Candidate Image
                        </div>
                        <div className="col-md-6">
                          Candidate Details
                        </div>
                        <div className="col-md-3">
                          Party Logo
                        </div>

                      </div>
                      <div className="row" id="candidatelist">
                        {candidateList}
                      </div>
                    </div>
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

export default Candidates;
