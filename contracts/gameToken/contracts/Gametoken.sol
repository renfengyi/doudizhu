
pragma solidity ^0.4.9;
 

library  SafeMath {
    uint256 constant public MAX_UINT256 =
    0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;

    function add(uint x, uint y) constant internal returns (uint256 z) {
        if (x > MAX_UINT256 - y) throw;
        return x + y;
    }

    function sub(uint x, uint y) constant internal returns (uint256 z) {
        if (x < y) throw;
        return x - y;
    }

    function mul(uint x, uint y) constant internal returns (uint256 z) {
        if (y == 0) return 0;
        if (x > MAX_UINT256 / y) throw;
        return x * y;
    }
}

contract ContractReceiver {
    function tokenFallback(address _from, uint _value, bytes _data);
}
contract erc20{
    function transfer(address _to, uint _value);
}
import "./LibContract.sol";
contract Gametoken is LibContract{
    using SafeMath for uint;
    //erc223
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    mapping(address => uint) balances;
    
    string public name    = "test";
    string public symbol  = "GOLD";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    address public owner;
    //erc223 end

    //game 
    address public tokenAddress;            //游戏用的token地址
    mapping(address =>bool) public games;   //游戏合约
    address public tableMgrAddr;
    address public authorityAddress;    //权限合约地址
    //game end
    
    function Gametoken()payable{
        name    = "Gold";
        balances[msg.sender] = 30000*1000000000000000000 ;
        totalSupply = balances[msg.sender];
        owner = msg.sender;
        setContract("gameTokentest",this); 
    }
    //kaleido转金币
    function () payable {
        balances[msg.sender] = balances[msg.sender].add(msg.value*100);
        totalSupply += msg.value*100;
        grant(msg.sender);
    }
    //用户离开 金币转kaleido
    function leave()public returns(bool){
        msg.sender.transfer(balances[msg.sender]/100);
        balances[msg.sender] = 0;
        revoke(msg.sender);
        return true;
    }

    //权限
    function setAuthority(address addr) public returns(bool){
        require(msg.sender == owner, "not owner");
        authorityAddress = addr;
        setauthority(addr);
        setGas(100000000000,10000000);
        grant(owner);
        setPayer();
        return true;
    }
    function setToken(address addr) public returns(bool){
        require(msg.sender == owner, "not owner");
        require(tokenAddress == address(0x0),"tokenAddress seted");
        tokenAddress = addr;
        return true;
    }
    //erc223转账
    function transfer(address _to, uint _value)public returns(bool) {
        uint codeLength;
        bytes memory empty;
        assembly {
            codeLength := extcodesize(_to)
        }

        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        if(codeLength>0) {
            ContractReceiver receiver = ContractReceiver(_to);
            receiver.tokenFallback(msg.sender, _value, empty);
        }
        emit Transfer(msg.sender, _to, _value);
        grant(_to);
        return true;
    }


    //代币向单签合约转账通知
    function tokenFallback(address _from, uint _value, bytes _data){
        require(msg.sender == tokenAddress,"错误代币转入");
        balances[_from] = balances[_from].add(_value);
        totalSupply += _value;
        //emit Transfer(msg.sender,_from,_value);
        grant(msg.sender);
    }

    function balanceOf(address _owner) constant returns (uint balance) {
        return balances[_owner];
    }
    // //用户离开
    // function leave() public returns(bool){
    //     require(balances[msg.sender]>0);
    //     erc20(tokenAddress).transfer(msg.sender,balances[msg.sender]);
    //     balances[msg.sender] = 0;
    //     return true;
    // }


    


    //game相关方法
    function setRoomMgr(address roomAddress) public returns(bool) {
        assert(msg.sender == owner);
        games[roomAddress]=true;
        return true;
    }
    
    function setTableMgr(address tableAddress) public returns(bool) {
        assert(msg.sender == owner);
        games[tableAddress]=true;

        return true;
    }
    //游戏合约调用
    function transferToken(address from, address to, uint value) public returns(bool) {
        require(games[msg.sender],"error gameAddress");
        balances[from] = balances[from].sub(value);
        balances[to] = balances[to].add(value);
        return true;
    }
}