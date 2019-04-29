pragma solidity ^0.4.20;

import './LibContract.sol';
import './SafeMath.sol';
import './NotaryAbi.sol';

import './TokenAbi.sol';

import './RLP.sol';
import './RLPEncode.sol';
import './Strings.sol';

contract TableFunc is LibContract{
    using SafeMath for uint256;
    using Strings for *;
    using RLP for bytes;
    using RLP for RLP.RLPItem;
    using RLP for RLP.Iterator;
    string  public name;                    //合约名称
    address public owner;          
    address public authorityAddress;        //权限合约地址
    address public tokenAddress;             //代币合约
    address public interManage;             //转发者管理合约
    address public notaryManage;            //公证者管理合约
    address public tableFunAddress;         //table 逻辑合约
    uint256 public tableNonce=1;            //tableid
    mapping(address => uint256) balances;   //用户筹码
    enum PlayStatus {WAITING, READY, DISCARD, PLAYING}
    enum TableStatus {NOTSTARTED, STARTED}      // table的状态，NOTSTARTED:未开始游戏，STARTED:已开始游戏

    enum ErrorCode_Settle {
        DATASTRUCT, 
        ADDR_DISMATCH, 
        HAND_DISMATCH, 
        ITEMDATA_STRUCT, 
        NOT_APP_NORTARY, 
        NORTARY_NOTIN_LIST, 
        RE_SUBMIT, 
        DATA_INCONSISTENCY,
        RE_NOTARIZE,
        RE_NOTARIZE_ERR
    }
    enum Data_Src {PLAYER, NORTARY}

    struct Seat {
        address playerAddr;
        PlayStatus status;
    }
    struct NotaryInfo{
        address notary;
        bytes   allocate;
    }
    struct table {
        uint256 tableid;            //
        // address interAddress;       //转发者
        // address notaryAddress;      //公证者
        address creator;            //创建者
        uint256 needChips;          //需要最小筹码
        uint256 minimum;            //最少参与人数
        uint256 maximum;            //最多参与人数
        uint256 smallBlind;         //小盲注
        uint256 currentHand;        //局数 ,结算+1 ,1开始
        TableStatus currentStatus;  //table 状态 
        Seat[]  seats;              //桌子的座位
        address startPlayer;        //startGame 用户
        uint256 index;              //tableList序列
        NotaryInfo[] notaryInfos;   //公证者列表
    }


    mapping(uint256 => table) tables; //所有table集合
    mapping (address => uint256) public myTable;  //用户地址=>table.tableid

    uint256[] public tableList;              //tableid列表

    bytes4 constant ID_STARTGAME    = bytes4(keccak256("startGame(uint32)"));
    bytes4 constant ID_JOIN         = bytes4(keccak256("join(uint256,address,uint256)"));
    bytes4 constant ID_START        = bytes4(keccak256("start(uint256)"));
    bytes4 constant ID_DISCARD      = bytes4(keccak256("discard(uint256)"));
    bytes4 constant ID_DISCARD2     = bytes4(keccak256("discard2(bytes)"));
    bytes4 constant ID_LEAVE        = bytes4(keccak256("leave()"));
    bytes4 constant ID_SETTLE       = bytes4(keccak256("settle(bytes)"));
    bytes4 constant ID_SUBMITNOTARY = bytes4(keccak256("submitNotary(bytes)"));

    event CreateTable(address creator, uint256 tableid,  uint256 minimum, uint256 maximum, uint256 needChips, uint256 smallBlind);
    event DestroyTable(address creator, uint256 tableid);
    event SelectInter(uint256 tableid, uint256 number);
    event Join(uint256 tableid,address addr, uint256 pos, uint256 amount);
    event Start(uint256 tableid,address addr, uint256 pos);
    event SelectStarter(uint256 tableid,address addr, uint256 pos);
    event Discard(uint256 tableid,address addr, uint256 pos);
    event Leave(uint256 tableid,address addr, uint256 pos);
    event StartGame(uint256 tableid,address player, uint256 pos, uint256 hand);
    event Settle( uint256 hand,uint256 playingNum,uint256 tableid);
    event SettleItemData(uint256 tableid,address player, uint256 pos, uint256 hand, uint256 flag, uint256 amount);
    event SettlePlayerAbsent(uint256 tableid,address player, uint256 pos, uint256 hand);
    event SettlePlayer(address player, uint256 hand);
    event SettleData(uint256 tableid,address submitter, uint datalength, bytes data);
    event SettleError(address addr, uint256 datasrc, uint256 errcode);
    event FinishNotary(uint256 tableid,uint256 hand);
    address constant EMPTYADDR = 0x0000000000000000000000000000000000000000;


    constructor()payable public {
        name = "tableManageFunc";
        owner = msg.sender;
        _setContract("tableManageFunc",this); //注册合约到模块

    }

    // 检查必须是合约的所有者
    modifier onlyOwner {
        assert(msg.sender == owner);
        _;
    }
    function startGame(uint32 hand) public returns(string){
        uint256 tableid = myTable[msg.sender];
        
       // require(tables[tableid].currentHand == hand);
        if(tables[tableid].currentHand != hand){
            return "currentHand!=and";
        }
        //require(tables[tableid].currentStatus == TableStatus.NOTSTARTED);
        if(tables[tableid].currentStatus != TableStatus.NOTSTARTED){
            return "currentStatus!=NOTSTARTED";
        }
        address player = msg.sender;
        if(player != tables[tableid].startPlayer){
            return "not startPlayer";
        }

        Seat[] storage seats=tables[tableid].seats;
        uint256 i;
        uint startpos = seats.length;
        uint readynum = 0;
        

        for (i = 0; i < seats.length; i++) {
            if (seats[i].status == PlayStatus.READY) {
                if(player == seats[i].playerAddr) {
                    startpos = i;
                }
                readynum++;
            }
        }
        if(readynum < tables[tableid].minimum){
            return "readynum < minimum";
        }


        tables[tableid].currentStatus = TableStatus.STARTED;
        for (i = 0; i < seats.length; i++) {
            if (seats[i].status == PlayStatus.READY) {
                seats[i].status = PlayStatus.PLAYING;
            }
        }
        
        emit StartGame(tableid,player, uint8(startpos), tables[tableid].currentHand);
        return "";
    }
    function join(uint256 tableid,address from, uint256 value) public returns(string) {
        balances[from] = balances[from].add(value);
        if(msg.sender != tokenAddress){
            return "sender != tokenAddress";
        }
        //creater,user,不同用户加入
        if(myTable[from] != 0 ){
            return "玩家已在桌子";
        }
        if(tables[tableid].tableid ==0){
            return "桌子不存在";
        }
        // if(tables[tableid].seats.length>=tables[tableid].maximum){
        //     return "桌子已满员";
        // }
        Seat[] storage seats = tables[tableid].seats;
        
        bool rebuy = false;
        uint biggerPos = seats.length;
        uint emptyPos = biggerPos;
        for (uint256 i = 0; i < seats.length; i++) {
            if(seats[i].playerAddr == EMPTYADDR)
            {
                emptyPos = i;
            }
        }
        if(emptyPos >=tables[tableid].maximum){
            return "桌子已满员";
        }
        if(!rebuy) {
            if( balances[from] < tables[tableid].needChips){
                return "balance<needChips";
            }
            if(emptyPos == biggerPos){
                seats.length++;
            } 
    
            seats[emptyPos].playerAddr = from;
            //balances[from] = balances[from].add(value);
            seats[emptyPos].status = PlayStatus.WAITING;
           
           
        }
        emit Join(tableid,from, emptyPos, balances[from]);
        myTable[from] = tableid;
        return "";
    }
    /**
     * @dev 玩家开始
     * @param hand 局数（即在第几局弃牌）
     */
    function start(uint256 hand) public returns(string){
        // 所在table的游戏未开始
        // 玩家的筹码数大于等于大盲数
        uint256 tableid=myTable[tx.origin];

        if(tables[tableid].currentHand != hand){
            return "currentHand != hand";
        }
        if(tables[tableid].currentStatus != TableStatus.NOTSTARTED){
            return "桌子已开始";
        }

        Seat[] storage seats = tables[tableid].seats;
        uint i;

        address player = msg.sender;
        for (i = 0; i < seats.length; i++) {
            if (seats[i].playerAddr == player) {
                if(balances[seats[i].playerAddr] < 2 * tables[tableid].smallBlind){
                    return "玩家筹码不够";
                }  // 玩家的筹码数大于等于大盲数
                seats[i].status = PlayStatus.READY;

                emit Start(tableid,player, uint8(i));
            }
        }

        // // 玩家start，如果已start人数为 minimum,则选择开始游戏玩家
        // if(readynum != minimum) {
        //     return;
        // }

        return selectStartPlayer();
        
    }
        /**
     * @dev 弃牌
     * @param hand 局数（即在第几局弃牌）
     */
    function discard(uint256 hand) public {
        uint256 tableid = myTable[tx.origin];

        require(tables[tableid].currentHand == hand);
        require(tables[tableid].currentStatus == TableStatus.STARTED);

        Seat[] storage seats = tables[tableid].seats;
        address player = msg.sender;
        for (uint256 i = 0; i < seats.length; i++) {
            if (seats[i].playerAddr == player) {
                if(PlayStatus.PLAYING == seats[i].status) {
                    seats[i].status = PlayStatus.DISCARD;
                    emit Discard(tableid,player, uint8(i));
                }
                
                break;
            }
        }
    }

    /**
     * @dev 弃牌
     * @param data 弃牌数据(包括签名)
     */
    function discard2(bytes data) public {
        // emit SettleData(msg.sender, data.length, data);
        uint256 tableid = myTable[tx.origin];
        uint sigLen = 65;

        require(data.length > sigLen);

        bytes memory msgData = new bytes(data.length - sigLen);

        for(uint i = sigLen; i < data.length; i++) {
            msgData[i - sigLen] = data[i];
        }

        RLP.RLPItem memory msg = msgData.toRLPItem();
        require(msg.isList());
        RLP.RLPItem[] memory msgItems = msg.toList();
        require(4 == msgItems.length);

        uint pos = msgItems[1].toUint();
        Seat[] storage seats = tables[tableid].seats;

        require(pos < seats.length);
        require(rlpToAddress(msgItems[2]) == address(this));
        require(uint32(msgItems[3].toUint()) == tables[tableid].currentHand);

        uint8 v;
        bytes32 r;
        bytes32 s;

        assembly {
            r := mload(add(data, 32))
            s := mload(add(data, 64))
            v := mload(add(data, 65))
        }

        if (v < 27) {
            v += 27;
        }

        require(ecrecover(keccak256(msgData), v, r, s) == seats[pos].playerAddr);

        if(PlayStatus.PLAYING == seats[pos].status) {
            seats[pos].status = PlayStatus.DISCARD;
            emit Discard(tableid,seats[pos].playerAddr, uint8(pos));
        }

        emit Discard(tableid,seats[pos].playerAddr, uint8(pos));
        // emit Discard(seats[pos].playerAddr, uint8(33));
    }
    /**
     * @dev 离开table
     */
    function leave() public returns(string){
        // table创建者也允许离开
        address player = msg.sender;
        uint256 tableid = myTable[player];
        Seat[] storage seats = tables[tableid].seats;

        for (uint256 i = 0; i < seats.length; i++) {
            if (seats[i].playerAddr == player) {
                if(PlayStatus.DISCARD == seats[i].status){return "已弃牌";}
                if(PlayStatus.PLAYING == seats[i].status){return "正在游戏中,无法离开";}

                //转筹码出去
                TokenAbi token = TokenAbi(tokenAddress);
                
                token.transfer(seats[i].playerAddr, balances[seats[i].playerAddr]);
                delete balances[seats[i].playerAddr];

                emit Leave(tableid,player, uint8(i));
                
                seats[i].playerAddr = EMPTYADDR;
                seats[i].status = PlayStatus.WAITING;

                selectStartPlayer();

                break;
            }
        }
        delete myTable[player];
        return "";
    }
    /**
     * @dev 资金结算
     * @param data 分配方案(不包括签名)
     * @param src 数据来源 0:玩家提交; 1:公证者提交
     */
    function allocate(bytes data, uint256 src) internal returns(string ret){
        uint256 tableid = myTable[msg.sender];
        //return "allocate start";
        RLP.RLPItem memory bal = data.toRLPItem();
        // require(bal.isList());
        if(!bal.isList()) {
            //emit SettleError(msg.sender, src, uint256(ErrorCode_Settle.DATASTRUCT));
            return "1";
        }
        RLP.RLPItem[] memory settledata = bal.toList();

        if(settledata.length != 3) {
            //emit SettleError(msg.sender, src, uint256(ErrorCode_Settle.DATASTRUCT));
             return "2";
        }

        if(address(this) != rlpToAddress(settledata[0])) {
            //emit SettleError(msg.sender, src, uint256(ErrorCode_Settle.ADDR_DISMATCH));
            return "3";
        }

        if(uint32(settledata[1].toUint()) != tables[tableid].currentHand) {
            //emit SettleError(msg.sender, src, uint256(ErrorCode_Settle.HAND_DISMATCH));
             return "4";
        }

        if(!settledata[2].isList()) {
           // emit SettleError(msg.sender, src, uint8(ErrorCode_Settle.DATASTRUCT));
            return "5";
        }
        //return "结构end";
        // require(settledata[2].isList(), "settlement data struct error");
        RLP.RLPItem[] memory itemDatas = settledata[2].toList();

        uint i;
        for(i = 0; i < itemDatas.length; i++) {
            // require(itemDatas[i].isList());
            if(!settledata[2].isList()) {
                //emit SettleError(msg.sender, src, uint8(ErrorCode_Settle.ITEMDATA_STRUCT));
                return "6";
            }

            RLP.RLPItem[] memory item = itemDatas[i].toList();
            // require(3 == item.length);
            if(item.length != 3) {
                //emit SettleError(msg.sender, src, uint8(ErrorCode_Settle.ITEMDATA_STRUCT));
                return "7";
            }
           
            // uint8 pos = uint8(item[0].toUint());
            // uint32 flag = uint32(item[1].toUint());
            // uint  won = item[2].toUint();
            // emit GameSettleDataItem(settledata[2].toBytes(), itemDatas[i].toBytes(), uint32(won));
            Seat[] storage seats = tables[tableid].seats;
            if(1 == item[1].toUint()) {
                balances[seats[item[0].toUint()].playerAddr] = balances[seats[item[0].toUint()].playerAddr].add(item[2].toUint());
            }
            else {
                balances[seats[item[0].toUint()].playerAddr] = balances[seats[item[0].toUint()].playerAddr].sub(item[2].toUint());
            }

            emit SettleItemData(tableid,seats[item[0].toUint()].playerAddr, uint256(item[0].toUint()), tables[tableid].currentHand, uint256(item[1].toUint()), uint256(item[2].toUint()));
        }

        return "";
    }
    function rlpToAddress(RLP.RLPItem item) internal returns(address addr){

        if (item.toBytes().length==21) {
            addr = item.toAddress();
            return addr;
        } 
        
        string memory strAddr = item.toAscii();
        bytes memory bAddr = bytes(strAddr);

        uint iAdd = 0;
        uint tmp = 0;
        for(uint i = bAddr.length-40; i < bAddr.length; i++) {
            tmp = 0;
            if (bAddr[i] >= byte('0') && bAddr[i] <= byte('9')) {
                tmp = uint(bAddr[i]) - uint(byte('0'));
            }

            if (bAddr[i] >= byte('a') && bAddr[i] <= byte('f')) {
                tmp = 10 + uint(bAddr[i]) - uint(byte('a'));
            }

            if (bAddr[i] >= byte('A') && bAddr[i] <= byte('F')) {
                tmp = 10 + uint(bAddr[i]) - uint(byte('A'));
            }

            iAdd = iAdd << 4 | tmp;
        }

        return address(iAdd);
    }
    function selectStartPlayer() internal returns(string){
        uint256 tableid = myTable[tx.origin];
        uint32 readynum = 0;
        Seat[] storage seats = tables[tableid].seats;

        //tables[tableid].startPlayer;
        for (i = 0; i < seats.length; i++) {
            if (seats[i].playerAddr == EMPTYADDR) {
                continue;
            }

            if(PlayStatus.READY == seats[i].status) {
                readynum++;
            }
        }

        if(readynum < tables[tableid].minimum) {
            if(tables[tableid].startPlayer != EMPTYADDR) {
                tables[tableid].startPlayer = EMPTYADDR;
                emit SelectStarter(tableid,tables[tableid].startPlayer, uint8(seats.length));
            }
            
            return "readynum<mininum";
        }

        if(tables[tableid].startPlayer != EMPTYADDR) {
            return  "startPlayer exist";
        }

        //　随机选取一个READY玩家开始游戏
        uint rand = uint(keccak256(block.difficulty, now));
        uint select = rand % tables[tableid].minimum;

        for (uint i = 0; i < seats.length; i++) {
            if(EMPTYADDR == seats[i].playerAddr) {
                continue;
            }
            if(PlayStatus.READY != seats[i].status) {
                continue;
            }

            if(0 == select) {
                tables[tableid].startPlayer = seats[i].playerAddr;
                emit SelectStarter(tableid,tables[tableid].startPlayer, uint8(i));
                //return "成功随机startPlayer";
                break;
            }
            select--;
            
        }
        return "";
    }
}
