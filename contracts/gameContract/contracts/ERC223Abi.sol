pragma solidity ^0.4.11;

import './ERC20Abi.sol';

contract ERC223Abi is ERC20Abi {
    function transfer(address to, uint value, bytes data);
}