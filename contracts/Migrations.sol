// SPDX-License-Identifier: MIT
pragma solidity ^0.4.17;

contract Migrations {
  address public owner;
  uint public last_completed_migration;

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  function Migrations() public { owner = msg.sender; }

  // constructor() public {
  //   owner = msg.sender;
  // }

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }
}
