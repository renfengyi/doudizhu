pragma solidity ^0.4.20;

import './LibContract.sol';
import './TokenAbi.sol';
import './InterAbi.sol';
import './NotaryAbi.sol';
import './SafeMath.sol';
import './DataTime.sol';
import './RLP.sol';

contract CroomManager  is LibContract{
    using SafeMath for uint;
    using RLP for bytes;
    using RLP for RLP.RLPItem;
    using RLP for RLP.Iterator;

    event JoinSittingQueen(address playerAddr, address roomAddr);
    event AllotTable(address roomAddr,uint tableid);
    event LeaveTable(address roomAddr, uint tbid, address playerAddr, uint pos);
    event Start(address roomAddr, uint tbid, address playerAddr, uint pos, uint hand);
    event GameStart(address roomAddr, uint tbid, uint hand);
    event Discard(address roomAddr, uint tbid, address playerAddr, uint pos, uint hand);
    event SubmmitSettleData(address nrAddr, uint datalength, bytes data);
    event SettleError(address roomAddr, uint tableid, uint datasrc, uint errcode);
    event Settle( uint hand,uint playingNum,uint tableid);
    event FinishNotary(uint tableid,uint hand);
    event ReShaff(uint tableid,uint hand);
    // 玩家状态
    enum PlayerStatus {
        NOTJION,    // 未加入房间
        NOTSEATED,  // 弃用状态
        SITTING,    // 等待入座table
        SEATED,     // 已坐下table
        READY,      // 准备游戏
        PLAYING,    // 正在游戏中
        DISCARD     // 弃牌
    }

    enum TalbeStatus {NOTSTARTED, STARTED}      // table的状态，NOTSTARTED:未开始游戏; STARTED:已开始游戏

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
        uint        tbid;          //
        uint      currentHand;    // 当前正在局数，结算一次，局数加１
        TalbeStatus currentStatus;  // 当前table的状态
        address[]   players;        // table中的玩家
    }

    struct PlayerInfo {
        uint    tbid;          // table的号码, 格式：数字+日期，如 100020181015　表示20181015的第1000张Table
        uint    seatNum;        // 座位号
        uint    amount;         // 剩余金额
        PlayerStatus status;    // 玩家状态
        bool    reshaff;        //申请重新洗牌
    }

    struct NotaryInfo {
        address nrAddr;
        bytes32   allocate;
    }

    address public owner;


    
    uint    playerNum;      // 玩家个数
    uint    base;           // 底
	uint	multiple;		// 最大翻倍
    uint    needChips;      // 参与筹码 
    uint    tbInterNum;     // 给 table 申请的 Inter 数量


    address public tokenAddress;        // token合约地址
    address public interManage;         // Inter合约地址
    address public notaryManage;        // 公证者合约地址
    address public authorityAddress;    //权限合约地址
    //address roomFunAddress;           // room合约部分功能，解决room合约过大无法部署问题

    mapping (uint => Table)             Tables;     // table号码--table中玩家信息列表
    mapping (address => PlayerInfo)     Players;    // 玩家地址--玩家信息
    mapping (uint => NotaryInfo[])      Norarys;    // table号码 -- 公证信息列表

    address[] joinings;         // 等待加入Table的玩家队列,1:玩家等待加入Table; 2:玩家已加入Table，重新等待加入其他Table;
    
    uint currMaxTbNum;          // 当前最大的台号
    address public luaAddress;  //lua游戏脚本合约

    constructor(string _name,uint playerNum_, uint base_, uint needChips_, uint multiple_, uint tbInterNum_) payable public {

        owner     = msg.sender;
        playerNum = playerNum_;
        base      = base_;
        needChips = needChips_;
		multiple  = multiple_;
        tbInterNum= tbInterNum_;

        _setContract(_name,this); //注册合约到模块
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

    // function setRoomFunAddr(address addr) public onlyOwner{
    //     roomFunAddress = addr;
    // }
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

    /**
     * @dev 获取房间信息
     */
    function getRoomInfo() public view returns(uint,uint, uint,uint) {
        return (playerNum, base, needChips,multiple);
    }

    /**
     * @dev 获取等待入座队列
     */
    function getSittingQueen() public view returns (address[]) {
        return joinings;
    }

    /**
     * @dev 获取Table的所有玩家
     * @param tableid Table的ID
     */
    function getTableInfo(uint tableid) public view returns(uint, uint, uint) {
        return (Tables[tableid].tbid, Tables[tableid].currentHand, uint(Tables[tableid].currentStatus));
    }

    /**
     * @dev 获取Table的所有玩家
     * @param tableid Table的ID
     */
    function getTablePlayers(uint tableid) public view returns(address[]) {
        return Tables[tableid].players;
    }

    /**
     * @dev 获取Table的所有正在玩游戏玩家
     * @param tableid Table的ID
     */
    function getTablePlayingPlayers(uint tableid) public view returns(uint number, address[] pls) {
        pls = new address[](playerNum);
        number = 0;
        address tmpAddr;
        for(uint i = Tables[tableid].players.length; i > 0 ; i--) {
            tmpAddr = Tables[tableid].players[i - 1];
            if(PlayerStatus.PLAYING == Players[tmpAddr].status) {
                pls[number] = tmpAddr;
                number++;
            }
        }
    }

    /**
     * @dev 获取玩家信息
     */
    function getPlayerInfo(address playerAddr) public view returns(address, uint, uint, uint, uint) {
        PlayerInfo memory pInfo = Players[playerAddr];
        return (playerAddr, pInfo.tbid, pInfo.seatNum, pInfo.amount, uint(pInfo.status));
    }

    // /**
    //  * @dev 获取玩家信息
    //  */
    // function isTablePlayingPlayer(uint tableid, address playerAddr) public view returns(bool) {
    //     return tableid == Players[playerAddr].tbid 
    //         && PlayerStatus.PLAYING == Players[playerAddr].status;
    // }

    /**
     * @dev 获取table的座位信息
     * @param tableid   Table的ID
     * @param pos       座位号
     */
    function getTableSeatInfo(uint tableid, uint pos) public view returns (address, address, uint, uint, uint, uint) {
        uint upos = uint(pos);
        if(upos >= Tables[tableid].players.length) {
            return (address(this), address(0), 0, 0, 0, 0);
        }
        address playerAddr = Tables[tableid].players[upos];
        if(address(0) == playerAddr) {
            return (address(this), address(0), 0, 0, 0, 0);
        }
        PlayerInfo memory pInfo = Players[playerAddr];
        return (address(this), playerAddr, pInfo.tbid, pInfo.seatNum, pInfo.amount, uint(pInfo.status));
    }

    // /**
    //  * @dev 获取当前table状态 getTableInfo
    //  * @param tableid   Table的ID
    //  */
    // function getTableCurrentStatus(uint tableid) public view returns(uint) {
    //     return uint(Tables[tableid].currentStatus);
    // }

    // /**
    //  * @dev 获取Table当前局数
    //  * @param tableid Table的ID
    //  */
    // function getTableCurrentHand(uint tableid) public view returns(address, uint, uint) {
    //     return (address(this), tableid, Tables[tableid].currentHand);
    // }

    // 玩家未在Room中，加入Room的Table
    function joinTable() public returns(bool){
        address playerAddr = msg.sender;
        require(PlayerStatus.NOTJION == Players[playerAddr].status,"用户已加入");

        //扣筹码
        TokenAbi token = TokenAbi(tokenAddress);
        require(true == token.transferToken(playerAddr, address(this), needChips),"余额不足");

        PlayerInfo memory info = PlayerInfo(0, 0, needChips, PlayerStatus.SITTING,false);
        Players[playerAddr] = info;

        joinings.push(playerAddr);

        emit JoinSittingQueen(playerAddr, address(this));

        if(joinings.length >= playerNum) {
            allotTable();
        }
        return true;

    }

    /**
     * @dev 安排等待加入Table队列中的玩家加入Table
     */
    function allotTable() internal returns (bool) {
        uint i;
        uint j;

        address tmpAddr;
        uint joiningLen = joinings.length;
        uint seed = uint(msg.sender);
        for(i = 0; i < joiningLen; i++) {
            seed = uint(sha256(block.difficulty, now, seed));
            j = seed % joiningLen;

            tmpAddr = joinings[i];
            joinings[i] = joinings[j];
            joinings[j] = tmpAddr;
        }

        uint currNum = 0;
        uint currTableNum = getTableNum();
        address[] memory players = new address[](playerNum);
        for(i = 0; i < joiningLen; i++) {
            tmpAddr = joinings[i];
            if(Players[tmpAddr].status != PlayerStatus.SITTING) {
                continue;
            }

            players[currNum] = tmpAddr;

            Players[tmpAddr].tbid = currTableNum;
            Players[tmpAddr].seatNum = currNum;
            Players[tmpAddr].status = PlayerStatus.SEATED;
            currNum++;

            if(currNum >= playerNum || (i + 1) == joiningLen) {
                Table memory tb = Table(currTableNum, 1, TalbeStatus.NOTSTARTED, players);
                Tables[currTableNum] = tb;
                InterAbi(interManage).select(currTableNum, msg.sender, tbInterNum);
                currNum = 0;
                if((i + 1) < joiningLen) {
                    currTableNum = getTableNum();
                }
                for(j = 0; j < playerNum; j++) {
                    players[j] = address(0);
                }
                // players = new address[](playerNum);
                
            }
        }
        emit AllotTable(this,currTableNum);

        for(i = joiningLen; i > 0; i--) {
            delete joinings[i - 1];
        }
        joinings.length = joinings.length-joiningLen;
        return true;
    }

    /**
     * @dev 获取Table号码
     */
    function getTableNum() internal returns (uint) {
        currMaxTbNum++;
        return currMaxTbNum;
    }

    function reJoinTable() public returns(bool) {
        address playerAddr = msg.sender;

        uint tableid = Players[msg.sender].tbid;
        require(Tables[tableid].currentStatus == TalbeStatus.NOTSTARTED,"table未开始游戏");     // Table未开始游戏

        for(uint i = 0; i < playerNum; i++) {
            address tmpPlayer = Tables[tableid].players[i];
            doReJoinTable(tmpPlayer);
            
            delete Tables[tableid].players[i];
        }

        Tables[tableid].players.length = 0;
        delete Tables[tableid];
        return true;
    }

    // 重新加入Table
    function doReJoinTable(address playerAddr) private {
        require(PlayerStatus.SEATED == Players[playerAddr].status || PlayerStatus.READY == Players[playerAddr].status);

        // 筹码
        uint amount = Players[playerAddr].amount;
        TokenAbi token = TokenAbi(tokenAddress);
        if(amount < needChips) {
            require(true == token.transferToken(playerAddr, address(this), needChips - amount));
        }
        if(amount > needChips) {
            require(true == token.transferToken(address(this), playerAddr, amount - needChips));
        }

        Players[playerAddr].amount = needChips;

        Players[playerAddr].tbid = 0;
        Players[playerAddr].status = PlayerStatus.SITTING;

        joinings.push(playerAddr);

        emit JoinSittingQueen(playerAddr, address(this));

        if(joinings.length >= playerNum) {
            allotTable();
        }
    }

    // 退出Table
    function leaveTable() public returns(bool) {
        // 在游戏中，Table未结算，不允许退出
        //require(!(PlayerStatus.PLAYING == Players[msg.sender].status || PlayerStatus.DISCARD == Players[msg.sender].status),"playing,leave false");

        // 转出筹码
        TokenAbi(tokenAddress).transferToken(address(this), msg.sender, Players[msg.sender].amount);

        uint tableid = Players[msg.sender].tbid;
        uint pos = Players[msg.sender].seatNum;
        PlayerStatus status = Players[msg.sender].status;
        delete Players[msg.sender];
        emit LeaveTable(address(this), tableid, msg.sender, pos);

        // 在等待坐下 Table 队列的，需要退出队列
        if(PlayerStatus.SITTING == status) {
            for(uint256 j = 0;j < joinings.length; j++){
                if(joinings[j] == msg.sender){
                    joinings[j] = joinings[joinings.length -1];
                    joinings.length--;
                    break;
                }
            }
            
            return true;
        }

        for(uint i = 0; i < playerNum; i++) {
            address tmpPlayer = Tables[tableid].players[i];
            if(msg.sender != tmpPlayer) {
                //doReJoinTable(tmpPlayer);
                TokenAbi(tokenAddress).transferToken(address(this),tmpPlayer, Players[tmpPlayer].amount);
                delete Players[tmpPlayer];
            }
            
            delete Tables[tableid].players[i];
        }

        Tables[tableid].players.length = 0;
        delete Tables[tableid];
        return true;
    }

    /**
     * @dev 玩家开始
     * @param hand 局数（即在第几局弃牌）
     */
    function start(uint tableid, uint hand) public returns(bool){
        address playerAddr = msg.sender;
        PlayerInfo memory pInfo = Players[playerAddr];

        require(tableid == pInfo.tbid, "错误table id");
        require(pInfo.status == PlayerStatus.SEATED, "用户错误状态码");
        
        
        require(Tables[pInfo.tbid].currentHand == hand, "局数不匹配");
        require(Tables[pInfo.tbid].currentStatus == TalbeStatus.NOTSTARTED, "talbe 未开始");     // Table未开始游戏
		
		uint amount = Players[playerAddr].amount;
        TokenAbi token = TokenAbi(tokenAddress);
		
        if(amount < base * multiple) {
            require(true == token.transferToken(playerAddr, address(this), base*multiple - amount));
			Players[playerAddr].amount = base * multiple;
        }

        Players[playerAddr].status = PlayerStatus.READY;
        emit Start(address(this), pInfo.tbid, playerAddr, pInfo.seatNum, hand);

        for(uint i = 0; i < playerNum; i++) {
            if(PlayerStatus.READY != Players[Tables[tableid].players[i]].status) {
                return true;
            }
        }
        for(i = 0; i < playerNum; i++) {
            Players[Tables[tableid].players[i]].status = PlayerStatus.PLAYING;
        }
        Tables[tableid].currentStatus = TalbeStatus.STARTED;
		emit GameStart(address(this), tableid, Tables[tableid].currentHand);
        return true;
    }

    /**
     * @dev 验证签名
     * @param sigs      签名信息
     * @param msg       签名消息
     * @param tableid   Table的ID
     */
    function verifySigs(bytes sigs, bytes32 msg, uint tableid) internal returns(bool) {
        address[] memory players = Tables[tableid].players;

        uint i;
        uint j;

        uint[] memory mark = new uint[](players.length);
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

    function resetNotray(uint tableid) internal returns(bool) {
        for(uint i = Norarys[tableid].length; i > 0; i--) {
            delete Norarys[tableid][i - 1].nrAddr;
            delete Norarys[tableid][i - 1].allocate;

            delete Norarys[tableid][i - 1];
        }

        Norarys[tableid].length = 0;
        return true;
    }

    //重置table的状态
    function reset(uint tableid) internal returns(bool){
        address[] memory players = Tables[tableid].players;
        uint i;
        for(i = 0; i < players.length; i++) {
            Players[players[i]].status = PlayerStatus.SEATED;
        }

        Tables[tableid].currentStatus = TalbeStatus.NOTSTARTED;
        resetNotray(tableid);
        return true;
    }
    function reshaff(uint hand) public returns(bool ret){
        Players[msg.sender].reshaff = true;
        uint tableid = Players[msg.sender].tbid;
        for(uint i=0;i<Tables[tableid].players.length; i++){
            if(Players[  Tables[tableid].players[i] ].reshaff == false){
                return ret;
            }
        }
        for(i=0;i<Tables[tableid].players.length; i++){
            Players[ Tables[tableid].players[i] ].reshaff = false; 
        }
        emit ReShaff(tableid,hand);
        return true;
    }
    /**
     * @dev 结算
     * @param sigs  签名信息
     * @param data  分配方案
     */
    function settle(uint src, bytes sigs, bytes data) internal returns(bool) {
        RLP.RLPItem memory bal = data.toRLPItem();
        require(bal.isList(),"rlp data error");
        RLP.RLPItem[] memory settledata = bal.toList();
        require(settledata.length == 4,"rlp data length error");

        require(address(this) == rlpToAddress(settledata[0]),"game contract address error");

        uint tableid = settledata[1].toUint();
        require(uint(settledata[2].toUint()) == Tables[tableid].currentHand,"table hand error");

        if(uint(Data_Src.PLAYER) == src) {
            // 玩家提交需要验证签名
            bytes32 msg = keccak256(data);
		    require(verifySigs(sigs, msg, tableid),"play sign error");
        }
        
        if(uint(Data_Src.NORTARY) == src) {
            // uint tableid = 20181001;
            // Inter(interManage).reApplyForInters(tableid);
        }

        require(settledata[3].isList(),"rlp data input error");


        RLP.RLPItem[] memory itemDatas = settledata[3].toList();

        address[] memory players = Tables[tableid].players;

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
        }
        require(add == sub,"add != sub");
        emit Settle(Tables[tableid].currentHand,playerNum,tableid);
        reset(tableid);
        //Notary(notaryManage).reNotarize(tableid);
        Tables[tableid].currentHand++;
        return true;
    }

    /**
     * @dev 结算

     * @param data  分配方案
     */
    function playerSettle(bytes data) public returns(bool){
        uint i;
        uint playingNum = 0;
        address[] memory players =  Tables[Players[msg.sender].tbid].players;
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
        return settle(uint(Data_Src.PLAYER), sigs, balData);
    }

    /**
     * @dev 公证者提交公证
     * @param data 分配方案
     */
    function submitNotary(bytes data) public returns(bool){
        emit SubmmitSettleData(msg.sender, data.length, data);
        var dhash = keccak256(data);
        address nrAddr = msg.sender;
        // uint tableid = 20181001;

        RLP.RLPItem memory bal = data.toRLPItem();
        require(bal.isList(),"rlp data err");
        RLP.RLPItem[] memory settledata = bal.toList();

        require(settledata.length == 4,"rlp data length error");

        require(address(this) == rlpToAddress(settledata[0]),"address error");
  

        uint tableid = settledata[1].toUint();
        require(uint(settledata[2].toUint()) == Tables[tableid].currentHand,"currnet Hand error"); 

        address[] memory notarys = NotaryAbi(notaryManage).getNotaryList(address(this), tableid);
        require (notarys.length > 0,"notarys error");

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

        for(i = 0; i < Norarys[tableid].length; i++) {
            if(Norarys[tableid][i].nrAddr == nrAddr) {
                // 已提交，最新的覆盖旧的
                delete Norarys[tableid][i].allocate;
                Norarys[tableid][i].allocate = dhash;
                return true;
            }
        }

        Norarys[tableid].push(NotaryInfo(nrAddr, dhash));
        if(notarys.length == Norarys[tableid].length) {
            doNotarize(tableid,data);
        }
        return true;
    }

    function doNotarize(uint tableid,bytes data) internal returns(bool) {
        address[] memory notarys = NotaryAbi(notaryManage).getNotaryList(address(this), tableid);
 	require(notarys.length > 0,"notary not exist");

        uint lenNrInfo = Norarys[tableid].length;
        require(lenNrInfo>0,"notary not fond");

        uint i;
        bytes32  firstNrInfo = Norarys[tableid][0].allocate;
        for(i = 1; i < lenNrInfo; i++) {
            if(Norarys[tableid][i].allocate != firstNrInfo) {
                // 执行公证再进行比较，是因为允许公证者重复提交公证信息，新的覆盖旧的
                //emit SettleError(address(this), tableid, uint(Data_Src.NORTARY), uint(ErrorCode_Settle.DATA_INCONSISTENCY));
                NotaryAbi(notaryManage).reNotarize(tableid);
                return true;
            }
        }

        settle(uint(Data_Src.NORTARY), new bytes(0), data);
        emit FinishNotary(tableid,Tables[tableid].currentHand);
    }

    /**
     * @dev 比较两个bytes是否相等
     */
    // function compare(bytes one, bytes other) internal returns (int) {
    //     if(one.length != other.length) {
    //         return 1;
    //     }

    //     for(uint i = 0; i < one.length; i++) {
    //         if(one[i] != other[i]) {
    //             return 1;
    //         }
    //     }

    //     return 0;
    // }

    /**
     * @dev 获取已提交公证的公证者列表
     * @param tableid table的号码
     */
    function getSubNotorys(uint tableid) public view returns(address[] addrs) {
        addrs = new address[](Norarys[tableid].length);
        for(uint i = Norarys[tableid].length; i > 0; i--) {
            addrs[i - 1] = Norarys[tableid][i - 1].nrAddr;
        }
    }

    function resetNotoryInfo(uint tableid) public {
        require(msg.sender == notaryManage);
        resetNotray(tableid);
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
    
    function applyNotarize(uint number) public returns(bool) {
        uint tableid = Players[msg.sender].tbid;
        require(tableid > 0,"table not exist");


        require(PlayerStatus.PLAYING == Players[msg.sender].status,"table not playing");   // 在游戏进行中的玩家才允许申请公证

        NotaryAbi(notaryManage).applyNotorys(tableid, msg.sender, number);
        return true;
    }
 
    /**
     * @dev 公证这完成table公证
     */
    function finishNotarize(uint tableid) public returns(bool) {

        if(tableid == 0){return false;}

        NotaryAbi nr = NotaryAbi(notaryManage);
        nr.finishNotarize(tableid);

        return true;
    }
}