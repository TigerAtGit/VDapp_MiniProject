var Election = artifacts.require("./ElectionContract.sol");

contract("Election", function(accounts){
    var electionInstance;

    it("initializes with zero candidates", function(){
        return Election.deployed().then(function(instance){
            return instance.getTotalCandidates();
        }).then(function(count){
            assert.equal(count, 0);
        });
    });

    it("initializes with zero voters", function(){
        return Election.deployed().then(function(instance){
            return instance.getVoterCount();
        }).then(function(count){
            assert.equal(count, 0);
        });
    });

    it("owner is the first account", function(){
        return Election.deployed().then(function(instance){
            return instance.owner();
        }).then(function(owner){
            assert.equal(owner, accounts[0]);
        })
    });

    it("voter can register to vote", function(){
        return Election.deployed().then(function(instance){
            voterName = "voter name";
            voterId = "XXX1234";
            return instance.registerVoter(voterName, voterId);
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, "an event was triggered");
            assert.equal(receipt.logs[0].event, "voterRegister", "the event type is correct");
        })
    });

    it("throws an exception for invalid vote", function(){
        return Election.deployed().then(function(instance){
            candidateId = 1001;
            return instance.castVote(candidateId, {from: accounts[1]});
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
        })
    });


});