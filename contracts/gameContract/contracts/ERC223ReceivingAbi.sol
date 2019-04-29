pragma solidity ^0.4.11;

 /*
 * Contract that is working with ERC223 tokens
 */
 
contract ERC223ReceivingAbi {
    function tokenFallback(address _from, uint _value, bytes _data);
    function join(uint256 tableid,address _from, uint _value) public returns(string);
    function quota() public view returns(uint);
    function getPlayerInfo(address addr) public view returns (uint8, address, uint256, uint8);
}