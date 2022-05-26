import React, { Component } from 'react';
import getWeb3 from "../getWeb3";
import ElectionContract from "../contracts/ElectionContract.json";
import NavBarAdmin from './NavBarAdmin';
import NavBarVoter from './NavBarVoter';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';


class VerifyVoter extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ElectionInstance: undefined,
      web3: null,
      account: null,
      isOwner: false,
      voterList: null
    };
  }

  verifyVoter = async event => {
    await this.state.ElectionInstance.methods.verifyVoter(event.target.value).send({ from: this.state.account, gas: 1000000 });
    window.location.reload(false);
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

      let voterCount = await this.state.ElectionInstance.methods.getVoterCount().call();
      let voterList = [];

      for (let i = 0; i < voterCount; ++i) {
        let voterAddress = await this.state.ElectionInstance.methods.voters(i).call();
        let voterDetails = await this.state.ElectionInstance.methods.voterDetails(voterAddress).call();
        voterList.push(voterDetails);
      }
      this.setState({ voterList: voterList });

    } catch (error) {
      alert(
        `Failed to connect with Web3!`,
      );
      console.error(error);
    }
  };


  render() {
    let voterList;
    if (this.state.voterList) {
      voterList = this.state.voterList.map((voter) => {
        return (
          <Card className="text-center mx-auto " bg='dark' text='light' style={{ width: '80%', marginTop: '20px' }}>
            <Card.Header style={{ fontSize: "20px" }}>
              VoterId: {voter.voterId}
            </Card.Header>
            <Card.Body className='bg-secondary' style={{ fontSize: "16px" }}>
              <Card.Text>
                <p className='text-dark'><b>Name: </b>{voter.name}</p>
              </Card.Text>
              <Card.Text>
              <p className='text-dark'><b>Ethereum Address: </b>{voter.voterAdd}</p>
              </Card.Text>
              <br></br>
            {voter.isVerified ? <Button className='btn btn-success'>Verified</Button> : <Button className='btn btn-primary' onClick={this.verifyVoter} value={voter.voterAdd}>Verify Voter</Button>}
            </Card.Body>         
          </Card>
        )
      })
    }

    if (!this.state.web3) {
      return (
        <div>
          <NavBarAdmin />
          <div className="container"
          style={{
            textAlign: "center",
            marginTop: "200px"
          }}
          >
            <h2>Loading voter requests...</h2>
          </div>
        </div>
      )
    }

    if (!this.state.isOwner) {
      return (
        <div>
          <NavBarVoter />
          <h2>THIS CAN BE ACCESSED BY ADMIN ONLY!</h2>
        </div>
      );
    }

    return (
      <div>
       <NavBarAdmin />
        <div>
          <h1 className='text-center text-black mt-4'>Verify Voters</h1>
        </div>
        {voterList}
      </div >
    )
  }
}
export default VerifyVoter;
