pragma solidity ^0.4.20;

contract RoomManagerAbi {
    function getTablePlayers(uint tableId) public view returns(address[]);
    function getTablePlayingPlayers(uint tableId) public view returns(uint number, address[] players);
    function getPlayerInfo(address playerAddr) public view returns(address, uint, uint, uint, uint8);
    function resetNotoryInfo(uint tableId) public;
    function isTablePlayingPlayer(uint tableId, address playerAddr) public view returns(bool);
}