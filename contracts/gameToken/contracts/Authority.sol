pragma solidity ^0.4.20;

contract Authority {
    enum Payer {
        NOTSET,     // 未设置
        SELF        // 合约账户支付
    }
    enum Permission {
        NOTSET,     // 未设置
        PERMIT,     // 允许
        FORBID      // 禁止
    }

    //////////// 注：本合约的数据结构顺序改变会影响 go 代码  //////////////

    uint    version;    // 版本号
    address owner;      // 合约拥有者
    address next;       // 链式结构，指向新合约地址
    mapping(address => uint256) addr2opauth;    // 合约地址 -- 操作权限
    mapping(address => uint256) addr2payer;     // 合约地址 -- 合约执行是否由合约账户支付
    mapping(address => uint256) addr2gasprice;  // 合约地址 -- 合约执行的gasprice
    mapping(address => uint64)  addr2gaslimit;  // 合约地址 -- 合约执行的gaslimit
    mapping(address => uint256) addr2auth;      // 账户地址 -- 权限

    uint public mode = 0; //0 -白名单模式  1 - 黑名单模式

    constructor() public {
        owner = msg.sender;
        next = address(0);
        version = 0x01;
        // next = 0x2ce224cad729c63c5cdf9ce8f2e8b5b8f81ec7b4;
    }

    /**
     * @dev 更新合约拥有者
     * @param newOwner  新的拥有者地址
     */
    function changeOwner(address newOwner) public {
        assert(msg.sender == owner);
        owner = newOwner;
    }

    /**
     * @dev 获取合约拥有者
     */
    function getOwner() public view returns(address) {
        return owner;
    }

    /**
     * @dev 设置新的权限控制合约地址
     * @param newNext  新的权限合约地址
     */
    function setNewAuthority(address newNext) public {
        assert(msg.sender == owner);
        next = newNext;
    }

    /**
     * @dev 获取新的权限控制合约地址
     */
    function getNextAuthority() public view returns(address) {
        return next;
    }

    /**
     * @dev 授予合约授权账户权限
     * @param addr 合约地址
     */
    function grantContractAuth(address addr) public {
        assert(msg.sender == owner);

        addr2opauth[addr] = uint(Permission.PERMIT);
    }

    /**
     * @dev 收回合约授权账户权限
     * @param addr 合约地址
     */
    function revokeContractAuth(address addr) public {
        assert(msg.sender == owner);

        addr2opauth[addr] = uint(Permission.FORBID);
        delete addr2opauth[addr];
    }

    /**
     * @dev 设置合约执行gas支付者
     */
    function setPayer() public {
        addr2payer[msg.sender] = uint256(Payer.SELF);
    }

    /**
     * @dev 获取合约执行gas支付者
     * @param contractAddr  合约账户地址
     */
    function getPayer(address contractAddr) public view returns(uint256){
        return addr2payer[contractAddr];
    }

    /**
     * @dev 设置合约执行gas支付者
     * @param price  合约执行的gasprice
     * @param gaslimit  合约执行的gaslimit
     */
    function setGas(uint256 price, uint64 gaslimit) public {
        addr2payer[msg.sender] = uint(Payer.SELF);
        addr2gasprice[msg.sender] = price;
        addr2gaslimit[msg.sender] = gaslimit;
    }

    /**
     * @dev 获取合约执行的gasprice gaslimit
     * @param contractAddr  合约账户地址
     */
    function getGas(address contractAddr) public view returns(uint256, uint64){
        return (addr2gasprice[contractAddr], addr2gaslimit[contractAddr]); 
    }

    /**
     * @dev 获取合约执行支付者，gasprice gaslimit
     * @param contractAddr  合约账户地址
     */
    function getContractInfo(address contractAddr) public view returns(uint256, uint256, uint256, uint64){
        return (addr2opauth[contractAddr], addr2payer[contractAddr], addr2gasprice[contractAddr], addr2gaslimit[contractAddr]);
    }

    /**
     * @dev 授予权限
     * @param addr 账户地址
     */
    function grant(address addr) public {
        // require(uint(Permission.PERMIT) == addr2opauth[msg.sender]);
        addr2auth[addr] = uint(Permission.PERMIT);
    }

    /**
     * @dev 收回权限
     * @param addr 账户地址
     */
    function revoke(address addr) public {
        require(uint(Permission.PERMIT) == addr2opauth[msg.sender]);
        addr2auth[addr] = uint(Permission.FORBID);
        delete addr2auth[addr];
    }

    /**
     * @dev 获取某账户访问合约权限
     * @param addr          账户地址
     */
    function getAuth(address addr) public view returns(uint256) {
        return addr2auth[addr];
    }
}