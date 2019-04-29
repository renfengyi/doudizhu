pragma solidity ^0.4.24;

contract register{
    //注册合约
    function set(string _name ,address _contract)public ;
    //获取合约
    function get(string _name)public view returns (address);

}
contract AuthorityInterface{
    //合约设置自己付费
    function setPayer() public;

    //设置合约gasPrice,gasLimit;
    function setGas(uint256 price, uint64 gaslimit) public;

    //设置合约白名单用户
    function grant(address addr)public;

    //移除用户地址白名单
    function revoke(address addr) public;
}

contract AuthIndex{
    //设置合约的权限控制合约地址
    function setAuthContractAddr(address add) public;
    //获取合约的权限控制合约地址
    function getAuthContractAddr(address add) public view returns(address); 
}


contract LibContract {
    register rm;
    AuthorityInterface auth;
    AuthIndex authindex;
    function LibContract(){
        rm = register(0x1000000000000000000000000000000000000003);
	    authindex = AuthIndex(0x1000000000000000000000000000000000000001);
    }

    function setauthority(address addr)public{
        auth = AuthorityInterface(addr);
        authindex.setAuthContractAddr(addr);
    }

    function setContract(string name ,address addr){
        rm.set(name,addr);
    }
    function getContract(string name) returns(address){
        rm.get(name);
    }

    //合约设置自己付费
    function setPayer() public{
        auth.setPayer();
    }
       
    //设置合约gasPrice,gasLimit;
    function setGas(uint256 price, uint64 gaslimit) public{
        auth.setGas(price,gaslimit);
    }


    //设置合约白名单用户
    function grant(address addr)public{
        auth.grant(addr);
    }

    //移除用户地址白名单
    function revoke(address addr) public{
        auth.revoke(addr);
    }

}