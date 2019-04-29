cc.Class({
    extends: cc.Component,

    properties: {
        createNickname: cc.Node,
        createPassword: cc.Node,
        showMnemonic: cc.Node,
        toast: cc.Node,
        editNickname: cc.EditBox,
        editPassword: cc.EditBox,
        countDown: cc.Label,
        btnOK: cc.Button,
        labelMnemonics: {
            default: [],
            type: cc.Label,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onLoad: function () {

    },

    onClickCloseCreateNickname: function() {
        cc.director.loadScene('splash')
    },

    onClickCreateNickname: function() {
        if (this.editNickname.string.length > 0 && this.editNickname.string.length < 8) {
            this.createNickname.active = false
            this.createPassword.active = true
            this.showMnemonic.active = false
        }
    },

    onClickLoginMnemonic: function() {
        cc.director.loadScene('loginMnemonic')
    },

    onClickCloseCreatePassword: function() {
        this.createNickname.active = true
        this.createPassword.active = false
        this.showMnemonic.active = false
    },

    onClickCreatePassword: function() {
        if (this.editPassword.string.length >= 6 && this.editPassword.string.length <= 12) {
            this.createNickname.active = false
            this.createPassword.active = false
            this.showMnemonic.active = true
            if (cc.sys.isNative && cc.sys.isMobile) {
                var ret = "[]"
                if (cc.sys.os === cc.sys.OS_IOS) {
                    ret = jsb.reflection.callStaticMethod("NativeGengine", 
                    "createAccount:", 
                    this.editPassword.string);
                } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                    ret = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NativeGengine", 
                    "createAccount", "(Ljava/lang/String;)Ljava/lang/String;",  
                    this.editPassword.string);
                }
                console.log("createAccount return " + ret)
                var account = JSON.parse(ret)
                this.account = account
                var mnemonics = account.mnemonic.split(" ")
                for (var i = 0; i < 12; i++) {
                    this.labelMnemonics[i].string = mnemonics[i]
                }
                this.time = 20
                this.countDown.node.active = true
                this.countDown.string = '（剩余20s）'
                this.btnOK.interactable = false
                this.schedule(this.timerUpdate, 1, this.time - 1)
            }
        }
    },

    onClickCloseShowMnemonic: function() {
        this.createNickname.active = false
        this.createPassword.active = true
        this.showMnemonic.active = false
        this.toast.active = false
    },

    timerUpdate: function() {
        this.time = this.time - 1
        if (this.time === 0) {
            this.countDown.node.active = false
            this.btnOK.interactable = true
            this.unschedule(this.timerUpdate)
        } else {
            this.countDown.string = '（剩余' + this.time + 's）'
        }
    },

    onClickCreateAccountByPassword: function() {
        this.toast.active = true
    },

    onClickMnemonicToastOK: function() {
        this.toast.active = false
        this.createAccountByPassword()
    },

    onClickMnemonicToastCancel: function() {
        this.toast.active = false
    },

    createAccountByPassword: function() {
        if (cc.sys.isNative && cc.sys.isMobile) {
            var accountInfo = {}
            accountInfo.Nickname = this.editNickname.string
            accountInfo.Addr = this.account.pubKey
            cc.dgame.settings.accountsInfo.push(accountInfo)
            cc.sys.localStorage.setItem("accountsInfo", JSON.stringify(cc.dgame.settings.accountsInfo))
            cc.sys.localStorage.setItem("currentAccount", JSON.stringify(accountInfo))
            cc.dgame.settings.account = accountInfo
            cc.dgame.settings.account.Password = this.editPassword.string
            var ret = ""
            if (cc.sys.os === cc.sys.OS_IOS) {
                ret = jsb.reflection.callStaticMethod("NativeGengine", "chargeForAccount:", this.account.pubKey)
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                ret = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NativeGengine", "chargeForAccount", "(Ljava/lang/String;)Ljava/lang/String;", this.account.pubKey)
            }
            if (ret == "") {
                if (cc.sys.os === cc.sys.OS_IOS) {
                    jsb.reflection.callStaticMethod("NativeGengine", "callNativeUIWithTitle:andContent:", "自动充值失败","页面无响应")
                } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAlertDialog", "(Ljava/lang/String;Ljava/lang/String;)V", "自动充值失败","页面无响应")
                }
                return
            }
            var chargeResp = JSON.parse(ret)
            if (chargeResp.error !== 0) {
                if (cc.sys.os === cc.sys.OS_IOS) {
                    jsb.reflection.callStaticMethod("NativeGengine", "callNativeUIWithTitle:andContent:", "自动充值失败", chargeResp.msg)
                } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAlertDialog", "(Ljava/lang/String;Ljava/lang/String;)V", "自动充值失败", chargeResp.msg)
                }
                return
            }
        }
        cc.director.loadScene('gamehall')
    },

    // update (dt) {},
});
