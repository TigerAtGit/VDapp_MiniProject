// SPDX-License-Identifier: MIT
pragma solidity ^0.4.17;

contract ElectionContract {
    address public owner;
    uint candidateCount;
    uint voterCount;
    bool start;
    bool end;

    function ElectionContract() public{
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
        uint voteCount;
        uint candidateId;
    }

    mapping(uint => Candidate) public candidateDetails;

    function addCandidate(string _name, string _party) public onlyAdmin{
        Candidate memory newCandidate = Candidate({
            name: _name,
            party: _party,
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
        //bool isVerified;
    }

    address[] public voters;
    mapping(address => Voter) public voterDetails;

    function registerVoter(string _name, string _voterid) public {
        Voter memory newVoter = Voter({
            voterAdd: msg.sender,
            name: _name,
            voterId: _voterid,
            hasVoted: false
        });
        voterDetails[msg.sender] = newVoter;
        voters.push(msg.sender);
        voterCount += 1;
    }

    function getVoterCount() public view returns (uint){
        return voterCount;
    }

    /*
    function to verify voter
    */

    function castVote(uint candidateId) public{
        require(voterDetails[msg.sender].hasVoted == false);
        require(start == true);
        require(end == false);
        candidateDetails[candidateId - 1001].voteCount += 1;
        voterDetails[msg.sender].hasVoted = true;
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