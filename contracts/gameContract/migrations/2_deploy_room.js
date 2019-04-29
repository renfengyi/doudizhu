var TableMgr = artifacts.require("./TableManager.sol");
var Room = artifacts.require("./RoomManager.sol");
var Croom= artifacts.require("./CroomManager.sol");

module.exports = function(deployer, network, accounts) {
    deployer.then(function() {
        return deployer.deploy(Room,{value:1000000*1e18});
    }).then(function(instance) {
        room = instance;
        return deployer.deploy(TableMgr,{value:1000000*1e18});
    }).then(function(instance) {
        tbMgr=instance;
        return deployer.deploy(Croom,"CroomManager",3,10,2000,16,1,{value:1000000*1e18});
    }).then(function(instance) {
        tbMgr=instance;
        return deployer.deploy(Croom,"CroomManagerdev",3,10,2000,16,1,{value:1000000*1e18});
    });
};

