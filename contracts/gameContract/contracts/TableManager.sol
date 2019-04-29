pragma solidity ^0.4.20;

import './LibContract.sol';
import './SafeMath.sol';
import './NotaryAbi.sol';
import './InterAbi.sol';
import './TokenAbi.sol';

import './RLP.sol';
import './RLPEncode.sol';
import './Strings.sol';

contract TableManager is LibContract{
    using SafeMath for uint256;
    using Strings for *;
    using RLP for bytes;
    using RLP for RLP.RLPItem;
    using RLP for RLP.Iterator;
    string  public name;                    //合约名称
    address public owner;          
    address public authorityAddress;        //权限合约地址
    address public tokenAddress;            //代币合约
    address public interManage;             //转发者管理合约
    address public notaryManage;            //公证者管理合约
    address public tableFunAddress;         //table 逻辑合约
    uint256 public tableNonce=1;            //tableid
    mapping(address => uint256) balances;   //用户筹码
    enum PlayStatus {
        WAITING, 
        NOTSEATED,  // 已加入房间，但未坐在table中
        SITTING,    // 等待入座table
        SEATED,     // 已坐下table
        READY,      // 准备游戏
        PLAYING,    // 正在游戏中
        DISCARD     // 弃牌
        }

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
        uint256 level;              //
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
    address public  luaAddress; //lua游戏合约地址

    constructor()payable public {
        name = "TableManager";
        owner = msg.sender;
        _setContract("TableManager",this); //注册合约到模块

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
        _setGas(100000000000,100000000);
        _grant(owner);
        _setPayer();
    }
    function setTokenAddr(address addr) public onlyOwner {
        tokenAddress = addr;
    }


    function setInterAddr(address addr) public onlyOwner {
        interManage = addr;
    }


    function setNotaryAddr(address addr) public onlyOwner{
        notaryManage = addr;
    }

    function setTableFunAddr(address addr) public onlyOwner{
        tableFunAddress = addr;
    }
    function startPlayer()public view returns(address){
        return tables[myTable[msg.sender]].startPlayer;
    }
    function balanceOf(address addr) public view returns(uint256){
        return balances[addr];
    }
    //function getPlayerTable()public view returns(uint256){
    //    return getTable(myTable[msg.sender]);
    //}

    // function getTable(uint256 tableid)public view returns(uint256){
    //     table memory tb = tables[tableid];
    //     return tb.tableid;
    // }

    function tableid()public view returns(uint256){
        return myTable[msg.sender];
    }
    function seats()public view returns(address[] ret){
        ret = new address[](tables[myTable[msg.sender]].seats.length);
        for(uint i=0;i<tables[myTable[msg.sender]].seats.length;i++){
            ret[i]=tables[myTable[msg.sender]].seats[i].playerAddr;
        }
        
    }
    //兼容inter
    function getTablePlayingPlayers(uint256 tableid)public view returns(uint number, address[] players) {
        players = new address[](tables[tableid].seats.length);
        for(uint i=0;i<tables[tableid].seats.length;i++){
            players[i]=tables[tableid].seats[i].playerAddr;
        }
        return (tables[tableid].seats.length,players);
    }

    function getSeatInfo(uint256 index) public view returns(uint256 ,address ,uint256 ,uint256 ){
        return seatInfo(index,myTable[msg.sender]);
    }
    function seatInfo(uint256 index,uint256 tableid) public view returns(uint256 ,address ,uint256 ,uint256 ){
        if(index >= tables[tableid].seats.length){
            return (0,address(0),0,0);
        }
        return (index,tables[tableid].seats[index].playerAddr,balances[tables[tableid].seats[index].playerAddr],uint256(tables[tableid].seats[index].status));
   
    }
    function getTableInfo(uint256 tableid) public view returns ( uint256 ,address, uint256, uint256, uint256, uint256,uint256) {
        
        return ( tableid,tables[tableid].creator,tables[tableid].minimum, tables[tableid].maximum, tables[tableid].needChips, tables[tableid].smallBlind, uint256(tables[tableid].currentStatus));
    }
        /**
     * @dev 创建桌子
     * @param minimum       玩家的最少参与人数，必须大于2
     * @param maximum       最多参与人数
     * @param needChips     参与筹码
     * @param smallBlind    小盲注
     */
    function createTable(uint256 minimum, uint256 maximum, uint256 needChips, uint256 smallBlind) public returns(string ret) {
        if(minimum < 2){return "minimum < 2";}
        if(maximum < minimum){return "maximum < minimum";}
        if(smallBlind < 1){return "smallBlind < 1";}
        if(needChips <= 2 * smallBlind){return "needChips < 2*smallBlind";}
        if(myTable[msg.sender] !=0){return "table exist";}

        TokenAbi token = TokenAbi(tokenAddress);
        uint256 balance = token.balanceOf(msg.sender);
        if(balance < needChips){return "val<nd";}

        uint256 tableid = tableNonce;
        tableNonce++;
        //table  tableInfo;
        tables[tableid].tableid = tableid;
        tables[tableid].creator = msg.sender;
        tables[tableid].needChips = needChips;
        tables[tableid].minimum = minimum;
        tables[tableid].maximum = maximum;
        tables[tableid].smallBlind = smallBlind;
        tables[tableid].currentHand = 1;
        tables[tableid].currentStatus = TableStatus.NOTSTARTED;

        tables[tableid].startPlayer = address(0);
        tables[tableid].index = 0;

        tableList.push(tableid);
        
        uint256 bal =0;
        if (balances[msg.sender]<=needChips){
            bal = needChips-balances[msg.sender];
        } 
        if (balances[msg.sender]>needChips) {
            token.transfer(msg.sender,balances[msg.sender]-needChips);
            balances[msg.sender]=needChips;
        }
        ret= token.transferForTM(tableid,msg.sender, this, bal);
        emit CreateTable(msg.sender,  tableid,   minimum,  maximum,  needChips,  smallBlind);
    }

    //销毁桌子
    function destroyTable() public returns(string){
        uint256 tableid = myTable[msg.sender];
        if(tables[tableid].tableid == 0){
            return "table not exist";
        }
        
        if(tables[tableid].creator!=msg.sender){
            return "not table creator ";
        }
        
        if(tables[tableid].currentStatus == TableStatus.STARTED){
            return "table is running";
        }
        TokenAbi token = TokenAbi(tokenAddress);
        //退出位子上的用户
        for(uint256 i=0;i<tables[tableid].seats.length;i++){
            delete myTable[tables[tableid].seats[i].playerAddr];
            token.transfer(tables[tableid].seats[i].playerAddr,balances[tables[tableid].seats[i].playerAddr]);
            delete balances[tables[tableid].seats[i].playerAddr];
        }
        //delete tableList[tables[tableid].index];
        tableList[tables[tableid].index]=tableList[tableList.length-1];
        
        tables[tableList[tables[tableid].index]].index=tables[tableid].index;
        tableList.length--;
        
        delete tables[tableid];
        InterAbi(interManage).release(tableid); //释放table 上的inter
        emit DestroyTable(msg.sender, tableid);
        return "";
    }

    function getTableList(uint256 pagenum, uint256 pagesize) public view returns(uint256 len, uint256[] tblist) {
        
        if(tableList.length<pagenum*pagesize){
            return (tableList.length,tblist);
        }

        uint256 number=0;
        uint256 size = 0;
        if((pagenum+1)*pagesize<=tableList.length){
            size= pagesize;
        } else  {
            size = pagesize-((pagenum+1)*pagesize-tableList.length);
        }
        tblist = new uint256[](size);
        for(var start = pagenum*pagesize;start<(pagenum+1)*pagesize;start++){
            if(start>=tableList.length){
                break;
            }
            tblist[number] = tableList[start];
            number++;
        }
       
        return (tableList.length,tblist);
    }
    
    /**
     * @dev 玩家申请Inter
     * @param number 个数
     */
    function applyInter(uint256 number) public returns(string ret) {
        uint256 tableid = myTable[msg.sender];

        if(tableid == 0){
            return "table not exist";
        }
        ret = InterAbi(interManage).select(tableid, msg.sender, number);
        emit SelectInter(tableid, number);
        return ret;
    }
    function reApplyInter(uint256 number) public returns(string ret) {
        uint256 tableid = myTable[msg.sender];

        if(tableid == 0){
            return "table not exist";
        }
        ret = InterAbi(interManage).reSelect(tableid);
        emit SelectInter(tableid, number);
        return ret;
    } 
    //上报失效inter
    function failInter(address interAddress)public returns(string ret){
        if(myTable[msg.sender] == 0){
            return "table not exist";
        }
        return InterAbi(interManage).failInter(myTable[msg.sender], msg.sender, interAddress);
    }
    /**
     * @dev 玩家申请公证
     * @param number 个数
     */
    function applyNotarize(uint256 number) public returns(string) {
        uint256 tableid = myTable[msg.sender];
        if(tableid == 0){return "table not exist";}

        //require(tableAddr != address(0));
     

        //判断是不是tablemanager管理的table

        var (pos, playerAddr, amount, status) = getPlayerInfo(msg.sender);
        if(address(playerAddr) == address(0)) {
            // emit DestroyTable(playerAddr, tableAddr);
            return ("table not exist");
        }
        // require(address(playerAddr) != address(0));
        if(uint256(PlayStatus.PLAYING) != status){return "table not playing";}   // 在游戏进行中的玩家才允许申请公证

        NotaryAbi nr = NotaryAbi(notaryManage);
        return nr.applyNotorys(tableid, msg.sender, number);
    }
    /**
     * @dev 获取玩家信息
     * @param addr 玩家地址
     */
    function getPlayerInfo(address addr) public view returns (uint256, address, uint256, uint256) {
        Seat[]  storage seats  = tables[myTable[addr]].seats;
        for (uint256 i = 0; i < seats.length; i++) {
            if (seats[i].playerAddr == addr) {
                return (uint256(i), seats[i].playerAddr, balances[addr], uint256(seats[i].status));
            }
        }

        return (0, address(0), 0, 0);
    }

    //获取table 局数
    function getCurrentHand()public view returns(uint256){
        return currentHand(myTable[msg.sender]);
    }
    function currentHand(uint256 tableid)public view returns(uint256){
        return tables[tableid].currentHand;
    }
    //获取筹码
    function quota()public returns(uint256){
        return needChips(myTable[msg.sender]);
    }
    function needChips(uint256 tableid)public view returns(uint256){
        return  tables[tableid].needChips;
    }


    function reset(uint256 tableid) internal {
        Seat[] storage seats = tables[tableid].seats;
        // 重置所有玩家的状态
        for (uint256 i = 0; i < seats.length; i++) {
            tables[tableid].seats[i].status = PlayStatus.WAITING;
        }

        tables[tableid].currentStatus = TableStatus.NOTSTARTED;
        tables[tableid].startPlayer = EMPTYADDR;
        resetNotray(tableid);
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

    function startGame(uint32 hand) public returns(string){
        //tableFunAddress.delegatecall(ID_STARTGAME,hand);
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
        //tableFunAddress.delegatecall(ID_JOIN,tableid,from,value);
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
        //tableFunAddress.delegatecall(ID_START,hand);
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
        //tableFunAddress.delegatecall(ID_DISCARD,hand);
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
        //tableFunAddress.delegatecall(ID_DISCARD2,data);
        //emit SettleData(msg.sender, data.length, data);
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
        //tableFunAddress.delegatecall(ID_LEAVE);
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

        if(settledata.length != 4) {
            //emit SettleError(msg.sender, src, uint256(ErrorCode_Settle.DATASTRUCT));
             return "2";
        }

        if(address(this) != rlpToAddress(settledata[0])) {
            //emit SettleError(msg.sender, src, uint256(ErrorCode_Settle.ADDR_DISMATCH));
            return "3";
        }
        //tableid
        if(settledata[1].toUint() != tables[tableid].tableid) {
            //emit SettleError(msg.sender, src, uint256(ErrorCode_Settle.HAND_DISMATCH));
             return "4";
        }
        if(settledata[2].toUint() != tables[tableid].currentHand) {
            //emit SettleError(msg.sender, src, uint256(ErrorCode_Settle.HAND_DISMATCH));
             return "hand";
        }
        if(!settledata[3].isList()) {
            //emit SettleError(msg.sender, src, uint8(ErrorCode_Settle.DATASTRUCT));
            return "5";
        }
        //return "结构end";
        // require(settledata[2].isList(), "settlement data struct error");
        RLP.RLPItem[] memory itemDatas = settledata[3].toList();

        uint i;
        uint256 add;
        uint256 sub;
        for(i = 0; i < itemDatas.length; i++) {
            // require(itemDatas[i].isList());
            if(!settledata[3].isList()) {
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
                add = add.add(item[2].toUint());
            }
            else {
                balances[seats[item[0].toUint()].playerAddr] = balances[seats[item[0].toUint()].playerAddr].sub(item[2].toUint());
                sub = sub.add(item[2].toUint());
            }

            //emit SettleItemData(tableid,seats[item[0].toUint()].playerAddr, uint256(item[0].toUint()), tables[tableid].currentHand, uint256(item[1].toUint()), uint256(item[2].toUint()));
        }
        //加减不平衡
        if (add != sub){
            revert();
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
    /**
     * @dev 结算
     * @param data 分配方案(包括签名)
     */
    function settle(bytes data) public returns(string ret) {
        //tableFunAddress.delegatecall(ID_SETTLE,data);
        // emit SettleData(msg.sender, data.length, data);
        uint256 tableid = myTable[tx.origin];
        uint i;
        uint j;
        uint playingNum = 0;
        Seat[] storage seats = tables[tableid].seats;
        for (i = 0; i < seats.length; i++) {
            if(address(0) == seats[i].playerAddr) {
                continue;
            }
            if (PlayStatus.PLAYING == seats[i].status ) {
                playingNum++;
            }
        }
       
        uint sigLen = 65 * playingNum;
        if(data.length <= sigLen){
            return "签名数据错误";
        }
        bytes memory balData = new bytes(data.length - sigLen);

        for(i = sigLen; i < data.length; i++) {
            balData[i - sigLen] = data[i];
        }

        // emit Key2Data("balBalData", balData);
       

        bytes32 msg = keccak256(balData);

        uint8[] memory mark = new uint8[](tables[tableid].maximum);

        for(i = 0; i < tables[tableid].maximum; i++) {
            mark[i] = 0;
        }

        
        uint8 v;
        bytes32 r;
        bytes32 s;
        for (i = 0; i < playingNum; i++) {
            assembly {
                r := mload(add(data, add(32, mul(i, 65))))
                s := mload(add(data, add(64, mul(i, 65))))
                v := mload(add(data, add(65, mul(i, 65))))
            }

            if (v < 27) {
                v += 27;
            }

            // emit RecoverData(msg, v, r, s);
            address addr = ecrecover(msg, v, r, s);
            emit SettlePlayer(addr, tables[myTable[addr]].currentHand);

            for (j = 0; j < seats.length; j++) {
                if (seats[j].playerAddr == addr) {
                    mark[j] = 1;
                    break;
                }
            }
        }

        for (j = 0; j < seats.length; j++) {
            if(address(0) == seats[j].playerAddr) {
                continue;
            }
            if (PlayStatus.PLAYING == seats[j].status && 1 != mark[j]) {
                // emit SettlePlayerAbsent(seats[j].playerAddr, uint8(j), currentHand);
                //revert();
                return "用户不在准备状态";
            }
        }
        
        ret = allocate(balData, uint8(Data_Src.PLAYER));
        if(keccak256(ret) != keccak256("")) {
            return ret;
        }
        
        emit Settle(tables[tableid].currentHand, uint256(playingNum),tableid);

        tables[tableid].currentHand++;
        reset(tableid);
        return "";
    }
    function compare(bytes one, bytes other) internal returns (int) {
        if(one.length != other.length) {
            return 1;
        }

        for(uint i = 0; i < one.length; i++) {
            if(one[i] != other[i]) {
                return 1;
            }
        }

        return 0;
    }


    function validate(uint256 tableid,bytes data) internal returns (bool) {
        // require(data.length > 0);
        if(data.length <= 0) {
           // emit SettleError(msg.sender, uint256(Data_Src.NORTARY), uint256(ErrorCode_Settle.DATASTRUCT));
            return false;
        }

        RLP.RLPItem memory nrInfo = data.toRLPItem();
        // require(nrInfo.isList());
        if(!nrInfo.isList()) {
           // emit SettleError(msg.sender, uint256(Data_Src.NORTARY), uint256(ErrorCode_Settle.DATASTRUCT));
            return false;
        }
        RLP.RLPItem[] memory lsInfo = nrInfo.toList();

        if(lsInfo.length != 4) {
           // emit SettleError(msg.sender, uint256(Data_Src.NORTARY), uint256(ErrorCode_Settle.DATASTRUCT));
            return false;
        }

        if(address(this) != rlpToAddress(lsInfo[0])) {
           // emit SettleError(msg.sender, uint256(Data_Src.NORTARY), uint256(ErrorCode_Settle.ADDR_DISMATCH));
            return false;
        }
        if(lsInfo[1].toUint() != tableid) {
            //emit SettleError(msg.sender, src, uint256(ErrorCode_Settle.HAND_DISMATCH));
             return false;
        }
        if(uint32(lsInfo[2].toUint()) != tables[tableid].currentHand) {
            //emit SettleError(msg.sender, uint256(Data_Src.NORTARY), uint256(ErrorCode_Settle.HAND_DISMATCH));
            return false;
        }

        // require(3 == lsInfo.length);
        // require(address(this) == lsInfo[0].toAddress());
        // require(uint32(lsInfo[1].toUint()) == currentHand);

        return true;
    }

    function resetNotray(uint256 tableid) internal {
        NotaryInfo[] storage notaryInfos = tables[tableid].notaryInfos;
        for(uint i = notaryInfos.length; i > 0; i--) {
            delete notaryInfos[i - 1].notary;
            delete notaryInfos[i - 1].allocate;
            
            delete notaryInfos[i - 1];
        }
        notaryInfos.length = 0;
    }
    /**
     * @dev 公证者提交公证
     * @param info 分配方案
     */
    function submitNotary(uint256 tableid,bytes info) public returns(string ret){
        //tableFunAddress.delegatecall(ID_SUBMITNORARY,tableid,info);
        NotaryInfo[] storage notaryInfos = tables[tableid].notaryInfos;
        emit SettleData(tableid,msg.sender, notaryInfos.length, info);
        // // require(validate(info));
        if(!(validate(tableid,info))) {
            return;
        }

        address addr = msg.sender;
        address[] memory notarys = NotaryAbi(notaryManage).getNotaryList(this,tableid);

        // require(notarys.length > 0);
        if(notarys.length <= 0) {
            emit SettleError(msg.sender, uint256(Data_Src.NORTARY), uint256(ErrorCode_Settle.NOT_APP_NORTARY));
            return;
        }

        uint i;
        bool flg = false;
        for(i = 0; i < notarys.length; i++) {
            // 判断提交者是否在公证者列表中
            if(addr == notarys[i]) {
                flg = true;
                break;
            }
        }

        // require(flg == true);
        if(!flg) {
           // emit SettleError(msg.sender, uint256(Data_Src.NORTARY), uint256(ErrorCode_Settle.NORTARY_NOTIN_LIST));
            return;
        }

        if(0 == notaryInfos.length) {
            notaryInfos.push(NotaryInfo(addr, info));
            return;
        }

        flg = true;
        for(i = 0; i < notaryInfos.length; i++) {
            if(notaryInfos[i].allocate.length != 0) {
                if(compare(notaryInfos[i].allocate, info) != 0) {
                    //emit SettleError(msg.sender, uint256(Data_Src.NORTARY), uint256(ErrorCode_Settle.DATA_INCONSISTENCY));
                    flg = false;
                    break;
                }
            }

            // require(addr != notaryInfos[i].notary);  // 如果已经提交了公证信息，则不能再提交
            if(addr == notaryInfos[i].notary) {
               // emit SettleError(msg.sender, uint256(Data_Src.NORTARY), uint256(ErrorCode_Settle.RE_SUBMIT));
                return;
            }
        }

        if(!flg) {
            // 重新公证
            // 不采用require,assert机制，resetNotray完成，reNotarize失败，这时上一次申请的公证者可以再次提交公证，怎么解决？
            resetNotray(tableid);
            if(reNotarize(tableid)) {
                //emit SettleError(msg.sender, uint256(Data_Src.NORTARY), uint256(ErrorCode_Settle.RE_NOTARIZE)); 
            }
            else {
                //emit SettleError(msg.sender, uint256(Data_Src.NORTARY), uint256(ErrorCode_Settle.RE_NOTARIZE_ERR));
            }
            return;
        }

        notaryInfos.push(NotaryInfo(addr, new bytes(0)));

        if(notaryInfos.length == notarys.length) {
            //进行资金分配
            ret = allocate(info, uint8(Data_Src.NORTARY));
            if(keccak256(ret) != keccak256("")) {
                resetNotray(tableid);
                if(reNotarize(tableid)) {
                   //emit SettleError(msg.sender, uint256(Data_Src.NORTARY), uint256(ErrorCode_Settle.RE_NOTARIZE)); 
                }
                else {
                    //emit SettleError(msg.sender, uint256(Data_Src.NORTARY), uint256(ErrorCode_Settle.RE_NOTARIZE_ERR));
                }
                return;
            }

            finishNotarize(tableid);

            emit FinishNotary(tableid,tables[tableid].currentHand);

            tables[tableid].currentHand++;
            reset(tableid);
        }
    }

    /**
     * @dev table申请重新公证
     */
    function reNotarize(uint256 tableid) public returns(bool) {
        //address tableAddr = msg.sender;
        if (tables[myTable[msg.sender]].tableid == 0){return false;}
        //判断是不是tablemanager管理的table
        // bool flg = false;
        // for(uint i = 0; i < tables.length; i++) {
        //     if(tables[i].addr == tableAddr)
        //     {
        //         flg = true;
        //         break;
        //     }
        // }
        // // require(true == flg);
        // if(!flg) {
        //     return false;
        // }

        NotaryAbi nr = NotaryAbi(notaryManage);
        return nr.reNotarize(tableid);
    }
    /**
     * @dev 公证这完成table公证
     */
    function finishNotarize(uint256 tableid) public returns(bool) {
        //address tableAddr = msg.sender;
        //uint256 tableid = myTable[msg.sender];
        if (tableid == 0){return false;}
        //判断是不是tablemanager管理的table
        // bool flg = false;
        // for(uint i = 0; i < tables.length; i++) {
        //     if(tables[i].addr == tableAddr)
        //     {
        //         flg = true;
        //         break;
        //     }
        // }
        // require(true == flg);
        // if(!flg) {
        //     return false;
        // }

        NotaryAbi nr = NotaryAbi(notaryManage);
        nr.finishNotarize(tableid);

        return true;
    }

    //     //设置合约白名单用户
    // function grant(address addr)public{
    //     _grant(addr);
    // }

    // //移除用户地址白名单
    // function revoke(address addr) public {
    //     _revoke(addr);
    // }

}
