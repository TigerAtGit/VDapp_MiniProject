import React, { Component } from "react";
import "../css/addcandidate.css";
import ElectionContract from "../contracts/ElectionContract.json";
import getWeb3 from "../getWeb3";
import ipfs from "../ipfs";
import NavBarAdmin from "./NavBarAdmin";
import NavBarVoter from "./NavBarVoter";
import candidateicon from "../images/candidatepic.jpg";

class AddCandidate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      buffer: null,
      ipfsHash: "",
      name: "",
      party: "Others",
      age: null,
      gender: "",
      uniqueId: null,
      candidateIDs: null,
      isOwner: false,
      errors: {},
    };
    this.captureFile = this.captureFile.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
  }

  captureFile(event) {
    console.log("Capturing...");
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };
  }

  uploadImage(event) {
    console.log("Uploading..");
    ipfs.files.add(this.state.buffer, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      this.setState({ ipfsHash: result[0].hash });
      // console.log("ipfsHash", this.state.ipfsHash);
    });
  }

  updateName = (event) => {
    this.setState({ name: event.target.value });
  };
  updateAge = (event) => {
    this.setState({ age: event.target.value });
  };
  updateGender = (event) => {
    this.setState({ gender: event.target.value });
  };
  updateParty = (event) => {
    this.setState({ party: event.target.value });
  };
  getUID = (event) => {
    this.setState({ uniqueId: event.target.value });
  };
  setGender = (event) => {
    this.setState({ gender: event.target.value });
  }

  handleValidation() {
    let errors = {};
    let formIsValid = true;

    if (typeof this.state.name !== "undefined") {
      if (!this.state.name.match(/^[a-z ,.'-]+$/i)) {
        formIsValid = false;
        errors["name"] = "Invalid name";
      }
    }
    if (!this.state.name) {
      formIsValid = false;
      errors["name"] = "*This field cannot be empty";
    }

    if (this.state.uniqueId < 9999) {
      formIsValid = false;
      errors["uniqueid"] = "Id must be of atleast 5 digits";
    }
    if (!this.state.uniqueId) {
      formIsValid = false;
      errors["uniqueid"] = "*This field cannot be empty";
    }
    
    if (this.state.age > 100) {
      formIsValid = false;
      errors["age"] = "Age must be less than 100";
    }
    if (this.state.age < 18) {
      formIsValid = false;
      errors["age"] = "Age must be atleast 18";
    }
    if (!this.state.age) {
      formIsValid = false;
      errors["age"] = "*This field cannot be empty";
    }

    if (!this.state.gender) {
      formIsValid = false;
      errors["gender"] = "*Please select gender";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  addCandidate = async () => {
    if (this.handleValidation()) {
      this.state.candidateIDs.some(item => this.state.uniqueId === item) ? 
      alert("Candidate with same ID has been already added!"):
      await this.state.ElectionInstance.methods
        .addCandidate(
          this.state.name,
          this.state.party,
          this.state.gender,
          this.state.age,
          this.state.uniqueId,
          this.state.ipfsHash
        )
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

      let candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidates()
        .call();
      this.setState({ candidateCount: candidateCount });

      let candidateIDs = [];
      for (let i = 0; i < candidateCount; i++) {
        let candidate = await this.state.ElectionInstance.methods
          .candidateDetails(i)
          .call();
        candidateIDs.push(candidate.uniqueId);
      }
      this.setState({ candidateIDs: candidateIDs });
      // console.log(candidateIDs);

      const owner = await this.state.ElectionInstance.methods.getOwner().call();
      if (this.state.account === owner) {
        this.setState({ isOwner: true });
      }
    } catch (error) {
      alert("Failed to connect with web3!");
      console.log(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return (
        <div>
          <NavBarAdmin />
          <div
            className="container"
            style={{
              textAlign: "center",
              marginTop: "200px",
            }}
          >
            <h2>Connecting to Web3...</h2>
          </div>
        </div>
      );
    }

    if (!this.state.isOwner) {
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
            <h2>THIS CAN BE ACCESSED BY ADMIN ONLY!</h2>
          </div>
        </div>
      );
    }


    return (
      <div>
        <NavBarAdmin />
        <div className="page-wrapper bg-gra-01 p-t-50 font-poppins">
          <div className="wrapper wrapper--w780">
            <div className="card bg-secondary">
              <div className="card-heading title text-center p-2">
                Add Candidate
              </div>
              <div className="card-body">
                <div className="form">
                  <div className="row">
                    <div className="col-md-4">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <input type="file" onChange={this.captureFile} />
                        <div
                          style={{
                            height: "250px",
                            width: "200px",
                            border: "1px dashed black",
                          }}
                        >
                          <img
                            src={
                              this.state.ipfsHash === ""
                                ? candidateicon
                                : `https://ipfs.infura.io/ipfs/${this.state.ipfsHash}`
                            }
                            alt="Uploaded file"
                            style={{
                              width: "200px",
                              height: "250px",
                              position: "absolute",
                            }}
                          />
                        </div>
                        <button
                          className="btn btn--blue"
                          onClick={this.uploadImage}
                        >
                          Upload Photo
                        </button>
                      </div>
                    </div>
                    <div className="col-md-8">
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
                        />
                      </div>
                      <span style={{ color: "#FF9494", fontWeight: "bold" }}>
                        {this.state.errors["name"]}
                      </span>

                      <div
                        className="input-group"
                        style={{
                          paddingBottom: "0px",
                          marginBottom: "0px",
                          marginTop: "20px",
                        }}
                      >
                        <input
                          className="input--style-3"
                          type="number"
                          placeholder="Age"
                          value={this.state.age}
                          onChange={this.updateAge}
                        />
                      </div>
                      <span style={{color: "#FF9494", fontWeight: "bold" }}>
                        {this.state.errors["age"]}
                      </span>

                      <div
                        className="input-group"
                        style={{
                          paddingBottom: "0px",
                          marginBottom: "0px",
                          marginTop: "20px",
                        }}
                      >
                        <input
                          className="input--style-3"
                          type="number"
                          placeholder="Unique Id"
                          value={this.state.uniqueId}
                          onChange={this.getUID}
                        />
                      </div>
                      <span style={{ color: "#FF9494", fontWeight: "bold" }}>
                        {this.state.errors["uniqueid"]}
                      </span>
                      <div
                        className="input-group"
                        style={{
                          borderWidth: "0px",
                          paddingBottom: "0px",
                          marginBottom: "0px",
                          marginTop: "20px",
                        }}
                      >
                        <div
                          style={{
                            color: "white",
                            paddingTop: "8px",
                            fontSize: "110%",
                            paddingRight: "8px",
                          }}
                        >
                          Gender:
                        </div>
                        <div onChange={this.setGender.bind(this)}>
                          <div
                            style={{
                              height: "30px",
                              width: "20px",
                              float: "left",
                              display: "block",
                              paddingTop: "10px",
                            }}
                          >
                            <input type="radio" value="Male" name="gender" />
                          </div>
                          <div
                            style={{
                              color: "white",
                              paddingTop: "7px",
                              fontSize: "110%",
                              paddingRight: "8px",
                              paddingLeft: "4px",
                              float: "left",
                              display: "block",
                            }}
                          >
                            Male
                          </div>
                          <div
                            style={{
                              height: "30px",
                              width: "20px",
                              float: "left",
                              display: "block",
                              paddingTop: "10px",
                            }}
                          >
                            <input type="radio" value="Female" name="gender" />
                          </div>
                          <div
                            style={{
                              color: "white",
                              paddingTop: "7px",
                              fontSize: "110%",
                              paddingRight: "8px",
                              paddingLeft: "4px",
                              float: "left",
                              display: "block",
                            }}
                          >
                            Female
                          </div>
                          <div
                            style={{
                              height: "30px",
                              width: "20px",
                              float: "left",
                              display: "block",
                              paddingTop: "10px",
                            }}
                          >
                            <input type="radio" value="Others" name="gender" />
                          </div>
                          <div
                            style={{
                              color: "white",
                              paddingTop: "7px",
                              fontSize: "110%",
                              paddingRight: "8px",
                              paddingLeft: "4px",
                              float: "left",
                              display: "block",
                            }}
                          >
                            Others
                          </div>
                        </div>
                      </div>
                      <span style={{ color: "#FF9494", fontWeight: "bold" }}>
                        {this.state.errors["gender"]}
                      </span>
                      <div
                        className="input-group"
                        style={{ borderWidth: "0px", marginTop: "20px" }}
                      >
                        <div
                          style={{
                            color: "white",
                            paddingTop: "8px",
                            fontSize: "110%",
                            paddingRight: "8px",
                          }}
                        >
                          Select Party
                        </div>
                        <select
                          value={this.state.party}
                          onChange={this.updateParty}
                          style={{
                            backgroundColor: "#222222",
                            color: "white",
                            padding: "2%",
                            fontSize: "110%",
                          }}
                        >
                          <option name="bjp" value="BJP">
                            BJP
                          </option>
                          <option name="inc" value="INC">
                            INC
                          </option>
                          <option name="ncp" value="NCP">
                            NCP
                          </option>
                          <option name="aitc" value="AITC">
                            AITC
                          </option>
                          <option name="bsp" value="BSP">
                            BSP
                          </option>
                          <option name="cpi" value="CPI">
                            CPI
                          </option>
                          <option name="cpim" value="CPIM">
                            CPI(M)
                          </option>
                          <option name="aap" value="AAP">
                            AAP
                          </option>
                          <option name="others" value="Others">
                            Others
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-grid gap-2 col-6 mx-auto p-2">
                <button
                  className="btn btn--pill btn--green"
                  onClick={this.addCandidate}
                >
                  ADD CANDIDATE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddCandidate;
