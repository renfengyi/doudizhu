cc.Class({
    extends: cc.Component,

    properties: {
        nickname: cc.Label,
        currentGoldNum: cc.Label,
        roomlayer: cc.Node,
        loadinglayer: cc.Node,
        loadingTips: cc.Label,
        btnRetry: cc.Button,
        btnBack: cc.Button,
    },

    onSelfAddress: function(data) {
        console.log(data);
        if (typeof(data) === "string") {
            cc.dgame.gameplay.selfaddr = data.toLowerCase();
        }
    },

    onLeave: function(data) {
        console.log(data)
    },

    onRunGame: function(data) {
        console.log("load complete(" + data + ")")
        if (data.length > 25) {
            if (data.indexOf("msglist.txt: no such file or directory") !== -1) {
                cc.dgame.net.sendMsg(["leave", ""], this.onLeave.bind(this))
            }
        }
        if (parseInt(data) === 0) {
            this.unschedule(this.updateLoadingTips)
            this.roomlayer.active = true
            this.loadinglayer.active = false
            cc.director.loadScene('tablescene')
        } else {
            this.unschedule(this.updateLoadingTips)
            this.loadingTips.string = this.strings.LOAD_FAIL_CHECK_NETWORK
            this.btnRetry.node.active = true
        }
    },

    updateLoadingTips: function() {
        if (this.loadCount === 0) {
            this.loadingTips.string = this.strings.WAITING_FOR_LOAD
        }
        this.loadingTips.string += "."
        this.loadCount++
        if (this.loadCount == 5) {
            this.loadCount = 0
        }
    },

    runGame: function() {
        if (this.wsconnected) {
            var rungame_cmd = {
                game_contract_addr: cc.dgame.settings.game_contract_addr,
                game_nodes: JSON.parse(cc.dgame.settings.game_nodes)
            }
            cc.dgame.net.sendMsg(["rungame", JSON.stringify(rungame_cmd)], this.onRunGame.bind(this))
            this.btnRetry.node.active = false
            this.loadCount = 0
            this.loadingTips.string = this.strings.WAITING_FOR_LOAD
            this.schedule(this.updateLoadingTips, 0.5)
            this.roomlayer.active = false
            this.loadinglayer.active = true
        }
    },

    onOpen: function(obj) {
        this.wsconnected = true
        cc.dgame.net.sendMsg(["selfaddress", ""], this.onSelfAddress.bind(this))
    },

    onClose: function(obj){
        console.log("连接断开");
        this.wsconnected = false
        if (cc.sys.isNative && cc.sys.isMobile) {
            if (cc.sys.os === cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("NativeGengine", "stopGameEngine")
                cc.audioEngine.stopAll()
                cc.game.restart()
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NativeGengine", "stopGameEngine", "()Z")
                cc.audioEngine.stopAll()
                cc.game.restart()
            }
        }
    },

    // use this for initialization
    onLoad: function () {
        this.strings = require("string_zh")
        this.nickname.string = cc.dgame.settings.account.Nickname
        this.wsconnected = false
        if (cc.sys.isNative && cc.sys.isMobile) {
            var ret = ""
            if (cc.sys.os === cc.sys.OS_IOS) {
                ret = jsb.reflection.callStaticMethod("NativeGengine", "balanceOfAccount:", cc.dgame.settings.account.Addr)
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                ret = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NativeGengine", "balanceOfAccount", "(Ljava/lang/String;)Ljava/lang/String;", cc.dgame.settings.account.Addr)
            }
            if (ret !== null && ret !== undefined && ret.length > 0) {
                var balanceResp = JSON.parse(ret)
                if (balanceResp.error !== 0) {
                    if (cc.sys.os === cc.sys.OS_IOS) {
                        jsb.reflection.callStaticMethod("NativeGengine", "callNativeUIWithTitle:andContent:", "查询余额", balanceResp.msg)
                    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAlertDialog", "(Ljava/lang/String;Ljava/lang/String;)V", "查询余额", balanceResp.msg)
                    }
                } else {
                    cc.dgame.settings.account.Gold = parseInt(balanceResp.data)
                    this.currentGoldNum.string = cc.dgame.settings.account.Gold
                }
            } else {
                this.currentGoldNum.string = "0"
            }
        }
        cc.sys.dump()
        cc.log("cc.sys.isNative = " + cc.sys.isNative)
        this.getComponent('AudioMng').playMusic()
        var isRunning = true;
        if (cc.sys.isNative && cc.sys.isMobile) {
            if (cc.sys.os === cc.sys.OS_IOS) {
                isRunning = jsb.reflection.callStaticMethod("NativeGengine", "isRunning")
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                isRunning = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NativeGengine", "isRunning", "()Z")
            }
        }
        if (!isRunning) {
            this.scheduleOnce(this.startGengine, 0.1)
        } else {
            this.wsconnected = true
        }
        cc.director.preloadScene('tablescene', function () {
            cc.log('Next scene preloaded')
        });
    },

    startGengine: function() {
        console.log("account: " + cc.dgame.settings.account.Addr + ", password: " + cc.dgame.settings.account.Password)
        var ret = false;
        if (cc.sys.isNative && cc.sys.isMobile) {
            if (cc.sys.os === cc.sys.OS_IOS) {
                ret = jsb.reflection.callStaticMethod("NativeGengine", "startGameEngineWithAccount:andPassword:", cc.dgame.settings.account.Addr, cc.dgame.settings.account.Password)
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                ret = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NativeGengine", "startGameEngineWithAccountAndPassword", "(Ljava/lang/String;Ljava/lang/String;)Z", cc.dgame.settings.account.Addr, cc.dgame.settings.account.Password)
            }
        }
        if (ret === false) {
            if (cc.sys.os === cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("NativeGengine", "callNativeUIWithTitle:andContent:", "Gengine启动失败","启动失败")
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAlertDialog", "(Ljava/lang/String;Ljava/lang/String;)V", "Gengine启动失败","启动失败")
            }
        } else {
            console.log("开始连接：ws://127.0.0.1:8546");
            cc.dgame.net.connect(this.onOpen.bind(this), this.onClose.bind(this), "127.0.0.1:8546");
        }
    },

    enterPreviewRoom: function() {
        cc.dgame.settings.game_contract_addr = "7be295035c500c374b1219e79e92ee2c6700f4b7"
        cc.dgame.settings.game_nodes = JSON.stringify(["enode://9b93cf2e45d98d3c95c432ea0858bc41e3148bcb36226e9143c0780ba85e24b796a6e3c2401b7ff756ac7f1058310ca563f20700c3371930639feaa94505da1d"])
        this.runGame()
    },

    enterLowLevelRoom: function() {
        // this.currentSceneUrl = 'tablescene';
        // cc.director.loadScene('tablescene', this.onLoadSceneFinish.bind(this));
        //cc.director.loadScene('tablescene')
    },

    enterMidLevelRoom: function() {
        //cc.director.loadScene('tablescene')
        //var ret = jsb.reflection.callStaticMethod("NativeGengine", "addPeer")
    },

    enterHighLevelRoom: function() {
        //cc.director.loadScene('tablescene')
        // var ret = jsb.reflection.callStaticMethod("NativeGengine", "resolveGameNode:", "enode://b03f992282d5418907d7627d142684785f344faa1bd2abc1ceb6e7e77d2b01980ca1849e35bba7c33cdd82cb288af87f990e8161b2c055fd8ffc3d847cae24ea")
        // jsb.reflection.callStaticMethod("NativeGengine", "callNativeUIWithTitle:andContent:", "resolveGameNode",ret)
    },

    // called every frame
    update: function (dt) {

    },

    onLoadSceneFinish: function() {
        cc.log(this.currentSceneUrl)
        this.btnBack.node.active = !(this.currentSceneUrl == 'gamehall')
    },

    // 退出房间
    backToMenu:function() {
        this.currentSceneUrl = 'gamehall'
        cc.director.loadScene('gamehall', this.onLoadSceneFinish.bind(this))
    },

    openAccountMgr:function() {
        cc.director.loadScene('loginAccount')
    },

    onClickExchange: function() {
        cc.director.loadScene('exchange')
    },

    onClickClearCache: function() {
        if (cc.sys.isNative && cc.sys.isMobile) {
            if (cc.sys.os === cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("NativeGengine", "stopGameEngine")
                jsb.reflection.callStaticMethod("NativeGengine", "clearCache")
                this.getComponent('AudioMng').stopMusic()
                cc.game.restart()
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NativeGengine", "stopGameEngine", "()Z")
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NativeGengine", "clearCache", "()V")
                this.getComponent('AudioMng').stopMusic()
                cc.game.restart()
            }
        }
    },
});
