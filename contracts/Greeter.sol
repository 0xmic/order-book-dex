// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Greeter {
    string public greeting;

    constructor() {
        greeting = "Hello, world!";
    }

    function get() public view returns (string memory) {
        return greeting;
    }

    function set(string memory _greeting) public {
        greeting = _greeting;
    }
}
