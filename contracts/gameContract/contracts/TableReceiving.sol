pragma solidity ^0.4.20;

 /*
 * Contract that is working with ERC223 tokens
 */
 
contract TableReceiviong {
    function tokenFallback(address _from, uint _value, bytes _data);
    function join(uint256 tableid,address from, uint value) public returns(string);
}