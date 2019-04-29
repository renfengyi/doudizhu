pragma solidity >=0.4.0 <0.6.0;

contract Register {
  mapping(string => address) contracts;
  mapping(string => address) limit;
  function set(string memory name, address addr) public {
    require(limit[name]==address(0) || limit[name] == msg.origin,"limit error");
	contracts[name]= addr;
	limit[name]= msg.origin;
  }

  function get(string memory name) public view returns(address) {
    return contracts[name];
  }
  function limit(string memory name) public view returns(address){
	return limit[name];
  }
}