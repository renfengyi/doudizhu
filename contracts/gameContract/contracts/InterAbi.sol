pragma solidity ^0.4.11;

contract InterAbi {
    function release(uint256 tableid) public;
    function select(uint256 tableId, address playerAddr, uint number) public returns(string ret);
    function reSelect(uint tableId) public returns(string);
    function failInter(uint tableId, address playerAddr,address interAddr) public returns(string);
}