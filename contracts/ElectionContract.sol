// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

contract ElectionContract {
    address public owner;
    uint candidateCount;
    uint voterCount;
    bool start;
    bool end;

    constructor() {
        owner = msg.sender;
        candidateCount = 0;
        voterCount = 0;
        start = false;
        end = false;
    }

    function getOwner() public view returns(address){
        return owner;
    }

    modifier onlyAdmin(){
        require((msg.sender == owner));
        _;
    }

    struct Candidate{
        string name;
        string party;
        string gender;
        uint age;
        uint uniqueId;
        string imghash;
        uint voteCount;
        uint candidateId;
    }

    mapping(uint => Candidate) public candidateDetails;

    function addCandidate(string memory _name, string memory _party, string memory _gender, 
    uint _age, uint _uniqueId, string memory _imghash) public onlyAdmin{
        Candidate memory newCandidate = Candidate({
            name: _name,
            party: _party,
            gender: _gender,
            age: _age,
            uniqueId: _uniqueId,
            imghash: _imghash,
            voteCount: 0,
            candidateId: candidateCount + 1001
        });
        candidateDetails[candidateCount] = newCandidate;
        candidateCount += 1;
    }

    function getTotalCandidates() public view returns(uint){
        return candidateCount;
    }

    struct Voter{
        address voterAdd;
        string name;
        string voterId;
        bool hasVoted;
        bool isVerified;
    }

    address[] public voters;
    mapping(address => Voter) public voterDetails;

    event voterRegister(
        string _voterId
    );

    event voteEvent(
        uint indexed _candidateId
    );

    function registerVoter(string memory _name, string memory _voterId) public {
        Voter memory newVoter = Voter({
            voterAdd: msg.sender,
            name: _name,
            voterId: _voterId,
            hasVoted: false,
            isVerified: false
        });
        voterDetails[msg.sender] = newVoter;
        voters.push(msg.sender);
        voterCount += 1;
        emit voterRegister(_voterId);
    }

    function getVoterCount() public view returns (uint){
        return voterCount;
    }

    function verifyVoter(address _address) public onlyAdmin {
        voterDetails[_address].isVerified = true;
    }

    function castVote(uint candidateId) public{
        require(voterDetails[msg.sender].hasVoted == false);
        require(voterDetails[msg.sender].isVerified == true);
        require(start == true);
        require(end == false);
        candidateDetails[candidateId - 1001].voteCount += 1;
        voterDetails[msg.sender].hasVoted = true;
        emit voteEvent(candidateId);
    }

    function startElection() public onlyAdmin {
        start = true;
        end = false;
    }

    function endElection() public onlyAdmin {
        start = false;
        end = true;
    }

    function getStart() public view returns (bool) {
        return start;
    }

    function getEnd() public view returns (bool) {
        return end;
    }
    
}