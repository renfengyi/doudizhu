local eth = require("eth")
local json = require("json")
local ge = require("gameengine")

require ("init")
require ("ddzabi")
-- local gt = require("game")

ddzroom_contract = class()

function ddzroom_contract:ctor()
    print(os.date("%Y/%m/%d %H:%M:%S ") .. "ddzroom_contract ctor")
    self.curTable = 0   --当前TableID
    self.selfaddr = ge.SelfAddr()  --当前玩家账号地址
    --print("room_contract ctor() ", self.selfaddr, err)
    self.tc = eth.contract(DDZRoomManagerABI, DDZRoomManagerAddr)
    self.btcContract = eth.contract(BitcoinTokenABI, btAddr)
    self.interContract = eth.contract(InterABI, interAddr)
    --通知游戏UI事件而使用的订阅ID
    self.AllotTableSubId = "0"
    self.ReadySubId = "0"
    self.StartGameSubId = "0"
    self.SettleSubId = "0"
    self.LeaveSubId = "0"
    --与合约交互用的订阅数据
    self.JoinRoomSub  = nil
    self.AllotTableSub = nil 
    self.JoinSittingQueenSub = nil
    self.LeaveSub = nil
    self.StartSub = nil
    self.ReShaffSub = nil
    self.StartGameSub = nil
    self.SettleSub = nil
end

rCtr = ddzroom_contract:new()

function newAddress(str)--要求40个字节，所以不能带0x
    if string.sub(str, 1, 2) == "0x" then
        str = string.sub(str, 3, string.len(str))
    end
    return address.new(str) --调用luatype里的address
end

function ddzroom_contract:Unsubscribe() 
    print(os.date("%Y/%m/%d %H:%M:%S ") .. "Unsubscribe() ")
    if (self.JoinRoomSub ~= nil) then
        print(os.date("%Y/%m/%d %H:%M:%S ") .. "Unsubscribe joint")
        local err = self.tc.CancelWatchLog(self.JoinRoomSub)
        if (err ~= nil) then
            print(os.date("%Y/%m/%d %H:%M:%S ") .. "Unsubscribe joint err")
        end
    end

    if (self.AllotTableSub ~= nil) then
        self.tc.CancelWatchLog(self.AllotTableSub)
    end
    if (self.JoinSittingQueenSub ~= nil) then
        self.tc.CancelWatchLog(self.JoinSittingQueenSub)
    end
    if (self.StartSub ~= nil) then
        self.tc.CancelWatchLog(self.StartSub)
    end
    if (self.ReShaffSub ~= nil) then
        self.tc.CancelWatchLog(self.ReShaffSub)
    end
    if (self.StartGameSub ~= nil) then
        self.tc.CancelWatchLog(self.StartGameSub)
    end
    if (self.SettleSub ~= nil) then
        self.tc.CancelWatchLog(self.SettleSub)
    end

    if (self.LeaveSub ~= nil) then
        self.tc.CancelWatchLog(self.LeaveSub)
    end

    if (self.LeaveRoomSub ~= nil) then
        self.tc.CancelWatchLog(self.LeaveRoomSub)
    end
end

