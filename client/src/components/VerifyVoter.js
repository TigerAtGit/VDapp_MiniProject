import React, { Component } from 'react';
import getWeb3 from "../getWeb3";
import ElectionContract from "../contracts/ElectionContract.json";
import NavBarAdmin from './NavBarAdmin';
import NavBarVoter from './NavBarVoter';
import { Navbar } from 'react-bootstrap';

class VerifyVoter extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ElectionInstance: undefined,
      web3: null,
      account: null,
      isOwner: false
    };
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

      const owner = await this.state.ElectionInstance.methods.getOwner().call();
      if (this.state.account === owner) {
        this.setState({ isOwner: true })
      }

      let start = await this.state.ElectionInstance.methods.getStart().call();
      let end = await this.state.ElectionInstance.methods.getEnd().call();

      this.setState({ start: start, end: end })


    } catch (error) {
      alert(
        `Failed to connect with Web3!`,
      );
      console.error(error);
    }
  };




  render() {


    return (
      <div>
        {this.state.isOwner ? <NavBarAdmin /> : <NavBarVoter />}
        <div className="container m-t-50">
          <div className="row text-center">


            <div className="col-xl-3 col-sm-6 mb-5 ">
              <div className="bg-black rounded shadow-sm ">

                <div className="card-body">
                  <div className="p-t-20">
                    <h2 className="title">Kush</h2>
                  </div>
                  <span className="subtitle">
                    Addhar <br />
                  </span>
                  <span className="subtitle ">
                    9222 2020 0239 2343<br />
                  </span>
                  <div className="p-t-20">
                    <span className="subtitle ">
                      Voter address:<br />
                      <span classname='subtitle'> sdsdfafgsdfgsdfgdfsfsdfsdfsdf<br />
                      </span>
                    </span>
                  </div>
                  <div className="p-t-50 p-b-20">
                    <button className="btn  btn--blue" onClick={this.castVote} >
                      Verify Voter
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
        {/* <div className="page-wrapper bg-gra-01 p-t-100 p-b-100 font-poppins">
          <div className="wrapper wrapper--w680">
            <div className="card card-3">
              <div className="card-body">
                <h2 className="title">Kush</h2>
                <span className="subtitle">
                  Addhar :  9222 2020 0239 2343<br />
                </span>
                <span className="subtitle">
                  Voter address:<span classname='subtitle-light'> sdsdfafgsdfgsdfgdfsfsdfsdfsdf </span> <br />
                </span>
                <div className="p-t-50">
                  <button className="btn  btn--blue" onClick={this.castVote} >
                    Verify Voter
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div> */}
      </div >
    )
  }
}
export default VerifyVoter;
