// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RNCoin is ERC20 {

    uint256 constant initialSupply = 670_000_000_000  * (10**18);

    // Constructor will be called on contract creation
    constructor() ERC20("Red Notice Coin", "RNC") {
        _mint(msg.sender, initialSupply);
    }
}