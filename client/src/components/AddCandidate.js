import React, { Component } from "react";
import "../css/addcandidate.css";
import ElectionContract from "../contracts/ElectionContract.json";
import getWeb3 from "../getWeb3";
import ipfs from "../ipfs";
import NavBarAdmin from "./NavBarAdmin";
import NavBarVoter from "./NavBarVoter";
import { Bars } from 'react-loader-spinner';

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
      party: "",
      age: null,
      gender: "",
      uniqueId: null,
      // uploadedImage: null,
      // imageUploader: null,
      candidates: null,
      isOwner: false,
    };
    this.captureFile = this.captureFile.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
  }

  captureFile(event) {
    console.log('Capturing...');
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log('buffer', this.state.buffer)
    }
  }

  uploadImage(event) {
    console.log('Uploading..');
    ipfs.files.add(this.state.buffer, (err, result) => {
      if (err) {
        console.log(err);
        return
      }
      this.setState({ ipfsHash: result[0].hash });
      console.log('ipfsHash', this.state.ipfsHash);
    })
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


  // uploadedImage = React.useRef(null);
  // imageUploader = React.useRef(null);

  // handleImageUpload = e => {
  //   const [file] = e.target.files;
  //   if (file) {
  //     const reader = new FileReader();
  //     const { current } = uploadedImage;
  //     current.file = file;
  //     reader.onload = e => {
  //       current.src = e.target.result;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };


  addCandidate = async () => {
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
    } catch (error) {
      alert("Failed to connect with web3!");
      console.log(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return (
        <div >
          {this.state.isOwner ? <NavBarAdmin /> : <NavBarVoter />}
          <div className='p-t-250'>
            <div className="d-flex justify-content-center align-items-center">
              <h2>    Connecting to Web3...</h2>
            </div>
            <div className="d-flex justify-content-center align-items-center" >
              <Bars heigth="100" width="100" color="black" ariaLabel="loading - indicator" />
            </div>
          </div>
        </div >
      );
    }

    if (!this.state.isOwner) {
      return (
        <div>
          {this.state.isOwner ? <NavBarAdmin /> : <NavBarVoter />}
          <h2>THIS CAN BE ACCESSED BY ADMIN ONLY!</h2>
        </div>
      );
    }

    return (
      <div>
        {this.state.isOwner ? <NavBarAdmin /> : <NavBarVoter />}
        <div className="page-wrapper bg-gra-01 p-t-100 p-b-100 font-poppins">
          <div className="wrapper wrapper--w780">
            <div className="card bg-secondary">
              <div className="card-heading"></div>
              <div className="card-body">
                <h2 className="title">Add Candidate</h2>
                <div className="form">
                  <div className="row">
                    <div className="col-md-4">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <input
                          type="file"
                          onChange={this.captureFile}
                        />
                        <div
                          style={{
                            height: "250px",
                            width: "200px",
                            border: "1px dashed black"
                          }}
                        >
                          <img
                            src={`https://ipfs.infura.io/ipfs/${this.state.ipfsHash}`}
                            alt="Uploaded image"
                            style={{
                              width: "200px",
                              height: "250px",
                              position: "absolute"
                            }}
                          />
                        </div>
                        <button
                          className="btn btn--blue"
                          onClick={this.uploadImage}>
                          Upload Photo
                        </button>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="input-group">
                        <input
                          className="input--style-3"
                          type="text"
                          placeholder="Name"
                          value={this.state.name}
                          onChange={this.updateName}
                        />
                      </div>
                      <div className="input-group">
                        <input
                          className="input--style-3"
                          type="text"
                          placeholder="Age"
                          value={this.state.age}
                          onChange={this.updateAge}
                        />
                      </div>
                      <div className="input-group">
                        <input
                          className="input--style-3"
                          type="text"
                          placeholder="Gender"
                          value={this.state.gender}
                          onChange={this.updateGender}
                        />
                      </div>
                      <div className="input-group">
                        <input
                          className="input--style-3"
                          type="number"
                          placeholder="Unique Id"
                          value={this.state.uniqueId}
                          onChange={this.getUID}
                        />
                      </div>
                      <div className="input-group">
                        <input
                          className="input--style-3 js-datepicker"
                          type="text"
                          placeholder="Party"
                          value={this.state.party}
                          onChange={this.updateParty}
                        />
                        <i className="zmdi zmdi-calendar-note input-icon js-btn-calendar"></i>
                      </div>
                      <div className="p-t-10">
                        <button
                          className="btn btn--pill btn--green"
                          onClick={this.addCandidate}
                        >
                          ADD
                        </button>
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

export default AddCandidate;
