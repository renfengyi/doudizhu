--local ge = require("gamengine")
local eth = require("eth")
local json = require("json")
local ge = require("gameengine")

require("init") 
require("ddzabi")
require("ddzroomcontract")

function tableHandler(method, params)--go中可以找到，不能加local
    print(os.date("%Y/%m/%d %H:%M:%S ") .. "tableHandler() ", method, params)
    if (method == "fastjoin") then
        return rCtr:FastJoin()
    elseif (method == "leave") then
        return rCtr:leaveTable(params)
    elseif (method == "playersinfo") then
        return rCtr:playersinfo(params)
    elseif (method == "ready") then
        return rCtr:ready(params)
    else
        print(os.date("%Y/%m/%d %H:%M:%S ") .. "tableHandler() ", method, params)
        return nil
    end
    return nil--不处理时要返回空，这样才会让给EventHandler处理
end

function subscribe(name, rpcsubid)
    print(os.date("%Y/%m/%d %H:%M:%S ") .. "lua subscribe() ", name, rpcsubid)
    if (name == "Leave") then
        return rCtr:watchLeave(rpcsubid)
    elseif (name == "Ready") then
        return rCtr:watchReady(rpcsubid)
    elseif (name == "StartGame") then
        return rCtr:watchStartGame(rpcsubid)
    elseif (name == "Settle") then
        return rCtr:watchSettle(rpcsubid)
    elseif (name == "AllotTable") then
        return rCtr:SubAllotTable(rpcsubid)
	else
        return false
    end
    return true
end

function console(str)
    --local exit = false
    --repeat
        --i = io.read()
        print(os.date("%Y/%m/%d %H:%M:%S ") .. "console() ", str, string.sub(str, 1, 1))
        if str=="e" then
            tableHandler("leave", "")
        elseif str=="k" then
            tableHandler("fastjoin", "")
            --subscribe("JoinTable", "1")
            subscribe("Ready", "2")
            subscribe("StartGame", "3")
            subscribe("Settle", "4")
        elseif str=="r" then
            tableHandler("ready", "")
        elseif (string.sub(str, 1, 1)=="b")  then
            EventHandler("Grab", "{\"ID\":"..tostring(0)..",\"OP\":"..string.sub(str, 2, string.len(str)).."}")
        elseif (string.sub(str, 1, 1)=="p")  then 
            local sub = string.sub(str, 2 , -1)
            print(sub)
            local ic = split(sub, "|")
            print(#ic)
            print(ic[1], ic[2])

            local lindex = split(ic[1], ",")
            local lcard = split(ic[2], ",") 

            local index = {} 
            local  card = {} 

            for i,v in ipairs(lindex) do
                table.insert(index, tonumber(v))
            end

            for i,v in ipairs(lcard) do
                table.insert(card, tonumber(v))
            end
           
            local js = {} 
            js.ID = 0 
            js.OP = 1 
            js.Index = index 
            js.Card = card 
            local jstr = json.encode(js)
            local result = EventHandler("Play", jstr) 

            print(os.date("%Y/%m/%d %H:%M:%S ") .. "P result =======", result)
        elseif (string.sub(str, 1, 2) == "ch") then 
            local index = {} 
            local  card = {} 
            local js = {} 
            js.ID = 0 
            js.OP = 1 
            js.Index = index 
            js.Card = card 
            local jstr = json.encode(js)
            local result = EventHandler("Play", jstr)  
            print(os.date("%Y/%m/%d %H:%M:%S ") .. "P result =======", result)
        end
    --until exit
end