--获取房间Inter列表
function RoomInter()
    -- rCtr.tc.Transact("applyInter", 1)
    local inters = {}
    -- local tableid, number = rCtr.tc.WatchLog("SelectInter")
    -- print(os.date("%Y/%m/%d %H:%M:%S ") .. "RoomInter() ", rCtr.curTable, tableid, number)
    -- if tableid == rCtr.curTable then 
        local interaddrs = rCtr.interContract.Call("getTableInters", DDZRoomManagerAddr, rCtr.curTable)
        print(os.date("%Y/%m/%d %H:%M:%S ") .. "interaddrs = ", #interaddrs)
       
        for i = 1, #interaddrs do
            print(interaddrs[i], type(interaddrs[i]), tostring(interaddrs[i]))
            --_, nd, _, _, _, _, err := tbm.GetInterInfo(cm.callOpts, v)
            local addr,nd,x1,x2,x3,x4 = rCtr.interContract.Call("getInterInfo", tostring(interaddrs[i]))
            --print("nd = ", nd)
            table.insert(inters, nd)
        end
    -- end
    return inters
end

--LeaveRoom合约事件回调函数
function LeaveRoom(roomAddr, playerAddr)
    print(os.date("%Y/%m/%d %H:%M:%S ") .. "LeaveRoom()", "player = " .. playerAddr .. ", myself = " .. rCtr.selfaddr .. ", roomaddr = " .. roomAddr)
    if (playerAddr == rCtr.selfaddr) then
        rCtr:Unsubscribe()
    end
end

--JoinSittingQueen合约事件回调函数
function JoinSittingQueen(playerAddr, roomAddr)
    print("JoinSittingQueen() ", playerAddr, roomAddr)
    if (playerAddr == rCtr.selfaddr) then
        print(os.date("%Y/%m/%d %H:%M:%S ") .. "SittingDown OK !!!!")
    else
        print(os.date("%Y/%m/%d %H:%M:%S ") .. "Others JoinSittingQueen !!!")
    end
end

--AllotTable合约事件回调函数
function AllotTable(roomaddr, tableId)
    print(os.date("%Y/%m/%d %H:%M:%S ") .. "AllotTable()", "roomaddr = " .. roomaddr .. ", tableid = " .. tableId)
    local Players = rCtr.tc.Call("getTablePlayers", tableId)

    local flag = false 
    for i = 1, #Players do
        if (rCtr.selfaddr == Players[i]) then
            flag = true 
            break 
        end
    end

    if (flag == true) then
        local interlist = {}
        local returnplayers = {}
        for i = 1, #Players do
            local addr, tableid, seatNum, amount, status = rCtr.tc.Call("getPlayerInfo", Players[i])
            if (Players[i] == rCtr.selfaddr) then
                rCtr.curTable = tableid
                interlist = RoomInter()
                print(interlist)

                gd:join(seatNum, amount, tableid, addr, interlist, true, false)
            else
                gd:join(seatNum, amount, tableid, addr, interlist, false, false)
            end

            local ti = {
		    	["Pos"] = seatNum,
		    	["PlayerAddr"] = addr,
		    	["Amount"] = amount,
                ["Status"] = status,
            }
            table.insert(returnplayers, ti)
        end

        local resultinfo = {
            ["TableID"] = rCtr.curTable,
            ["Players"] = returnplayers,
        }

        ge.NotifySub(rCtr.AllotTableSubId, resultinfo)
        gd:ShuffleCardBackStage(interlist)
        rCtr:watchReshuffleStart() 
    end
end

--UI订阅AllotTable（匹配到其他玩家）事件，当合约事件AllotTable触发时该事件被触发
function ddzroom_contract:SubAllotTable(rpcsubid)
    print(os.date("%Y/%m/%d %H:%M:%S ") .. "SubAllotTable ============")
    self.AllotTableSubId = rpcsubid
end

function roomleaveHandler(roomaddr, tableid, addr, pos) 
    print(os.date("%Y/%m/%d %H:%M:%S ") .. "roomleaveHandler() ", tableid, addr, pos)
    if tableid == rCtr.curTable  then 
        print(os.date("%Y/%m/%d %H:%M:%S ") .. "roomleaveHandler() ", tableid, addr, pos)
        local t = {}
        t["Tableid"] = tableid
        t["Addr"] = addr
        t["Pos"] = pos
        gd:leave(pos, tableid)
        ge.NotifySub(rCtr.LeaveSubId, t) 

        --取消监听 
        rCtr:Unsubscribe() 
    end
end

--UI订阅Leave（玩家离开桌子）事件，当合约事件LeaveTable触发时该事件被触发
function ddzroom_contract:watchLeave(rpcsubid)
    self.LeaveSubId = rpcsubid
    self.LeaveSub = self.tc.WatchLog("LeaveTable", roomleaveHandler)
end

function roomreadyHandler(roomAddr, tbNum, playerAddr, pos, hand)
    if tbNum == rCtr.curTable then 
        print(os.date("%Y/%m/%d %H:%M:%S ") .. "roomreadyHandler()", "table = " .. tbNum .. ", player = " .. playerAddr .. ", pos = " .. pos .. ", hand = " .. hand) 
        --gd:start(pos) ready事件可能在游戏开始事件后到达

        local t = {}
        t["Tableid"] = rCtr.curTable
        t["Addr"] = playerAddr
        t["Pos"] = pos
        ge.NotifySub(rCtr.ReadySubId, t)--只需要通知即可
    end 
end

--UI订阅Ready（玩家准备就绪）事件，当合约事件Start触发时该事件被触发
function ddzroom_contract:watchReady(rpcsubid)
    self.ReadySubId = rpcsubid
    self.StartSub = self.tc.WatchLog("Start", roomreadyHandler)
end 

function roomstartgameHandler(roomaddr, tableid, hand)
    print(os.date("%Y/%m/%d %H:%M:%S ") .. "roomstartgameHandler()", "curTable = " .. rCtr.curTable .. ", tableid = " .. tableid .. ", hand = " .. hand)
    if tableid == rCtr.curTable then
        local players = rCtr:playersinfo()
        local tbInfo, currentHand = rCtr:tableinfo() 
        --gt:startGame(players, hand)
        gd:startGame(tbInfo, players, hand, rCtr.selfaddr)

        local t = {}
        t["Tableid"] = tableid
        t["Hand"] = hand
        ge.NotifySub(rCtr.StartGameSubId, t)
    end 
end

--UI订阅StartGame（开始游戏）事件，当合约事件GameStart触发时该事件被触发
function ddzroom_contract:watchStartGame(rpcsubid)
    self.StartGameSubId = rpcsubid
    self.StartGameSub = self.tc.WatchLog("GameStart", roomstartgameHandler)
end

function roomsettleHandler(hand, playernum, tableid)
    print(os.date("%Y/%m/%d %H:%M:%S ") .. "roomsettleHandler() ", "curTable = " .. rCtr.curTable .. ", hand = " .. hand .. ", playerNum = " .. playernum .. ", tableid = " .. tableid) 
    if tableid == rCtr.curTable then
        --是不是要组成table
        gd:GameReset() 

        local t = {}
        t["Hand"] = hand
        t["PlayerNum"] = playernum
        t["Tableid"] = tableid
        ge.NotifySub(rCtr.SettleSubId, t)
    end
end

--UI订阅Settle（结算）事件，当合约事件Settle触发时该事件被触发
function ddzroom_contract:watchSettle(rpcsubid)
    self.SettleSubId = rpcsubid
    self.SettleSub = self.tc.WatchLog("Settle", roomsettleHandler)
end

--都不叫地主重新洗牌事件
function reShuffleHandler(tableid, hand)
    if tableid == rCtr.curTable then
        gd:reShuffleCard(roomaddr, tableid, hand)
    end
end

function ddzroom_contract:watchReshuffleStart()
    self.ReShaffSub = self.tc.WatchLog("ReShaff", reShuffleHandler)
end

function ddzroom_contract:tableinfo(params)
    local playerNum, base, needChips, multiple = rCtr.tc.Call("getRoomInfo") 
    local tbNum, currentHand, currentStatus, readyNum, startPlayer = rCtr.tc.Call("getTableInfo", rCtr.curTable)
   
    local tableInfo = {
        ["TableId"] = rCtr.curTable,
        ["Creator"] = rCtr.selfaddr,
        ["PlayerNum"] = playerNum,
        ["BasePoint"] = base,
        ["NeedChips"] = needChips,
        ["CurrentStatus"]= currentStatus,
        ["MaxMultiple"] = multiple,
    }
    return tableInfo, currentHand
end

function ddzroom_contract:selfPlayingStatus()
    local addr, tableid, seatNum, amount, status = rCtr.tc.Call("getPlayerInfo", self.selfaddr)
    print(addr, tableid, seatNum, amount, status)
    return addr, tableid, seatNum, status 
end

--以下四个函数由UI调用
function ddzroom_contract:FastJoin()
    self.JoinSittingQueenSub = self.tc.WatchLog("JoinSittingQueen", JoinSittingQueen)
    self.AllotTableSub = self.tc.WatchLog("AllotTable", AllotTable)

    self.tc.Transact("joinTable")
   
    self.LeaveRoomSub = self.tc.WatchLog("LeaveRoom", LeaveRoom)

    --self.LeaveSub =  self.tc.WatchLog("LeaveTable", roomleaveHandler)
end 

function ddzroom_contract:leaveTable(params)
    self.tc.Transact("leaveTable")--不需要参数
end

function ddzroom_contract:playersinfo(params)
    --local tid = tonumber(params)
    --local nilAddress [common.AddressLength]byte
    local players = {}

    --printtable(players)
    local Players = rCtr.tc.Call("getTablePlayers", rCtr.curTable)
    for i = 1, #Players do
        local addr, tableid, seatNum, amount, status = rCtr.tc.Call("getPlayerInfo", Players[i])
        print(addr, tableid, seatNum, amount, status)
        local info = {
            ["Pos"] = seatNum,
            ["PlayerAddr"] = addr,
            ["Amount"] = amount,
            ["Status"] = status,
        }
        table.insert(players, info)
    end
    return players
end

function ddzroom_contract:ready(params)
    --local tableid = tonumber(params)
    --print(self.curTable)
    --print(self.curTable)
    local tbNum, currentHand, currentStatus = self.tc.Call("getTableInfo", self.curTable)
    print(os.date("%Y/%m/%d %H:%M:%S ") .. "ddzroom_contract:ready() hand = " .. currentHand .. ", tableid = " .. self.curTable .. ", status = " .. currentStatus)
    self.tc.Transact("start", self.curTable, currentHand)--不需要参数
end
