pragma solidity ^0.4.20;

contract TableAbi {
    function getTableInfo() public view returns (address, uint32, uint32, uint32, uint, uint,uint8);
    function join(address from, uint value) public returns(bool);
}