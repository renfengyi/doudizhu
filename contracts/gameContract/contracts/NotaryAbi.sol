pragma solidity ^0.4.11;
contract NotaryAbi {
    function applyNotorys(uint tableId, address playerAddr,uint number) public returns(string);
    function finishNotarize(uint256 tableid) public;
    function getNotaryList(address tbManage,uint256 tableid) public view returns(address[]);
    function reNotarize(uint256 tableid) public returns(bool);
 } 