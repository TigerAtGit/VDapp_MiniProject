var SimpleStorage = artifacts.require("./ElectionContract.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
};
