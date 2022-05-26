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
                  height: "160px",
                  width: "130px",
                }}
              />
            </div>
            <div className="col-md-6" id="rowitem">
              <div className="display-6" id="name">
                {candidate.name}
              </div>
              <div className="row mt-4">
                <div className="col-6 fs-5">Gender: {candidate.gender}</div>
                <div className="col-6 fs-5">Age: {candidate.age}</div>
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
                  height: "120px",
                  width: "90px",
                }}
              />
              <p className="fs-5 mt-2">{candidate.party}</p>
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
            <div className="container"
            style={{
              textAlign: "center",
              marginTop: "200px"
            }}
            >
              <h2>Getting Candidates details...</h2>
            </div>
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
              <h1 className="display-5 text-dark">List of Candidates</h1>
              <h3 className="text-black-50">Total candidates: {this.state.candidateCount}</h3>
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
                      <div className="row fs-3" id="header">
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
