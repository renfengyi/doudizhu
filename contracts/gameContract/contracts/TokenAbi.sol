pragma solidity ^0.4.11;

contract TokenAbi {
    function balanceOf(address _owner) public constant returns (uint balance);
    function transferForTM(uint256 tableid,address from, address to, uint value) public returns(string);
    function transferToken(address from, address to, uint value) public returns(bool);
    function transfer(address to, uint256 value);
}