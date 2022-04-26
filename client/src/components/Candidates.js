import React, { Component } from "react";
import ElectionContract from "../contracts/ElectionContract.json";
import getWeb3 from "../getWeb3";
import NavBarAdmin from "./NavBarAdmin";
import NavBarVoter from "./NavBarVoter";
import "../css/candidates.css";
// import "../images/PartyLogo/"
import partyimages from "../PartyImages.json";
import candidateicon from "../images/candidatepic.jpg";

class Candidates extends Component {
  constructor(props) {
    super(props);
    const sampleJSON = {
      BJP: "./images/PartyLogo/BJP.webp",
      AITC: "./images/PartyLogo/AITC.png",
      BSP: "./images/PartyLogo/BSP.webp",
      CPI: "./images/PartyLogo/CPI.png",
      "CPI(M)": "./images/PartyLogo/CPI(M).png",
      INC: "./images/PartyLogo/INC.webp",
      NCP: "./images/PartyLogo/NCP.webp",
      NPP: "./images/PartyLogo/NPP.jpg",
    };

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
      const sampleJSON = {
        BJP: "./images/PartyLogo/BJP.webp",
        AITC: "./images/PartyLogo/AITC.png",
        BSP: "./images/PartyLogo/BSP.webp",
        CPI: "../../images/PartyLogo/CPI.png",
        "CPI(M)": "./images/PartyLogo/CPI(M).png",
        INC: "./images/PartyLogo/INC.webp",
        NCP: "./images/PartyLogo/NCP.webp",
        NPP: "./images/PartyLogo/NPP.jpg",
      };

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
      BJP: "webp",
      AITC: "png",
      BSP: "webp",
      CPI: "png",
      "CPI(M)": "png",
      INC: "webp",
      NCP: "webp",
      NPP: "jpg",
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
                src={`https://ipfs.infura.io/ipfs/${candidate.imghash}`}
                style={{
                  height: "150px",
                  width: "120px",
                }}
              />
            </div>
            <div className="col-md-6" id="rowitem">
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
              id="rowitem"
            >
              <img
                src={require(`../images/PartyLogo/${candidate.party}.${
                  sampleJSON[candidate.party]
                }`)}
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
