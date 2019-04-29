pragma solidity ^0.4.20;

import './LibContract.sol';
import './TokenAbi.sol';
import './InterAbi.sol';
import './NotaryAbi.sol';
import './SafeMath.sol';
//import './DataTime.sol';
import './RLP.sol';

contract RoomManager  is LibContract{
    using SafeMath for uint;
    using RLP for bytes;
    using RLP for RLP.RLPItem;
    using RLP for RLP.Iterator;

    //event JoinRoom(address playerAddr, address roomAddr);
    event JoinSittingQueen(address playerAddr, address roomAddr);
    //中途加入桌子
    event Join(uint256 tableid,address addr, uint256 pos, uint256 amount);
    
    event CreateTable(address creator,uint tableid,uint minimum,uint maximum,uint buyinMin,uint buyinMax,uint smallBlind,uint straddle,uint ante);
    event AllotTable(address roomAddr,uint tableid);
    event LeaveTable(uint tbNum, address playerAddr, uint pos);
    event Start(address roomAddr, uint tbNum, address playerAddr, uint pos, uint hand);
    event SelectStarter(address roomAddr, uint tbNum, address playerAddr, uint pos, uint hand);
    event GameStart(address roomAddr, uint tbid, uint hand);
    event StartGame(address roomAddr, uint tbNum, address playerAddr, uint pos, uint hand);
    event Discard(address roomAddr, uint tbNum, address playerAddr, uint pos, uint hand);
    event SubmmitSettleData(address nrAddr, uint datalength, bytes data);
    event SettleError(address roomAddr, uint tableId, uint8 datasrc, uint8 errcode);
    event SettleItemData(address roomAddr, uint tableId, uint hand, uint8 pos, uint8 flag, uint amount);
    event Settle( uint256 hand,uint256 playingNum,uint256 tableid);
    event SelectInter(uint256 tableid, uint256 number); 
    event FinishNotary(uint256 tableid,uint256 hand);
    // 玩家状态
    enum PlayerStatus {
        NOTJION,    // 未加入房间
        NOTSEATED,  // 已加入房间，但未坐在table中
        SITTING,    // 等待入座table
        SEATED,     // 已坐下table
        READY,      // 准备游戏
        PLAYING,    // 正在游戏中
        DISCARD     // 弃牌
    }

    enum TableStatus {NOTSTARTED, STARTING, STARTED}      // table的状态，NOTSTARTED:未开始游戏; STARTING:正在开始在中; STARTED:已开始游戏

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

    struct Table {
        uint        tbNum;          // tableid
        uint32      currentHand;    // 当前正在局数，结算一次，局数加１
        TableStatus currentStatus;  // 当前table的状态
        address[]   players;        // table中的玩家
        uint        readyNum;       // 准备游戏玩家个数
        address     startPlayer;    // 随机选择开始游戏的玩家
        uint        playerNum;      // 当前用户个数
        uint        minimum;        // 最小开始数
        uint        maximum;        // 最大人数
        //uint        needChips;      // 筹码
        uint        buyinMin;       //
        uint        buyinMax;       //
        uint        smallBlind;     // 小盲注
        uint        straddle;       // 是否有straddle
        uint        ante;           // 每轮开始发牌前每个人下的赌注0-30
        //uint        blindRoll;      // 盲注轮数
        //uint        needBase;       // (每个人)是否需要底
    }

    struct PlayerInfo {
        uint    tbNum;          // table的号码, 格式：数字+日期，如 100020181015　表示20181015的第1000张Table
        uint    seatNum;        // 座位号
        uint    amount;         // 剩余金额
        PlayerStatus status;    // 玩家状态
    }

    struct NotaryInfo {
        address nrAddr;
        bytes32   allocate;
    }

    struct ExceptionInfo {
        address     addr;       // 异常的Inter或者公证者，异常情况：1,对table的部分或者全部玩家异常; 2,对部分或者全部table异常
        address[]   players;    // 汇报异常的玩家
        uint8       status;     // 如果已经向Inter合约汇报异常，置为1
    }

    address public owner;

    //uint32  betType;      // 筹码类型：比特币，自发Token等等
    //uint32  minimum = 2;        // 玩家个数范围的最少参与人数
    //uint32  maximum = 2;        // 玩家个数范围的最多参与人数
    //uint    smallBlind = 2;     // 小盲注
    //uint    needChips = 100;      // 参与筹码


    address public tokenAddress;            // token合约地址
    address public interManage;             // Inter合约地址
    address public notaryManage;            // 公证者合约地址
    address public authorityAddress;        // 权限合约地址
    address roomFunAddress;                 // room合约部分功能，解决room合约过大无法部署问题

    mapping (uint => Table)             Tables;         // table号码--table中玩家信息列表
    uint[]                              TablePool;      // 已回收table
    mapping (address => PlayerInfo)     Players;        // 玩家地址--玩家信息
    mapping (uint => NotaryInfo[])      Notarys;        // table号码 -- 公证信息列表

    //uint    joining_queue_size;       // 排队入座的队列大小, 队列大小大于等于该值，给队列中玩家安排Table
    //address[] joinings;               // 等待加入Table的玩家队列,1:玩家可以退出Table，重新等待加入其他Table; 2:玩家已在Room中，等待加入Table
                                        // 3:玩家加入Table，但该Table一直不开始游戏，重新等待加入其他Table;
    uint public currMaxTbNum;           //当前最大的台号
    address public luaAddress;          //lua游戏合约地址


    constructor() payable public {
        owner = msg.sender;
        _setContract("RoomManager",this); //注册合约到模块
    }

    // 检查必须是合约的所有者
    modifier onlyOwner {
        assert(msg.sender == owner);
        _;
    }
    function setluaAddress(address addr) public onlyOwner returns(bool){
        luaAddress = addr;
        return true;
    }
    //设置权限合约
    function setauthority(address addr) public onlyOwner {   
        authorityAddress = addr;
        _setauthority(addr);
        _setGas(100000000000,10000000);
        _grant(owner);
        _setPayer();
    }
    function setTokenAddr(address addr)  public onlyOwner {
        tokenAddress = addr;
    }


    function setInterAddr(address addr) public onlyOwner{
        interManage = addr;
    }

    function setNotaryAddr(address addr) public onlyOwner{
        notaryManage = addr;
    }

    function setRoomFunAddr(address addr) public onlyOwner{
        roomFunAddress = addr;
    }

    /**
     * @dev 增加筹码
     */
    function addChips(uint value) public returns(bool) {
        if(Players[msg.sender].status == PlayerStatus.NOTJION) {
            return false;
        }
        TokenAbi token = TokenAbi(tokenAddress);
        if(!token.transferToken(msg.sender, address(this), value)) {
            return false;
        }
        Players[msg.sender].amount=Players[msg.sender].amount.add(value);
        return true;
    }


    function getTableInfo(uint tableid) public view returns(uint a, uint b, uint c, uint d, address e,uint f,uint g,uint h,uint i,uint j,uint k,uint l,uint m)  {
        //Table memory tb = Tables[tableId];
        //return (0,0,0,0,address(0x0),0,0,0,0,0,0,0,0);
        a = Tables[tableid].tbNum;
        b = uint(Tables[tableid].currentHand);
        c = uint(Tables[tableid].currentStatus);
        d = Tables[tableid].readyNum;
        e = Tables[tableid].startPlayer;
        f = Tables[tableid].playerNum;
        g = Tables[tableid].minimum;
        h = Tables[tableid].maximum;
        i = Tables[tableid].buyinMin;
        j = Tables[tableid].buyinMax;
        k = Tables[tableid].smallBlind;
        l = Tables[tableid].straddle;
        m = Tables[tableid].ante;
        return ;
    }

    function getTableList(uint pagenum, uint pagesize) public view returns(uint len, uint[] tblist) {
        uint size = 0;
        uint start = pagenum*pagesize+1;
        if((pagenum+1)*pagesize <= currMaxTbNum){
            size= pagesize;
        } else  {
            size = pagesize-((pagenum+1)*pagesize-currMaxTbNum);
        }
        tblist = new uint[](size);
        
        for(uint number=0;start + number<=(pagenum+1)*pagesize;number++){
            if(start+number>currMaxTbNum){
                break;
            }
            tblist[number] = Tables[start+number].tbNum;
        }
        return (currMaxTbNum,tblist);
    }
    /**
     * @dev 获取Table的所有玩家
     * @param tableId Table的ID
     */
    function getTablePlayers(uint tableId) public view returns(address[] players) {
        uint playernum = Tables[tableId].playerNum;
        if (playernum==0) {
            return;
        }
        players = new address[](playernum);
        uint index = 0;
        for(uint i=0; i < Tables[tableId].maximum ; i++) {
            if (Tables[tableId].players[i] != address(0x0)){
                players[index] = Tables[tableId].players[i];
                index++;
            }
        }
        return;
    }

    /**
     * @dev 获取Table的所有正在玩游戏玩家
     * @param tableId Table的ID
     */
    function getTablePlayingPlayers(uint tableId) public view returns(uint number, address[] players) {
        players = new address[](Tables[tableId].maximum);
        number = 0;
        address tmpAddr;
        for(uint i = Tables[tableId].players.length; i > 0 ; i--) {
            tmpAddr = Tables[tableId].players[i - 1];
            if(PlayerStatus.PLAYING == Players[tmpAddr].status) {
                players[number] = tmpAddr;
                number++;
            }
        }
    }

    /**
     * @dev 获取玩家信息
     */
    function getPlayerInfo(address playerAddr) public view returns (address,uint,uint,uint,uint) {
        return (playerAddr,Players[playerAddr].tbNum,Players[playerAddr].seatNum,Players[playerAddr].amount,uint(Players[playerAddr].status));
    }


    // /**
    //  * @dev 获取玩家信息
    //  */
    // function isTablePlayingPlayer(uint tableId, address playerAddr) public view returns(bool) {
    //     return tableId == Players[playerAddr].tbNum 
    //         && PlayerStatus.PLAYING == Players[playerAddr].status;
    // }

    // /**
    //  * @dev 获取table的座位信息
    //  * @param tableId   Table的ID
    //  * @param pos       座位号
    //  */
    // function getTableSeatInfo(uint tableId, uint8 pos) public view returns (PlayerInfo) {
    //     return Players[Tables[tableId].players[pos]];
    // }

    /**
     * @dev 获取Table开始游戏的玩家
     * @param tableId   Table的ID
     */
    function getTableStartPlayer(uint tableId) public view returns(address) {
        return Tables[tableId].startPlayer;
    }

    function createTable(uint minimum_,uint maximum_,uint buyinMin_,uint buyinMax_,uint smallBlind_,uint straddle_,uint ante_)public returns(bool) {
        require(minimum_ >= 2,"minimum > 2");
        require(maximum_ >= minimum_ ,"maximum error");        
        require(maximum_ == 4 || maximum_ == 6 || maximum_ == 8,"maximum in(4,6,8)");    
        require(smallBlind_ > 0,"smallBlind >0");
        require(buyinMin_ > 2 * smallBlind_, "buyinMin_ < 2*smallBlind");
        require(Players[msg.sender].status == PlayerStatus.NOTJION,"already in table");
        uint needChips = (buyinMin_+buyinMax_)/2;
        require(TokenAbi(tokenAddress).transferToken(msg.sender, address(this), needChips),"transfertoken error");

        Table memory tb ;
        
        uint tableid = 0;
        //优先取已回收table
        if(TablePool.length>0){
            tableid = TablePool[TablePool.length-1];
            TablePool.length--;
            tb = Tables[tableid];
            tb.tbNum = tableid;
            tb.currentHand= Tables[tableid].currentHand;
        } else {
            tableid =  getTableNum();
            tb = Tables[tableid];
            tb.tbNum = tableid;
            tb.currentHand= Tables[tableid].currentHand>1?Tables[tableid].currentHand:1;
            //tb.currentHand = 1;
        }
     
        //table  tableInfo;
       
        tb.minimum = minimum_;
        tb.maximum = maximum_;
        tb.buyinMin = buyinMin_;
        tb.buyinMax = buyinMax_;
        tb.smallBlind = smallBlind_;
        tb.straddle = straddle_>0?1:0;
        tb.ante = ante_;
        tb.currentStatus = TableStatus.NOTSTARTED;
        
        address[] memory players = new address[](maximum_);
        players[0] = msg.sender;
        tb.players = players;
        tb.playerNum = 1;

        Tables[tableid] = tb;

        Players[msg.sender].status = PlayerStatus.SEATED;
        Players[msg.sender].tbNum  = tableid;
        Players[msg.sender].amount = needChips;

        emit CreateTable(msg.sender,tableid,minimum_,maximum_,buyinMin_,buyinMax_,smallBlind_,straddle_,ante_);
        return true;
    }
    function joinTable(uint tableid,uint needChips_,uint pos)public returns(uint){
        address playerAddr = msg.sender;
        
        //桌子上有人了
        require(tableid >0 && tableid<= currMaxTbNum && Tables[tableid].tbNum == tableid, "桌子不存在");
        require(pos < Tables[tableid].maximum,"error pos");
        if(Tables[tableid].players[pos] != address(0x0)){
            emit Join(0,msg.sender, 0, 0);
            return 1;
        }

        require(needChips_ >= Tables[tableid].buyinMin && needChips_ <= Tables[tableid].buyinMax,"error needChips" );
        //换桌子逻辑
        if(Players[playerAddr].tbNum == tableid){
            Tables[tableid].players[Players[playerAddr].seatNum] == address(0x0);
            Players[playerAddr].seatNum = pos;
            Tables[tableid].players[Players[playerAddr].seatNum] = msg.sender;
            emit Join(tableid,msg.sender, pos, Players[playerAddr].amount); 
            return 2;
        }
        //加入桌子
        require(Players[playerAddr].status == PlayerStatus.NOTJION,"joined table");

        
        //扣筹码
        TokenAbi token = TokenAbi(tokenAddress);
        require(token.transferToken(playerAddr, address(this), needChips_),"transfertoken error");
       
        PlayerInfo memory info = PlayerInfo(0, 0, needChips_, PlayerStatus.SITTING);
        Players[playerAddr] = info;

        Tables[tableid].players[pos] = msg.sender;
        Players[playerAddr].tbNum = tableid;
        Players[playerAddr].seatNum = pos;
        Players[playerAddr].status = PlayerStatus.SEATED;
        Tables[tableid].playerNum++;
        emit Join(tableid,msg.sender, pos, needChips_);
            // for(uint i = 0; i < Tables[tableid].maximum; i++) {
            //     if (Tables[tableid].players[i]== address(0x0)){
            //         Tables[tableid].players[i] = msg.sender;
            //         Players[playerAddr].tbNum = tableid;
            //         Players[playerAddr].seatNum = i;
            //         Players[playerAddr].status = PlayerStatus.SEATED;
            //         Tables[tableid].playerNum++;
            //         //emit AllotTable(this,tableid);
            //         emit Join(tableid,msg.sender, i, Tables[tableid].needChips);
            //         break;
            //     }
            // }
       
        return 3;
    }


    /**
     * @dev 获取Table号码
     */
    function getTableNum() internal returns (uint) {
        currMaxTbNum++;
        //return uint(keccak256(currDate, currMaxTbNum));
        return currMaxTbNum;
        // return currDate + currMaxTbNum;
    }

    /**
     * @dev 退出Table
     */
    function leaveTable() public returns(bool) {
        PlayerInfo memory pInfo = Players[msg.sender];

        if(!(PlayerStatus.SEATED == pInfo.status 
          || PlayerStatus.READY == pInfo.status)) {
            //return false;
        }

        //已在桌子
        if (pInfo.tbNum>0){
            Tables[pInfo.tbNum].players[pInfo.seatNum] = address(0);
            Tables[pInfo.tbNum].playerNum--;
            if (pInfo.status >= PlayerStatus.READY && Tables[pInfo.tbNum].readyNum > 0) {
                Tables[pInfo.tbNum].readyNum--;
                //人数不够要重新选startPlayer
                if (Tables[pInfo.tbNum].readyNum < Tables[pInfo.tbNum].minimum || msg.sender == Tables[pInfo.tbNum].startPlayer){
                    Tables[pInfo.tbNum].startPlayer = address(0);
                }
            }
            //回收table
            if (Tables[pInfo.tbNum].playerNum == 0){
                Tables[pInfo.tbNum].readyNum = 0;
                Tables[pInfo.tbNum].currentStatus = TableStatus.NOTSTARTED;
                Tables[pInfo.tbNum].startPlayer = address(0);
                if(pInfo.tbNum == currMaxTbNum){
                    currMaxTbNum--;
                } else {
                    TablePool.push(pInfo.tbNum);
                }
            }
        }

        TokenAbi(tokenAddress).transferToken(address(this), msg.sender, Players[msg.sender].amount);
        PlayerInfo memory tempInfo ;
        Players[msg.sender] = tempInfo;
        emit LeaveTable(pInfo.tbNum, msg.sender, pInfo.seatNum);
        return true;    
    }

    // /**
    //  * @dev 退出Table
    //  */
    // function leaveRoom() public returns(address) {
    //     if(PlayerStatus.PLAYING == Players[msg.sender].status 
    //       || PlayerStatus.DISCARD == Players[msg.sender].status) {
    //         // 正在玩游戏，未结算，不允许离开房间
    //         //return address(1);
    //     }

    //     leaveTable(); //离开桌子
    //     //cancelSitting(); //取消坐下
    //     PlayerInfo memory pInfo ;
    //     // 转出筹码
    //     TokenAbi(tokenAddress).transferToken(address(this), msg.sender, Players[msg.sender].amount);
    //     Players[msg.sender] = pInfo;

    //     return address(65670);
    // }

 /**
     * @dev 开始游戏
     * @param tableId Table的ID
     * @param hand 局数（即第几局开始）
     */
    function startGame(uint tableId, uint32 hand) public returns(bool) {
        address playerAddr = msg.sender;

        PlayerInfo memory pInfo = Players[playerAddr];

        require(tableId == pInfo.tbNum);
        require(pInfo.status == PlayerStatus.READY);
        
        require(Tables[pInfo.tbNum].readyNum >= Tables[pInfo.tbNum].minimum);
        require(Tables[pInfo.tbNum].startPlayer == playerAddr);
        require(Tables[pInfo.tbNum].currentHand == hand);
        require(Tables[pInfo.tbNum].currentStatus == TableStatus.NOTSTARTED);     // Table未开始游戏

        Tables[pInfo.tbNum].currentStatus = TableStatus.STARTED;

        address[] memory players = Tables[pInfo.tbNum].players;
        for (uint i = 0; i < players.length; i++) {
            if (Players[players[i]].status == PlayerStatus.READY) {
                Players[players[i]].status = PlayerStatus.PLAYING;
            }
        }
        
        emit StartGame(address(this), pInfo.tbNum, playerAddr, pInfo.seatNum, Tables[pInfo.tbNum].currentHand);
        return true;
    }
    /**
     * @dev 玩家开始
     * @param hand 局数（即在第几局弃牌）
     */
    function start(uint tableId, uint32 hand) public returns(bool){
        address playerAddr = msg.sender;
        PlayerInfo memory pInfo = Players[playerAddr];

        require(tableId == pInfo.tbNum,"错误table id");
        require(pInfo.status == PlayerStatus.SEATED,"用户错误状态码");
        require(pInfo.amount >= 2 * Tables[tableId].smallBlind,"筹码不够");  // 玩家的筹码数大于等于大盲数
        
        require(Tables[tableId].currentHand == hand,"局数不匹配");
        require(Tables[tableId].currentStatus == TableStatus.NOTSTARTED,"talbe 未开始");     // Table未开始游戏

        Tables[tableId].readyNum++;
        Players[playerAddr].status = PlayerStatus.READY;

        emit Start(address(this), tableId, playerAddr, pInfo.seatNum, hand);

        if(Tables[tableId].readyNum < Tables[tableId].minimum) {
            return true;
        }

        if(Tables[tableId].startPlayer != address(0)) {
            return true;
        }

        uint playerNum = Tables[tableId].players.length;

        uint rand = uint(sha256(block.difficulty, now)) % playerNum;
        uint select;
        address tmpAddr;
        for(uint i = 0; i < playerNum; i++) {
            select = (rand + i) % playerNum;
            tmpAddr = Tables[tableId].players[select];
            if(address(0) == tmpAddr) {
                continue;
            }
            if(PlayerStatus.READY == Players[playerAddr].status) {
                Tables[tableId].startPlayer = tmpAddr;
                emit SelectStarter(address(this), tableId, tmpAddr, select, hand);
                break;
            }
        }

        return true;
    }

    /**
     * @dev 弃牌
     * @param hand 局数（即在第几局弃牌）
     */
    function discard( uint256 hand) public {
        address playerAddr = msg.sender;
        PlayerInfo memory pInfo = Players[playerAddr];
        var tableId = pInfo.tbNum;
        
        require(PlayerStatus.PLAYING == pInfo.status);
        require(hand == Tables[pInfo.tbNum].currentHand);

        Players[playerAddr].status = PlayerStatus.DISCARD;

        emit Discard(address(this), tableId, playerAddr, pInfo.seatNum, hand);
    }

    /**
     * @dev 弃牌
     * @param data 弃牌数据(包括签名)
     */
    function discard2(bytes data) public {
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
        uint tableId = msgItems[2].toUint();

        address[] memory players = Tables[tableId].players;
        require(pos < players.length);
        address playerAddr = players[pos];
        require(rlpToAddress(msgItems[3]) == address(this));
        require(msgItems[4].toUint() == Tables[tableId].currentHand);

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

        require(ecrecover(keccak256(msgData), v, r, s) == playerAddr);

        PlayerInfo memory pInfo = Players[playerAddr];

        require(tableId == pInfo.tbNum);
        require(PlayerStatus.PLAYING == pInfo.status);

        Players[playerAddr].status = PlayerStatus.DISCARD;

        emit Discard(address(this), tableId, playerAddr, pInfo.seatNum, Tables[tableId].currentHand);
    }

    /**
     * @dev 验证签名
     * @param sigs      签名信息
     * @param msg       签名消息
     * @param tableId   Table的ID
     */
    function verifySigs(bytes sigs, bytes32 msg, uint tableId) internal returns(bool) {
        address[] memory players = Tables[tableId].players;

        uint i;
        uint j;

        uint8[] memory mark = new uint8[](players.length);
        for(i = 0; i < players.length; i++) {
            mark[i] = 0;
        }

        uint playingNum = 0;
        for(i = 0; i < players.length; i++) {
            if(address(0) == players[i]) {
                continue;
            }

            if (PlayerStatus.PLAYING == Players[players[i]].status) {
                playingNum++;
                mark[i] = 1;
            }
        }

        uint sigLen = 65 * playingNum;
        if (sigs.length != sigLen){
            return false;
        }

        uint8 v;
        bytes32 r;
        bytes32 s;
        for (i = 0; i < playingNum; i++) {
            assembly {
                r := mload(add(sigs, add(32, mul(i, 65))))
                s := mload(add(sigs, add(64, mul(i, 65))))
                v := mload(add(sigs, add(65, mul(i, 65))))
            }

            if (v < 27) {
                v += 27;
            }

            address addr = ecrecover(msg, v, r, s);
            // emit SettlePlayer(addr, currentHand);
            for (j = 0; j < players.length; j++) {
                if (players[j] == addr) {
                    mark[j] = 0;
                    break;
                }
            }
        }

        for(i = 0; i < mark.length; i++) {
            if(1 == mark[i]) {
                return false;
            }
        }
        return true;
    }

    function resetNotray(uint tableId) internal {
        for(uint i = Notarys[tableId].length; i > 0; i--) {
            delete Notarys[tableId][i - 1].nrAddr;
            delete Notarys[tableId][i - 1].allocate;

            delete Notarys[tableId][i - 1];
        }

        Notarys[tableId].length = 0;
    }

    //重置table的状态
    function reset(uint tableId) internal {
        address[] memory players = Tables[tableId].players;
        uint i;
        for(i = 0; i < players.length; i++) {
            Players[players[i]].status = PlayerStatus.SEATED;
        }

        Tables[tableId].currentStatus = TableStatus.NOTSTARTED;
        Tables[tableId].startPlayer = address(0);
        Tables[tableId].readyNum = 0;
        resetNotray(tableId);
    }

    /**
     * @dev 结算
     * @param sigs  签名信息
     * @param data  分配方案
     */
    function settle(uint8 src, bytes sigs, bytes data) internal returns(bool) {
        RLP.RLPItem memory bal = data.toRLPItem();
        require(bal.isList(),"rlp data error");
        RLP.RLPItem[] memory settledata = bal.toList();

        require(settledata.length == 4,"rlp data length error");

        require(address(this) == rlpToAddress(settledata[0]),"game contract address error");

        uint tableId = settledata[1].toUint();
        require(uint32(settledata[2].toUint()) == Tables[tableId].currentHand,"table hand error");

        if(uint8(Data_Src.PLAYER) == src) {
            // 玩家提交需要验证签名
            bytes32 msg = keccak256(data);
            require(verifySigs(sigs, msg, tableId),"play sign error");
        }
        
        if(uint8(Data_Src.NORTARY) == src) {
            // uint tableId = 20181001;
            // Inter(interManage).reApplyForInters(tableId);
        }

        require(settledata[3].isList(),"rlp data input error");


        RLP.RLPItem[] memory itemDatas = settledata[3].toList();

        address[] memory players = Tables[tableId].players;

        // 下面需要改为事务
        uint i;
        uint add;
        uint sub;
        for(i = 0; i < itemDatas.length; i++) {
            require(itemDatas[i].isList(),"item data error");


            RLP.RLPItem[] memory item = itemDatas[i].toList();
            require(item.length == 3,"item length error");


            address playerAddr = players[item[0].toUint()];
            
            if(1 == item[1].toUint()) {
                Players[playerAddr].amount = Players[playerAddr].amount.add(item[2].toUint());
                add = add.add(item[2].toUint());
            } else {
                Players[playerAddr].amount = Players[playerAddr].amount.sub(item[2].toUint());
                sub = sub.add(item[2].toUint());
            }

            emit SettleItemData(address(this), tableId, Tables[tableId].currentHand, uint8(item[0].toUint()), uint8(item[1].toUint()), item[2].toUint());
        }

        require(add == sub,"add != sub");

        emit Settle(Tables[tableId].currentHand,Tables[tableId].playerNum,tableId);
        reset(tableId);

        //Notary(notaryManage).reNotarize(tableId);
        Tables[tableId].currentHand++;
        return true;
    }

    /**
     * @dev 结算

     * @param data  分配方案
     */
    function playerSettle(bytes data) public returns(bool){
        uint i;
        uint playingNum = 0;
        address[] memory players =  Tables[Players[msg.sender].tbNum].players;
        for(i = 0; i < players.length; i++) {
            if (PlayerStatus.PLAYING == Players[players[i]].status) {
                playingNum++;             
            }
        }
        uint sigLen = 65 * playingNum;
        require(data.length > sigLen,"data length error");

        bytes memory balData = new bytes(data.length - sigLen);
        bytes memory sigs = new bytes( sigLen);
        for(i = sigLen; i < data.length; i++) {
            balData[i - sigLen] = data[i];
        }
        for(i = 0; i < sigLen; i++) {
            sigs[i] = data[i];
        }
        return settle(uint8(Data_Src.PLAYER), sigs, balData);
    }

    /**
     * @dev 公证者提交公证
     * @param data 分配方案
     */
    function submitNotary(uint256 tableid,bytes data) public returns(bool) {
        emit SubmmitSettleData(msg.sender, data.length, data);
        var dhash = keccak256(data);
        address nrAddr = msg.sender;
        // uint tableId = 20181001;

        RLP.RLPItem memory bal = data.toRLPItem();
        require(bal.isList(),"rlp data err");
        RLP.RLPItem[] memory settledata = bal.toList();

        require(settledata.length == 4,"rlp data length error");

        require(address(this) == rlpToAddress(settledata[0]),"address error");
  

        uint tableId = settledata[1].toUint();
        require (tableid == tableId && uint32(settledata[2].toUint()) == Tables[tableId].currentHand,"tableid currenthand error"); 

        address[] memory notarys = NotaryAbi(notaryManage).getNotaryList(address(this), tableId);
        // if(notarys.length <= 0) {
        //     //emit SettleError(address(this), tableId, uint8(Data_Src.NORTARY), uint8(ErrorCode_Settle.NOT_APP_NORTARY));
        //     return;
        // }

        uint i;
        bool flg = false;
        for(i = 0; i < notarys.length; i++) {
            // 判断提交者是否在公证者列表中
            if(nrAddr == notarys[i]) {
                flg = true;
                break;
            }
        }

        require(flg,"notary error");

        for(i = 0; i < Notarys[tableId].length; i++) {
            if(Notarys[tableId][i].nrAddr == nrAddr) {
                // 已提交，最新的覆盖旧的
                delete Notarys[tableId][i].allocate;
                Notarys[tableId][i].allocate = dhash;
                return true;
            }
        }

        Notarys[tableId].push(NotaryInfo(nrAddr, dhash));
        if(notarys.length == Notarys[tableId].length) {
            doNotarize(tableId,data);
        }
        return true;
    }

    function doNotarize(uint tableId,bytes data) internal returns(bool) {
        address[] memory notarys = NotaryAbi(notaryManage).getNotaryList(address(this), tableId);
        require(notarys.length > 0,"notary not exist");

        uint lenNrInfo = Notarys[tableId].length;
        require(lenNrInfo>0,"notary not fond");

        uint i;
        bytes32 firstNrInfo = Notarys[tableId][0].allocate;
        for(i = 1; i < lenNrInfo; i++) {
            if(Notarys[tableId][i].allocate != firstNrInfo) {
                // 执行公证再进行比较，是因为允许公证者重复提交公证信息，新的覆盖旧的
                //emit SettleError(address(this), tableId, uint8(Data_Src.NORTARY), uint8(ErrorCode_Settle.DATA_INCONSISTENCY));
                NotaryAbi(notaryManage).reNotarize(tableId);
                return true;
            }
        }

        settle(uint8(Data_Src.NORTARY), new bytes(0), data);
        emit FinishNotary(tableId,Tables[tableId].currentHand);
        return true;
    }



    /**
     * @dev 获取已提交公证的公证者列表
     * @param tableId table的号码
     */
    function getSubNotorys(uint tableId) public view returns(address[] addrs) {
        addrs = new address[](Notarys[tableId].length);
        for(uint i = Notarys[tableId].length; i > 0; i--) {
            addrs[i - 1] = Notarys[tableId][i - 1].nrAddr;
        }
    }

    function resetNotoryInfo(uint tableId) public {
        require(msg.sender == notaryManage);
        resetNotray(tableId);
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
        /**
     * @dev 玩家申请Inter
     * @param number 个数
     */
    function applyInter(uint256 number) public returns(string ret) {
        uint256 tableid = Players[msg.sender].tbNum;

        if(tableid == 0){
            return "table not exist";
        }
        ret = InterAbi(interManage).select(tableid, msg.sender, number);
        emit SelectInter(tableid, number);
        return ret;
    }
    function applyNotarize(uint256 number) public returns(string) {
        uint256 tableid = Players[msg.sender].tbNum;
        if(tableid == 0){return "table not exist";}


        if((PlayerStatus.PLAYING) != Players[msg.sender].status){return "table not playing";}   // 在游戏进行中的玩家才允许申请公证

        NotaryAbi(notaryManage).applyNotorys(tableid, msg.sender, number);
        return "";
    }
 
    /**
     * @dev 公证这完成table公证
     */
    function finishNotarize(uint256 tableid) public returns(bool) {

        if (tableid == 0){return false;}

        NotaryAbi nr = NotaryAbi(notaryManage);
        nr.finishNotarize(tableid);

        return true;
    }
}