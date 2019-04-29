window.__require = function e(t, n, i) {
function s(o, r) {
if (!n[o]) {
if (!t[o]) {
var c = o.split("/");
c = c[c.length - 1];
if (!t[c]) {
var l = "function" == typeof __require && __require;
if (!r && l) return l(c, !0);
if (a) return a(c, !0);
throw new Error("Cannot find module '" + o + "'");
}
}
var h = n[o] = {
exports: {}
};
t[o][0].call(h.exports, function(e) {
return s(t[o][1][e] || e);
}, h, h.exports, e, t, n, i);
}
return n[o].exports;
}
for (var a = "function" == typeof __require && __require, o = 0; o < i.length; o++) s(i[o]);
return s;
}({
AudioMng: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "99fdejMH4pNW5smw/mr5Azj", "AudioMng");
cc.Class({
extends: cc.Component,
properties: {
winAudio: {
default: null,
type: cc.AudioClip
},
loseAudio: {
default: null,
type: cc.AudioClip
},
cardAudio: {
default: null,
type: cc.AudioClip
},
playAudio: {
default: null,
type: cc.AudioClip
},
excitingAudio: {
default: null,
type: cc.AudioClip
},
bgm: {
default: null,
type: cc.AudioClip
}
},
playMusic: function() {
cc.audioEngine.playMusic(this.bgm, !0);
},
pauseMusic: function() {
cc.audioEngine.pauseMusic();
},
stopMusic: function() {
cc.audioEngine.stopMusic();
},
resumeMusic: function() {
cc.audioEngine.resumeMusic();
},
_playSFX: function(e) {
cc.audioEngine.playEffect(e, !1);
},
playWin: function() {
this._playSFX(this.winAudio);
},
playLose: function() {
this._playSFX(this.loseAudio);
},
playCard: function() {
this._playSFX(this.cardAudio);
},
playNormal: function() {
cc.audioEngine.playMusic(this.playAudio, !0);
},
playExciting: function() {
cc.audioEngine.playMusic(this.excitingAudio, !0);
}
});
cc._RF.pop();
}, {} ],
LanguageData: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "61de062n4dJ7ZM9/Xdumozn", "LanguageData");
var i = e("polyglot.min"), s = null;
window.i18n || (window.i18n = {
languages: {},
curLang: ""
});
0;
function a(e) {
return window.i18n.languages[e];
}
function o(e) {
e && (s ? s.replace(e) : s = new i({
phrases: e,
allowMissing: !0
}));
}
t.exports = {
init: function(e) {
if (e !== window.i18n.curLang) {
var t = a(e) || {};
window.i18n.curLang = e;
o(t);
this.inst = s;
}
},
t: function(e, t) {
if (s) return s.t(e, t);
},
inst: s,
updateSceneRenderers: function() {
for (var e = cc.director.getScene().children, t = [], n = 0; n < e.length; ++n) {
var i = e[n].getComponentsInChildren("LocalizedLabel");
Array.prototype.push.apply(t, i);
}
for (var s = 0; s < t.length; ++s) {
var a = t[s];
a.node.active && a.updateLabel();
}
for (var o = [], r = 0; r < e.length; ++r) {
var c = e[r].getComponentsInChildren("LocalizedSprite");
Array.prototype.push.apply(o, c);
}
for (var l = 0; l < o.length; ++l) {
var h = o[l];
h.node.active && h.updateSprite(window.i18n.curLang);
}
}
};
cc._RF.pop();
}, {
"polyglot.min": "polyglot.min"
} ],
LocalizedLabel: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "744dcs4DCdNprNhG0xwq6FK", "LocalizedLabel");
var i = e("LanguageData");
cc.Class({
extends: cc.Component,
editor: {
executeInEditMode: !0,
menu: "i18n/LocalizedLabel"
},
properties: {
dataID: {
get: function() {
return this._dataID;
},
set: function(e) {
if (this._dataID !== e) {
this._dataID = e;
this.updateLabel();
}
}
},
_dataID: ""
},
onLoad: function() {
0;
i.inst || i.init();
this.fetchRender();
},
fetchRender: function() {
var e = this.getComponent(cc.Label);
if (e) {
this.label = e;
this.updateLabel();
} else ;
},
updateLabel: function() {
if (this.label) {
i.t(this.dataID) && (this.label.string = i.t(this.dataID));
} else cc.error("Failed to update localized label, label component is invalid!");
}
});
cc._RF.pop();
}, {
LanguageData: "LanguageData"
} ],
LocalizedSprite: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "f34ac2GGiVOBbG6XlfvgYP4", "LocalizedSprite");
var i = e("SpriteFrameSet");
cc.Class({
extends: cc.Component,
editor: {
executeInEditMode: !0,
inspector: "packages://i18n/inspector/localized-sprite.js",
menu: "i18n/LocalizedSprite"
},
properties: {
spriteFrameSet: {
default: [],
type: i
}
},
onLoad: function() {
this.fetchRender();
},
fetchRender: function() {
var e = this.getComponent(cc.Sprite);
if (e) {
this.sprite = e;
this.updateSprite(window.i18n.curLang);
} else ;
},
getSpriteFrameByLang: function(e) {
for (var t = 0; t < this.spriteFrameSet.length; ++t) if (this.spriteFrameSet[t].language === e) return this.spriteFrameSet[t].spriteFrame;
},
updateSprite: function(e) {
if (this.sprite) {
var t = this.getSpriteFrameByLang(e);
!t && this.spriteFrameSet[0] && (t = this.spriteFrameSet[0].spriteFrame);
this.sprite.spriteFrame = t;
} else cc.error("Failed to update localized sprite, sprite component is invalid!");
}
});
cc._RF.pop();
}, {
SpriteFrameSet: "SpriteFrameSet"
} ],
NetConfig: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "40b81jC0E5Dya/fpn4yY7cU", "NetConfig");
t.exports = {
host: "ws://localhost",
port: 8546
};
cc._RF.pop();
}, {} ],
NetControl: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "e5f7f3JbOtLfJ2POE+2NHA6", "NetControl");
window.onfire = e("onfire");
e("NetConfig");
var i = {
_sock: {},
connect: function(e) {
if (1 !== this._sock.readyState) {
this._sock = new WebSocket("ws://" + e);
this._sock.onopen = this._onOpen.bind(this);
this._sock.onclose = this._onClose.bind(this);
this._sock.onmessage = this._onMessage.bind(this);
}
console.log(this._sock);
return this;
},
_onOpen: function() {
onfire.fire("onopen");
},
_onClose: function(e) {
onfire.fire("onclose", e);
},
_onMessage: function(e) {
onfire.fire("onmessage", e);
},
send: function(e) {
this._sock.send(e);
console.log("send msg" + e);
}
};
t.exports = i;
cc._RF.pop();
}, {
NetConfig: "NetConfig",
onfire: "onfire"
} ],
Net: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "42511QPU21FOa6gRttWqSdB", "Net");
cc.Class({
extends: cc.Component,
statics: {
netControl: null,
_handlers: null,
_msgid: null,
_eventName2handler: null,
_eventName2msgid: null,
_subscriptionid2eventName: null,
_eventName2subscriptionid: null,
_msgId: function() {
return this._msgid++;
},
_addHandler: function(e, t) {
if (this._handlers[e]) console.log("msgid:" + e + "' handler has been registered."); else {
this._handlers[e] = function(e) {
t(e);
};
}
},
connect: function(t, n, i) {
this._handlers = {};
this._msgid = 0;
this._eventName2handler = {};
this._eventName2msgid = {};
this._subscriptionid2eventName = {};
this._eventName2subscriptionid = {};
this.netControl = e("NetControl");
this.netControl.connect(i);
this.messageFire = onfire.on("onopen", t.bind(this));
this.messageFire = onfire.on("onclose", n.bind(this));
this.messageFire = onfire.on("onmessage", this._onMessage.bind(this));
},
sendMsg: function(e, t) {
var n = {
jsonrpc: "2.0",
method: "dgame_call",
params: e,
id: this._msgId()
};
null != t && void 0 != t && this._addHandler(n.id, t.bind(this));
this.netControl.send(JSON.stringify(n));
},
_eventHandler: function(e) {
this._subscriptionid2eventName;
},
addEventListener: function(e, t) {
var n = {
jsonrpc: "2.0",
method: "dgame_subscribe",
params: e,
id: this._msgId()
};
this._eventName2handler[e[0]] = t;
this._eventName2msgid[e[0]] = n.id;
this.netControl.send(JSON.stringify(n));
},
removeEventListener: function(e) {
var t = {
jsonrpc: "2.0",
method: "dgame_unsubscribe",
params: [ this._eventName2subscriptionid[e[0]] ],
id: this._msgId()
};
this._eventName2handler[e[0]] = null;
this._eventName2subscriptionid[e[0]] = null;
this._eventName2msgid[e[0]] = t.id;
this.netControl.send(JSON.stringify(t));
},
_isSubscriptionMsgid: function(e) {
for (var t in this._eventName2msgid) if (this._eventName2msgid[t] == e) return t;
return null;
},
_onMessage: function(e) {
var t = JSON.parse(e.data);
if (void 0 != t.id) {
var n = this._isSubscriptionMsgid(t.id);
if (null != n) {
this._subscriptionid2eventName[t.result] = n;
this._eventName2subscriptionid[n] = t.result;
this._eventName2msgid[n] = null;
} else this._handlers[t.id] && this._handlers[t.id](t.result);
this._handlers[t.id] = null;
} else {
var i = t.params.subscription;
this._eventName2handler[this._subscriptionid2eventName[i]] && this._eventName2handler[this._subscriptionid2eventName[i]](t.params.result);
}
}
}
});
cc._RF.pop();
}, {
NetControl: "NetControl"
} ],
SpriteFrameSet: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "97019Q80jpE2Yfz4zbuCZBq", "SpriteFrameSet");
var i = cc.Class({
name: "SpriteFrameSet",
properties: {
language: "",
spriteFrame: cc.SpriteFrame
}
});
t.exports = i;
cc._RF.pop();
}, {} ],
accountItem: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "6a074aWPOhM+LhWhKZytvKV", "accountItem");
cc.Class({
extends: cc.Component,
properties: {
nickname: cc.Label
},
init: function(e) {
this.nickname.string = e.Nickname;
this.accountAddr = e.Addr;
},
update: function(e) {},
selectAccount: function() {
cc.find("loginAccount").getComponent("loginAccount").tryVerifyAccount(this.nickname.string, this.accountAddr);
}
});
cc._RF.pop();
}, {} ],
accountList: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "9b29bjFdcdNWplBXVcWOytp", "accountList");
cc.Class({
extends: cc.Component,
properties: {
scrollView: cc.ScrollView,
prefabAccountItem: cc.Prefab,
accountNum: 0
},
onLoad: function() {
this.content = this.scrollView.content;
},
populateList: function(e) {
this.content.removeAllChildren();
for (var t in e) {
var n = {};
n.Addr = e[t].Addr;
n.Nickname = e[t].Nickname;
var i = cc.instantiate(this.prefabAccountItem);
i.getComponent("accountItem").init(n);
this.content.addChild(i);
}
},
update: function(e) {}
});
cc._RF.pop();
}, {} ],
countdown: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "8ed6em6jPNEd4OQfexNB24X", "countdown");
cc.Class({
extends: cc.Component,
properties: {
timeLabel: {
default: null,
type: cc.Label
}
},
setActive: function(e, t) {
this.node.active = !0;
this.time = e;
this.timeLabel.string = this.time;
this.callback = t;
this.schedule(this.timerUpdate, 1, e - 1);
},
timerUpdate: function() {
this.time = this.time - 1;
this.timeLabel.string = this.time;
if (0 == this.time && this.callback) {
this.callback();
this.setDisable();
}
},
setDisable: function() {
this.unschedule(this.timerUpdate);
this.node.active = !1;
}
});
cc._RF.pop();
}, {} ],
createAccount: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "947d4ZRscVLHbH8Zwe9LCqm", "createAccount");
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
type: cc.Label
}
},
onLoad: function() {},
onClickCloseCreateNickname: function() {
cc.director.loadScene("splash");
},
onClickCreateNickname: function() {
if (this.editNickname.string.length > 0 && this.editNickname.string.length < 8) {
this.createNickname.active = !1;
this.createPassword.active = !0;
this.showMnemonic.active = !1;
}
},
onClickLoginMnemonic: function() {
cc.director.loadScene("loginMnemonic");
},
onClickCloseCreatePassword: function() {
this.createNickname.active = !0;
this.createPassword.active = !1;
this.showMnemonic.active = !1;
},
onClickCreatePassword: function() {
if (this.editPassword.string.length >= 6 && this.editPassword.string.length <= 12) {
this.createNickname.active = !1;
this.createPassword.active = !1;
this.showMnemonic.active = !0;
if (cc.sys.isNative && cc.sys.isMobile) {
var e = "[]";
cc.sys.os === cc.sys.OS_IOS ? e = jsb.reflection.callStaticMethod("NativeGengine", "createAccount:", this.editPassword.string) : cc.sys.os === cc.sys.OS_ANDROID && (e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NativeGengine", "createAccount", "(Ljava/lang/String;)Ljava/lang/String;", this.editPassword.string));
console.log("createAccount return " + e);
var t = JSON.parse(e);
this.account = t;
for (var n = t.mnemonic.split(" "), i = 0; i < 12; i++) this.labelMnemonics[i].string = n[i];
this.time = 20;
this.countDown.node.active = !0;
this.countDown.string = "（剩余20s）";
this.btnOK.interactable = !1;
this.schedule(this.timerUpdate, 1, this.time - 1);
}
}
},
onClickCloseShowMnemonic: function() {
this.createNickname.active = !1;
this.createPassword.active = !0;
this.showMnemonic.active = !1;
this.toast.active = !1;
},
timerUpdate: function() {
this.time = this.time - 1;
if (0 === this.time) {
this.countDown.node.active = !1;
this.btnOK.interactable = !0;
this.unschedule(this.timerUpdate);
} else this.countDown.string = "（剩余" + this.time + "s）";
},
onClickCreateAccountByPassword: function() {
this.toast.active = !0;
},
onClickMnemonicToastOK: function() {
this.toast.active = !1;
this.createAccountByPassword();
},
onClickMnemonicToastCancel: function() {
this.toast.active = !1;
},
createAccountByPassword: function() {
if (cc.sys.isNative && cc.sys.isMobile) {
var e = {};
e.Nickname = this.editNickname.string;
e.Addr = this.account.pubKey;
cc.dgame.settings.accountsInfo.push(e);
cc.sys.localStorage.setItem("accountsInfo", JSON.stringify(cc.dgame.settings.accountsInfo));
cc.sys.localStorage.setItem("currentAccount", JSON.stringify(e));
cc.dgame.settings.account = e;
cc.dgame.settings.account.Password = this.editPassword.string;
var t = "";
cc.sys.os === cc.sys.OS_IOS ? t = jsb.reflection.callStaticMethod("NativeGengine", "chargeForAccount:", this.account.pubKey) : cc.sys.os === cc.sys.OS_ANDROID && (t = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NativeGengine", "chargeForAccount", "(Ljava/lang/String;)Ljava/lang/String;", this.account.pubKey));
if ("" == t) {
cc.sys.os === cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("NativeGengine", "callNativeUIWithTitle:andContent:", "自动充值失败", "页面无响应") : cc.sys.os === cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAlertDialog", "(Ljava/lang/String;Ljava/lang/String;)V", "自动充值失败", "页面无响应");
return;
}
var n = JSON.parse(t);
if (0 !== n.error) {
cc.sys.os === cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("NativeGengine", "callNativeUIWithTitle:andContent:", "自动充值失败", n.msg) : cc.sys.os === cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAlertDialog", "(Ljava/lang/String;Ljava/lang/String;)V", "自动充值失败", n.msg);
return;
}
}
cc.director.loadScene("gamehall");
}
});
cc._RF.pop();
}, {} ],
eventlistener: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "50647gKkWpKF719whzHVaeV", "eventlistener");
t.exports = {
listeners: {
default: [],
type: [ Object ]
},
init: function() {
this.EVENTSTRINGS = e("eventutils");
},
registerListener: function(e, t, n) {
var i = {};
i.callback = t;
i.target = n;
if (null == this.listeners[e]) {
(s = new Array()).push(i);
this.listeners[e] = s;
} else {
var s;
(s = this.listeners[e]).push(i);
}
},
removeListener: function(e, t) {
var n = this.listeners[e];
if (n) {
for (var i = new Array(), s = 0; s < n.length; s++) {
n[s].target == t && i.push(s);
}
for (s = i.length - 1; s >= 0; s--) n.splice(i[s], 1);
}
},
broadcastListener: function(e, t) {
var n = this.listeners[e];
if (n) for (var i = 0; i < n.length; i++) {
var s = n[i], a = s.callback;
s.target;
a(t);
}
}
};
cc._RF.pop();
}, {
eventutils: "eventutils"
} ],
eventutils: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "aa96aFOuitBcbZ8yl5lLsZ9", "eventutils");
t.exports = {
ALL_PLAYERS_READY: 1,
DEAL_POKERS: 2,
CALL_DIZHU: 3,
CALL_DIZHU_CALL_BACK: 4,
CALL_DIZHU_DECIDE: 4097,
DECIDE_DIZHU_CALL_BACK: 5,
ROB_DIZHU: 6,
ROB_DIZHU_CALL_BACK: 7,
DECIDE_ROB_DIZHU_CALL_BACK: 4098,
READY_PLAY_A_HAND_CALL_BACK: 8,
PLAY_A_HAND: 9,
PLAY_A_HAND_CALL_BACK: 16,
NO_OUT_CARD: 17,
NO_OUT_CARD_CALL_BACK: 18,
FOLLOW_CARD_CALL_BACK: 19,
GAME_OVER_CALL_BACK: 20,
NEW_GAME: 21,
NEW_GAME_CALL_BACK: 22,
RE_DEAL_CALL_BACK: 23,
PLAYER_CALLDIZHU_OPERATE: 16777217,
PLAYER_ROBDIZHU_OPERATE: 16777218,
PLAYER_CALLOUTCARD_OPERATE: 16777219,
PLAYER_REMIND: 16777220,
HIDE_OPERATE_PANEL: 16777221,
HIDE_COUNT_DOWN: 16777222
};
cc._RF.pop();
}, {} ],
exchange: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "59940lFwgNNwb30CDZRzDXe", "exchange");
cc.Class({
extends: cc.Component,
properties: {
exchangeGold: cc.Node,
exchangeUSDT: cc.Node,
exchangeUSDTConfirm: cc.Node,
donate: cc.Node,
donateConfirm: cc.Node,
btnExchangeGoldPress: cc.Node,
btnExchangeUSDTPress: cc.Node,
btnDonatePress: cc.Node,
exchangeGoldAddr: cc.Label,
exchangeGoldCurrentGold: cc.Label,
copyTips: cc.Node,
editGoldNumber: cc.EditBox,
editExchangeAddr: cc.EditBox,
exchangeUSDTCurrentGold: cc.Label,
exchangeUSDTConfimGoldNumber: cc.Label,
exchangeUSDTConfimExchangeAddr: cc.Label,
exchangeUSDTTips: cc.Node,
editDonateGoldNumber: cc.EditBox,
editDonateFriendID: cc.EditBox,
myID: cc.Label,
totalGoldNumber: cc.Label,
donateConfirmGoldNumber: cc.Label,
donateConfirmFirendID: cc.Label,
donateTips: cc.Node
},
onClickClose: function() {
cc.director.loadScene("gamehall");
},
onLoad: function() {
this.exchangeGold.active = !0;
this.exchangeUSDT.active = !1;
this.exchangeUSDTConfirm.active = !1;
this.donate.active = !1;
this.donateConfirm.active = !1;
this.btnExchangeGoldPress.active = !0;
this.btnExchangeUSDTPress.active = !1;
this.btnDonatePress.active = !1;
this.exchangeGoldCurrentGold.string = cc.dgame.settings.account.Gold;
this.exchangeGoldAddr.string = cc.dgame.settings.account.Addr;
this.exchangeUSDTCurrentGold.string = cc.dgame.settings.account.Gold;
this.totalGoldNumber.string = cc.dgame.settings.account.Gold;
},
onClickCopyToClipboard: function() {
this.copyTips.active = !0;
this.scheduleOnce(function() {
this.copyTips.active = !1;
}, 3);
},
onClickExchangeGoldNormal: function() {
this.exchangeGold.active = !0;
this.exchangeUSDT.active = !1;
this.exchangeUSDTConfirm.active = !1;
this.donate.active = !1;
this.donateConfirm.active = !1;
this.btnExchangeGoldPress.active = !0;
this.btnExchangeUSDTPress.active = !1;
this.btnDonatePress.active = !1;
},
onClickExchangeUSDTNormal: function() {
this.exchangeGold.active = !1;
this.exchangeUSDT.active = !0;
this.exchangeUSDTConfirm.active = !1;
this.donate.active = !1;
this.donateConfirm.active = !1;
this.btnExchangeGoldPress.active = !1;
this.btnExchangeUSDTPress.active = !0;
this.btnDonatePress.active = !1;
},
onClickDonateNormal: function() {
this.exchangeGold.active = !1;
this.exchangeUSDT.active = !1;
this.exchangeUSDTConfirm.active = !1;
this.donate.active = !0;
this.donateConfirm.active = !1;
this.btnExchangeGoldPress.active = !1;
this.btnExchangeUSDTPress.active = !1;
this.btnDonatePress.active = !0;
},
onClickExchangeUSDTOK: function() {
this.exchangeGold.active = !1;
this.exchangeUSDT.active = !1;
this.exchangeUSDTConfirm.active = !0;
this.donate.active = !1;
this.donateConfirm.active = !1;
this.exchangeUSDTConfimGoldNumber.string = this.editGoldNumber.string;
this.exchangeUSDTConfimExchangeAddr.string = this.editExchangeAddr.string;
},
onClickDonateOK: function() {
this.exchangeGold.active = !1;
this.exchangeUSDT.active = !1;
this.exchangeUSDTConfirm.active = !1;
this.donate.active = !1;
this.donateConfirm.active = !0;
this.donateConfirmGoldNumber.string = this.editDonateGoldNumber.string;
this.donateConfirmFirendID.string = this.editDonateFriendID.string;
},
onClickExchangeUSDTConfirmOK: function() {
this.exchangeUSDTTips.active = !0;
this.scheduleOnce(function() {
this.exchangeUSDTTips.active = !1;
}, 3);
},
onClickDonateConfirmOK: function() {
this.donateTips.active = !0;
this.scheduleOnce(function() {
this.donateTips.active = !1;
}, 3);
}
});
cc._RF.pop();
}, {} ],
gamehall: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "5eec0BDZUhADIFCdRwQGO8y", "gamehall");
cc.Class({
extends: cc.Component,
properties: {
nickname: cc.Label,
currentGoldNum: cc.Label,
roomlayer: cc.Node,
loadinglayer: cc.Node,
loadingTips: cc.Label,
btnRetry: cc.Button,
btnBack: cc.Button
},
onSelfAddress: function(e) {
console.log(e);
"string" == typeof e && (cc.dgame.gameplay.selfaddr = e.toLowerCase());
},
onLeave: function(e) {
console.log(e);
},
onRunGame: function(e) {
console.log("load complete(" + e + ")");
e.length > 25 && -1 !== e.indexOf("msglist.txt: no such file or directory") && cc.dgame.net.sendMsg([ "leave", "" ], this.onLeave.bind(this));
if (0 === parseInt(e)) {
this.unschedule(this.updateLoadingTips);
this.roomlayer.active = !0;
this.loadinglayer.active = !1;
cc.director.loadScene("tablescene");
} else {
this.unschedule(this.updateLoadingTips);
this.loadingTips.string = this.strings.LOAD_FAIL_CHECK_NETWORK;
this.btnRetry.node.active = !0;
}
},
updateLoadingTips: function() {
0 === this.loadCount && (this.loadingTips.string = this.strings.WAITING_FOR_LOAD);
this.loadingTips.string += ".";
this.loadCount++;
5 == this.loadCount && (this.loadCount = 0);
},
runGame: function() {
if (this.wsconnected) {
var e = {
game_contract_addr: cc.dgame.settings.game_contract_addr,
game_nodes: JSON.parse(cc.dgame.settings.game_nodes)
};
cc.dgame.net.sendMsg([ "rungame", JSON.stringify(e) ], this.onRunGame.bind(this));
this.btnRetry.node.active = !1;
this.loadCount = 0;
this.loadingTips.string = this.strings.WAITING_FOR_LOAD;
this.schedule(this.updateLoadingTips, .5);
this.roomlayer.active = !1;
this.loadinglayer.active = !0;
}
},
onOpen: function(e) {
this.wsconnected = !0;
cc.dgame.net.sendMsg([ "selfaddress", "" ], this.onSelfAddress.bind(this));
},
onClose: function(e) {
console.log("连接断开");
this.wsconnected = !1;
if (cc.sys.isNative && cc.sys.isMobile) if (cc.sys.os === cc.sys.OS_IOS) {
jsb.reflection.callStaticMethod("NativeGengine", "stopGameEngine");
cc.audioEngine.stopAll();
cc.game.restart();
} else if (cc.sys.os === cc.sys.OS_ANDROID) {
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NativeGengine", "stopGameEngine", "()Z");
cc.audioEngine.stopAll();
cc.game.restart();
}
},
onLoad: function() {
this.strings = e("string_zh");
this.nickname.string = cc.dgame.settings.account.Nickname;
this.wsconnected = !1;
if (cc.sys.isNative && cc.sys.isMobile) {
var t = "";
cc.sys.os === cc.sys.OS_IOS ? t = jsb.reflection.callStaticMethod("NativeGengine", "balanceOfAccount:", cc.dgame.settings.account.Addr) : cc.sys.os === cc.sys.OS_ANDROID && (t = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NativeGengine", "balanceOfAccount", "(Ljava/lang/String;)Ljava/lang/String;", cc.dgame.settings.account.Addr));
if (null !== t && void 0 !== t && t.length > 0) {
var n = JSON.parse(t);
if (0 !== n.error) cc.sys.os === cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("NativeGengine", "callNativeUIWithTitle:andContent:", "查询余额", n.msg) : cc.sys.os === cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAlertDialog", "(Ljava/lang/String;Ljava/lang/String;)V", "查询余额", n.msg); else {
cc.dgame.settings.account.Gold = parseInt(n.data);
this.currentGoldNum.string = cc.dgame.settings.account.Gold;
}
} else this.currentGoldNum.string = "0";
}
cc.sys.dump();
cc.log("cc.sys.isNative = " + cc.sys.isNative);
this.getComponent("AudioMng").playMusic();
var i = !0;
cc.sys.isNative && cc.sys.isMobile && (cc.sys.os === cc.sys.OS_IOS ? i = jsb.reflection.callStaticMethod("NativeGengine", "isRunning") : cc.sys.os === cc.sys.OS_ANDROID && (i = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NativeGengine", "isRunning", "()Z")));
i ? this.wsconnected = !0 : this.scheduleOnce(this.startGengine, .1);
cc.director.preloadScene("tablescene", function() {
cc.log("Next scene preloaded");
});
},
startGengine: function() {
console.log("account: " + cc.dgame.settings.account.Addr + ", password: " + cc.dgame.settings.account.Password);
var e = !1;
cc.sys.isNative && cc.sys.isMobile && (cc.sys.os === cc.sys.OS_IOS ? e = jsb.reflection.callStaticMethod("NativeGengine", "startGameEngineWithAccount:andPassword:", cc.dgame.settings.account.Addr, cc.dgame.settings.account.Password) : cc.sys.os === cc.sys.OS_ANDROID && (e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NativeGengine", "startGameEngineWithAccountAndPassword", "(Ljava/lang/String;Ljava/lang/String;)Z", cc.dgame.settings.account.Addr, cc.dgame.settings.account.Password)));
if (!1 === e) cc.sys.os === cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("NativeGengine", "callNativeUIWithTitle:andContent:", "Gengine启动失败", "启动失败") : cc.sys.os === cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAlertDialog", "(Ljava/lang/String;Ljava/lang/String;)V", "Gengine启动失败", "启动失败"); else {
console.log("开始连接：ws://127.0.0.1:8546");
cc.dgame.net.connect(this.onOpen.bind(this), this.onClose.bind(this), "127.0.0.1:8546");
}
},
enterPreviewRoom: function() {
cc.dgame.settings.game_contract_addr = "7be295035c500c374b1219e79e92ee2c6700f4b7";
cc.dgame.settings.game_nodes = JSON.stringify([ "enode://9b93cf2e45d98d3c95c432ea0858bc41e3148bcb36226e9143c0780ba85e24b796a6e3c2401b7ff756ac7f1058310ca563f20700c3371930639feaa94505da1d" ]);
this.runGame();
},
enterLowLevelRoom: function() {},
enterMidLevelRoom: function() {},
enterHighLevelRoom: function() {},
update: function(e) {},
onLoadSceneFinish: function() {
cc.log(this.currentSceneUrl);
this.btnBack.node.active = !("gamehall" == this.currentSceneUrl);
},
backToMenu: function() {
this.currentSceneUrl = "gamehall";
cc.director.loadScene("gamehall", this.onLoadSceneFinish.bind(this));
},
openAccountMgr: function() {
cc.director.loadScene("loginAccount");
},
onClickExchange: function() {
cc.director.loadScene("exchange");
},
onClickClearCache: function() {
if (cc.sys.isNative && cc.sys.isMobile) if (cc.sys.os === cc.sys.OS_IOS) {
jsb.reflection.callStaticMethod("NativeGengine", "stopGameEngine");
jsb.reflection.callStaticMethod("NativeGengine", "clearCache");
this.getComponent("AudioMng").stopMusic();
cc.game.restart();
} else if (cc.sys.os === cc.sys.OS_ANDROID) {
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NativeGengine", "stopGameEngine", "()Z");
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NativeGengine", "clearCache", "()V");
this.getComponent("AudioMng").stopMusic();
cc.game.restart();
}
}
});
cc._RF.pop();
}, {
string_zh: "string_zh"
} ],
gameoverpanel: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "ace8b/sTztENLUOHDVMB9z+", "gameoverpanel");
cc.Class({
extends: cc.Component,
properties: {
title: {
default: null,
type: cc.Label
},
winloss: {
default: null,
type: cc.Label
}
},
setActive: function(e, t, n) {
this.node.active = !0;
this.title.string = e + "获得胜利！";
this.winloss.string = t;
this.callback = n;
},
endClicked: function() {
cc.log("确定");
this.node.active = !1;
this.callback && this.callback();
}
});
cc._RF.pop();
}, {} ],
loginAccount: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "87f05Lqc5xCk4IF+fddiqiT", "loginAccount");
cc.Class({
extends: cc.Component,
properties: {
loginWithPassword: cc.Node,
accountList: cc.Node,
currentNickname: cc.Label,
editPassword: cc.EditBox,
loginMnemonicToast: cc.Node,
createAccountToast: cc.Node,
loginPasswordErrorTips: cc.Label
},
onBack: function() {
cc.director.loadScene("gamehall");
},
onLoad: function() {
this.currentNickname.string = cc.dgame.settings.account.Nickname;
},
onClickCreateAccountLink: function() {
this.createAccountToast.active = !0;
},
onClickCreateAccountToastOK: function() {
this.createAccountToast.active = !1;
cc.director.loadScene("createAccount");
},
onClickCreateAccountToastCancel: function() {
this.createAccountToast.active = !1;
},
onClickLoginMnemonicToastOK: function() {
this.loginMnemonicToast.active = !1;
cc.director.loadScene("loginMnemonic");
},
onClickLoginMnemonicToastCancel: function() {
this.loginMnemonicToast.active = !1;
},
onClickLoginMnemonicLink: function() {
this.loginMnemonicToast.active = !0;
},
onClickCloseLoginWithPassword: function() {
cc.director.loadScene("splash");
},
onSwitchAccount: function() {
this.accountList.active = !this.accountList.active;
this.accountList.active && this.loadLocalAccounts();
},
loadLocalAccounts: function() {
for (var e = this.accountList.getComponent("accountList"), t = new Array(), n = 0; n < cc.dgame.settings.accountsInfo.length; n++) {
var i = {};
i.Nickname = cc.dgame.settings.accountsInfo[n].Nickname;
i.Addr = cc.dgame.settings.accountsInfo[n].Addr;
t.push(i);
}
e.populateList(t);
},
tryVerifyAccount: function(e, t) {
console.log("clicked: " + e + ", " + t);
this.currentNickname.string = e;
cc.dgame.settings.account.Nickname = e;
cc.dgame.settings.account.Addr = t;
this.accountList.active = !1;
},
onClickVerifyAccount: function() {
var e = !1;
cc.sys.isNative && cc.sys.isMobile && (cc.sys.os === cc.sys.OS_IOS ? e = jsb.reflection.callStaticMethod("NativeGengine", "unlockAccount:withPassword:", cc.dgame.settings.account.Addr, this.editPassword.string) : cc.sys.os === cc.sys.OS_ANDROID && (e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NativeGengine", "unlockAccountWithPassword", "(Ljava/lang/String;Ljava/lang/String;)Z", cc.dgame.settings.account.Addr, this.editPassword.string)));
if (e) {
cc.sys.localStorage.setItem("currentAccount", JSON.stringify(cc.dgame.settings.account));
cc.dgame.settings.account.Password = this.editPassword.string;
cc.director.loadScene("gamehall");
} else {
this.loginPasswordErrorTips.string = "密码错误，请重新输入";
this.scheduleOnce(function() {
this.loginPasswordErrorTips.string = "";
}, 3);
}
}
});
cc._RF.pop();
}, {} ],
loginMnemonic: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "63762TbhwNPkoulVU+JqDDK", "loginMnemonic");
cc.Class({
extends: cc.Component,
properties: {
loginMnemonic: cc.Node,
createPassowrd: cc.Node,
createNickname: cc.Node,
editPassword: cc.EditBox,
editNickname: cc.EditBox,
loginMnemonicErrorTips: cc.Label,
editMnemonics: {
default: [],
type: cc.EditBox
}
},
onBack: function() {
cc.director.loadScene("gamehall");
},
onLoad: function() {},
onClickCloseLoginMnemonic: function() {
cc.director.loadScene("splash");
},
onClickCloseCreatePassword: function() {
this.loginMnemonic.active = !0;
this.createPassowrd.active = !1;
this.createNickname.active = !1;
},
onClickCloseCreateNickname: function() {
this.loginMnemonic.active = !1;
this.createPassowrd.active = !0;
this.createNickname.active = !1;
},
onClickLoginMnemonicNext: function() {
this.mnemonic = "";
for (var e = 0; e < this.editMnemonics.length; e++) e != this.editMnemonics.length - 1 ? this.mnemonic = this.mnemonic + this.editMnemonics[e].string + " " : this.mnemonic = this.mnemonic + this.editMnemonics[e].string;
console.log("mnemonic: " + this.mnemonic);
this.loginMnemonic.active = !1;
this.createPassowrd.active = !0;
this.createNickname.active = !1;
},
onClickCreatePassword: function() {
var e = "";
cc.sys.os === cc.sys.OS_IOS ? e = jsb.reflection.callStaticMethod("NativeGengine", "importAccount:withPassword:", this.mnemonic, this.editPassword.string) : cc.sys.os === cc.sys.OS_ANDROID && (e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NativeGengine", "importAccountWithPassword", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", this.mnemonic, this.editPassword.string));
if (null !== e && void 0 !== e && e.length > 0) {
this.loginMnemonic.active = !1;
this.createPassowrd.active = !1;
this.createNickname.active = !0;
this.accountAddr = e;
} else {
this.loginMnemonicErrorTips.string = "账户导入失败，请返回重新输入助记词";
this.scheduleOnce(function() {
this.loginMnemonicErrorTips.string = "";
}, 3);
}
},
onClickCreateNickname: function() {
var e = {};
e.Nickname = this.editNickname.string;
e.Addr = this.accountAddr;
cc.dgame.settings.account = e;
cc.dgame.settings.accountsInfo.push(e);
cc.sys.localStorage.setItem("accountsInfo", JSON.stringify(cc.dgame.settings.accountsInfo));
cc.sys.localStorage.setItem("currentAccount", JSON.stringify(e));
cc.dgame.settings.account.Password = this.editPassword.string;
cc.director.loadScene("gamehall");
}
});
cc._RF.pop();
}, {} ],
onfire: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "4546aqgMx1H1LH0OxCL5y/t", "onfire");
var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
return typeof e;
} : function(e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};
!function(e, n) {
"object" === ("undefined" == typeof t ? "undefined" : i(t)) && t.exports ? t.exports = n() : e.onfire = n();
}("undefined" != typeof window ? window : void 0, function() {
var e = {}, t = 0, n = "string", s = "function", a = Function.call.bind(Object.hasOwnProperty), o = Function.call.bind(Array.prototype.slice);
function r(o, r, c, l) {
if (("undefined" == typeof o ? "undefined" : i(o)) !== n || ("undefined" == typeof r ? "undefined" : i(r)) !== s) throw new Error("args: " + n + ", " + s);
a(e, o) || (e[o] = {});
e[o][++t] = [ r, c, l ];
return [ o, t ];
}
function c(e, t) {
for (var n in e) a(e, n) && t(n, e[n]);
}
function l(t, n) {
a(e, t) && c(e[t], function(i, s) {
s[0].apply(s[2], n);
s[1] && delete e[t][i];
});
}
return {
on: function(e, t, n) {
return r(e, t, 0, n);
},
one: function(e, t, n) {
return r(e, t, 1, n);
},
un: function(t) {
var o, r, l = !1, h = "undefined" == typeof t ? "undefined" : i(t);
if (h === n) {
if (a(e, t)) {
delete e[t];
return !0;
}
return !1;
}
if ("object" === h) {
o = t[0];
r = t[1];
if (a(e, o) && a(e[o], r)) {
delete e[o][r];
return !0;
}
return !1;
}
if (h === s) {
c(e, function(n, i) {
c(i, function(i, s) {
if (s[0] === t) {
delete e[n][i];
l = !0;
}
});
});
return l;
}
return !0;
},
fire: function(e) {
var t = o(arguments, 1);
setTimeout(function() {
l(e, t);
});
},
fireSync: function(e) {
l(e, o(arguments, 1));
},
clear: function() {
e = {};
}
};
});
cc._RF.pop();
}, {} ],
operatepanel: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "22078bjetBN7qVgPZF9KCWe", "operatepanel");
cc.Class({
extends: cc.Component,
properties: {
startPanel: {
default: null,
type: cc.Node
},
robPanel: {
default: null,
type: cc.Node
},
outPanel: {
default: null,
type: cc.Node
},
onlyOut: {
default: null,
type: cc.Node
},
callPanel: {
default: null,
type: cc.Node
}
},
onLoad: function() {},
showStart: function() {
this.startPanel.active = !0;
},
setStartCallback: function(e) {
this.startCallback = e;
},
startGame: function() {
this.startCallback && this.startCallback();
this.startPanel.active = !1;
},
showRob: function() {
this.robPanel.active = !0;
},
setRobCallback: function(e, t) {
this.robDiZhuCallback = e;
this.noRobCallback = t;
},
robDiZhu: function() {
this.robDiZhuCallback && this.robDiZhuCallback();
this.robPanel.active = !1;
},
noRob: function() {
this.noRobCallback && this.noRobCallback();
this.robPanel.active = !1;
},
showOut: function() {
this.outPanel.active = !0;
},
showOnlyOut: function() {
this.onlyOut.active = !0;
},
setOutCallback: function(e, t) {
this.outCardCallback = e;
this.noOutCallback = t;
},
outCard: function() {
this.outCardCallback && this.outCardCallback();
},
noOut: function() {
this.noOutCallback && this.noOutCallback();
this.outPanel.active = !1;
},
hideOutPanel: function() {
this.outPanel.active = !1;
this.onlyOut.active = !1;
},
setCallCallback: function(e, t) {
this.callCallback = e;
this.noCallCallback = t;
},
showCallPanel: function() {
this.callPanel.active = !0;
},
hideCallPanel: function() {
this.callPanel.active = !1;
},
callDiZhuClicked: function() {
this.callCallback && this.callCallback();
this.callPanel.active = !1;
},
noCallDiZhuClicked: function() {
this.noCallCallback && this.noCallCallback();
this.callPanel.active = !1;
}
});
cc._RF.pop();
}, {} ],
player: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "b5223UmS39LracNS2w4r0uK", "player");
var i = e("poker");
cc.Class({
extends: cc.Component,
properties: {
index: 0,
handPoker: {
default: [],
type: [ i ]
},
isSelf: !1,
cardsNumLabel: {
default: null,
type: cc.Label
},
remindLabel: {
default: null,
type: cc.Label
},
readyLabel: {
default: null,
type: cc.Node
},
dizhuLabel: {
default: null,
type: cc.Node
},
stakeNum: {
default: null,
type: cc.Label
},
downLoc: {
default: null,
type: cc.Node
},
stakeNode: {
default: null,
type: cc.Node
},
playerAddr: {
default: null,
type: cc.Label
}
},
onLoad: function() {
this.initEventListeners();
this.initConfigs();
},
onDestroy: function() {
this.listener.removeListener(this.listener.EVENTSTRINGS.CALL_DIZHU_CALL_BACK, this);
this.listener.removeListener(this.listener.EVENTSTRINGS.ROB_DIZHU_CALL_BACK, this);
this.listener.removeListener(this.listener.EVENTSTRINGS.DECIDE_ROB_DIZHU_CALL_BACK, this);
this.listener.removeListener(this.listener.EVENTSTRINGS.READY_PLAY_A_HAND_CALL_BACK, this);
this.listener.removeListener(this.listener.EVENTSTRINGS.PLAY_A_HAND_CALL_BACK, this);
},
initConfigs: function() {
this.rule = e("pokerrule");
this.rule.init();
this.strings = e("string_zh");
this.enums = e("serverutils");
this.tablePokers = new Array();
},
initEventListeners: function() {
this.listener = e("eventlistener");
var t = this;
this.listener.registerListener(this.listener.EVENTSTRINGS.CALL_DIZHU_CALL_BACK, function(e) {
t.callDiZhuHandler(e);
}, this);
this.listener.registerListener(this.listener.EVENTSTRINGS.ROB_DIZHU_CALL_BACK, function(e) {
t.robDiZhuCallback(e);
}, this);
this.listener.registerListener(this.listener.EVENTSTRINGS.DECIDE_ROB_DIZHU_CALL_BACK, function(e) {
t.robDiZhuDecide(e);
}, this);
this.listener.registerListener(this.listener.EVENTSTRINGS.READY_PLAY_A_HAND_CALL_BACK, function(e) {
t.readyPlayCallback(e);
}, this);
this.listener.registerListener(this.listener.EVENTSTRINGS.PLAY_A_HAND_CALL_BACK, function(e) {
t.playAHandCallback(e);
}, this);
},
callDiZhuHandler: function(e) {
if (e.index == this.index) {
cc.log("通知玩家 : %d 叫地主", e.index);
if (this.isSelf) this.listener.broadcastListener(this.listener.EVENTSTRINGS.PLAYER_CALLDIZHU_OPERATE); else {
var t = {};
t.index = this.index;
t.state = this.enums.CALL_DIZHU_STATE;
this.listener.broadcastListener(this.listener.EVENTSTRINGS.CALL_DIZHU_DECIDE, t);
this.remindLabel.string = this.strings.CALL_DIZHU;
}
}
},
robDiZhuCallback: function(e) {
e.index == this.index && (e.state == this.enums.ROB_DIZHU_STATE ? this.remindLabel.string = this.strings.ROB_DIZHU : e.state == this.enums.NO_ROB_STATE && (this.remindLabel.string = this.strings.NO_ROB));
},
robDiZhuDecide: function(e) {
if (e.index == this.index) if (this.isSelf) this.listener.broadcastListener(this.listener.EVENTSTRINGS.PLAYER_ROBDIZHU_OPERATE); else {
var t = {};
t.index = this.index;
t.state = this.enums.NO_ROB_STATE;
this.listener.broadcastListener(this.listener.EVENTSTRINGS.ROB_DIZHU, t);
}
},
readyPlayCallback: function(e) {
if (e.NextTurn == this.index && this.isSelf) {
this.setPokerAble();
this.result = e.Result;
this.clearTablePokers();
cc.log("出牌准备 : %d", this.result.Type);
null == this.result.Type || this.result.Type == this.rule.handPatterns.EVERYCARDTYPE ? this.listener.broadcastListener(this.listener.EVENTSTRINGS.PLAYER_CALLOUTCARD_OPERATE, 2) : this.listener.broadcastListener(this.listener.EVENTSTRINGS.PLAYER_CALLOUTCARD_OPERATE, 1);
}
},
playAHandCallback: function(e) {
new Array();
this.setPokerDisable();
if (e.index == this.index) {
this.clearTablePokers();
this.tablePokers = null;
this.tablePokers = new Array();
for (var t = 0; t < e.pokers.length; t++) for (var n = 0; n < this.handPoker.length; n++) {
var i = this.handPoker[n];
if (i.value == e.pokers[t]) {
this.tablePokers.push(i.node);
i.reveal(!0);
(a = i.node).zIndex = this.tablePokers.length;
var s = cc.moveTo(.1, cc.v2(this.downLoc.x + a.width * (t - this.tablePokers.length / 2), this.downLoc.y));
a.runAction(s);
this.handPoker.splice(n, 1);
break;
}
}
this.listener.broadcastListener(this.listener.EVENTSTRINGS.HIDE_OPERATE_PANEL);
} else if (this.tablePokers) for (t = 0; t < this.tablePokers.length; t++) {
var a;
(a = this.tablePokers[t]).active = !1;
}
this.disposeHandPokers();
e.result && (this.result = e.result);
},
pickUpOne: function(e) {
if (0 == this.handPoker.length) this.handPoker.push(e); else if (1 == this.handPoker.length) this.handPoker[0].num < e.num ? this.handPoker.splice(0, 0, e) : this.handPoker.push(e); else {
for (var t = !1, n = 0; n < this.handPoker.length; n++) if (this.handPoker[n].num < e.num) {
this.handPoker.splice(n, 0, e);
t = !0;
break;
}
t || this.handPoker.push(e);
}
this.disposeHandPokers();
if (this.isSelf) e.player = this; else {
this.cardsNumLabel.node.active = !0;
this.cardsNumLabel.string = this.handPoker.length;
}
},
disposeHandPokers: function() {
if (this.isSelf) for (e = 0; e < this.handPoker.length; e++) {
(t = this.handPoker[e]).isSelected = !1;
t.node.x = t.node.width * e * .5 - this.handPoker.length * t.node.width / 2 * .5;
t.node.y = this.node.y;
t.node.zIndex = e;
} else for (var e = 0; e < this.handPoker.length; e++) {
var t;
(t = this.handPoker[e]).node.x = this.node.x;
t.node.y = t.node.height * e * .3 - this.handPoker.length * t.node.height / 2 * .3;
t.node.zIndex = this.handPoker.length - e;
}
},
hideRemind: function() {
this.remindLabel.string = "";
},
pokerSelected: function(e) {
e.isSelected ? e.node.y = e.node.y + 30 : e.node.y = e.node.y - 30;
},
noOutCard: function() {
this.outPokers = new Array();
this.outIndexes = new Array();
var e = {
ID: cc.dgame.gameplay.seatId,
OP: 0,
Index: [],
Card: []
};
cc.dgame.net.sendMsg([ "Play", JSON.stringify(e) ], this.onPlayCard.bind(this));
},
dumpPokers: function(e) {
for (var t = "", n = 0; n < e.length; n++) t = n != e.length - 1 ? t + "[" + e[n].index + ", " + e[n].value + "], " : t + "[" + e[n].index + ", " + e[n].value + "]";
return t;
},
onPlayCard: function(e) {
cc.log(e);
if (0 == JSON.parse(e).state) {
if (this.tablePokers) for (var t = 0; t < this.tablePokers.length; t++) {
(s = this.tablePokers[t]).active = !1;
}
this.setPokerDisable();
this.tablePokers = null;
this.tablePokers = new Array();
0 == this.outPokers.length && (this.remindLabel.string = this.strings.NO_OUT);
for (t = 0; t < this.outPokers.length; t++) for (var n = 0; n < this.handPoker.length; n++) {
var i = this.handPoker[n];
if (i.value == this.outPokers[t]) {
this.tablePokers.push(i.node);
i.reveal(!0);
var s;
(s = i.node).zIndex = this.tablePokers.length;
var a = cc.moveTo(.1, cc.v2(this.downLoc.x + s.width * (t - this.tablePokers.length / 2), this.downLoc.y));
s.runAction(a);
this.handPoker.splice(n, 1);
break;
}
}
this.listener.broadcastListener(this.listener.EVENTSTRINGS.HIDE_OPERATE_PANEL);
this.disposeHandPokers();
} else this.listener.broadcastListener(this.listener.EVENTSTRINGS.PLAYER_REMIND, this.strings.POKERS_NOT_MATCHING);
},
playerOutCard: function() {
this.outPokers = new Array();
this.outIndexes = new Array();
for (var e = 0; e < this.handPoker.length; e++) {
var t = this.handPoker[e];
if (t.isSelected) {
this.outPokers.push(t.value);
this.outIndexes.push(t.index);
}
}
var n = {
ID: cc.dgame.gameplay.seatId,
OP: 0,
Index: this.outIndexes,
Card: this.outPokers
};
cc.dgame.net.sendMsg([ "Play", JSON.stringify(n) ], this.onPlayCard.bind(this));
return !0;
},
setPokerAble: function() {
cc.log("我这里有 : %d 张牌", this.handPoker.length);
for (var e = 0; e < this.handPoker.length; e++) {
this.handPoker[e].disabled = !1;
}
},
setPokerDisable: function() {
for (var e = 0; e < this.handPoker.length; e++) {
var t = this.handPoker[e];
t.disabled = !0;
t.isSelected = !1;
}
},
revealHandPokers: function() {
for (var e = 0; e < this.handPoker.length; e++) {
this.handPoker[e].reveal(!0);
}
},
clearHandPokers: function() {
cc.log("清理手牌");
this.setPokerDisable();
this.handPoker = new Array();
this.tablePokers = new Array();
this.remindLabel.string = "";
this.result = null;
},
setIsDiZhu: function(e) {
this.isDiZhu = e;
this.dizhuLabel.active = e;
},
hideCardsNum: function() {
this.cardsNumLabel.node.active = !1;
},
hideDizhuMark: function() {
this.dizhuLabel.active = !1;
},
setReady: function() {
this.readyLabel.active = !0;
},
hideReady: function() {
this.readyLabel.active = !1;
},
setPlayerAddr: function(e) {
this.playerAddr.string = e;
this.playerAddr.node.active = !0;
},
setStakeNum: function(e) {
this.stakeNum.string = e;
this.stakeNode.active = !0;
},
hideStake: function() {
this.stakeNode.active = !1;
},
showOutCard: function(e) {
this.clearTablePokers();
this.tablePokers = null;
this.tablePokers = new Array();
for (var t = 0; t < e.Index.length; t++) for (var n = 0; n < this.handPoker.length; n++) {
var i = this.handPoker[n];
if (i.index == e.Index[t]) {
this.tablePokers.push(i.node);
i.reveal(!0);
var s = i.node;
s.zIndex = this.tablePokers.length;
var a = cc.moveTo(.1, cc.v2(this.downLoc.x + s.width * (t - this.tablePokers.length / 2), this.downLoc.y));
s.runAction(a);
this.handPoker.splice(n, 1);
break;
}
}
this.cardsNumLabel && (this.cardsNumLabel.string = this.handPoker.length);
0 != e.Index.length && void 0 != e.Index.length || (this.remindLabel.string = this.strings.NO_OUT);
this.disposeHandPokers();
},
clearTablePokers: function() {
if (this.tablePokers) for (var e = 0; e < this.tablePokers.length; e++) {
this.tablePokers[e].active = !1;
}
},
resortHandPokers: function(e, t) {
cc.log("pokers.length = " + e.length + ", this.handPoker.length = " + this.handPoker.length);
for (var n = new Array(), i = new Array(), s = 0; s < e.length; s++) {
var a = this.handPoker[s];
a.setValue(e[s]);
a.setIndex(t[s]);
n.push(a.value);
i.push(a.index);
}
cc.log("before: " + JSON.stringify(n) + ", idx: " + JSON.stringify(i));
for (s = 0; s < this.handPoker.length; s++) for (var o = s + 1; o < this.handPoker.length; o++) {
var r = this.handPoker[s], c = this.handPoker[o];
if (c.num < r.num) {
var l = r;
this.handPoker[s] = c;
this.handPoker[o] = l;
}
}
n = new Array();
i = new Array();
for (s = 0; s < this.handPoker.length; s++) {
n.push(this.handPoker[s].value);
i.push(this.handPoker[s].index);
}
cc.log("after: " + JSON.stringify(n) + ", idx: " + JSON.stringify(i));
this.disposeHandPokers();
},
getHandPokers: function() {
for (var e = new Array(), t = 0; t < this.handPoker.length; t++) e.push(this.handPoker[t].getDetail());
return JSON.stringify(e);
},
setHandPokers: function(e) {
for (var t = new Array(), n = 0; n < e.length; n++) for (var i = 0; i < this.handPoker.length; i++) {
if (this.handPoker[i].index === e[n]) {
t.push(this.handPoker[n]);
break;
}
}
this.handPoker = t;
this.disposeHandPokers();
}
});
cc._RF.pop();
}, {
eventlistener: "eventlistener",
poker: "poker",
pokerrule: "pokerrule",
serverutils: "serverutils",
string_zh: "string_zh"
} ],
pokerrule: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "2debeB/qXlIlp1/i5+uvvR/", "pokerrule");
t.exports = {
init: function() {
this.handPatterns = {
ROKET: 1,
BOMB: 2,
SINGLE: 3,
DOUBLE: 4,
THREE: 5,
THREETAKEONE: 6,
THREETAKETWO: 7,
SINGLESTRAIGHT: 8,
DOUBLESTRAIGHT: 9,
THREESTRAIGHT: 10,
THREESTRAIGHTTAKESINGLE: 11,
THREESTRAIGHTTAKEDOUBLE: 12,
FOURTAKETWO: 13,
FOURTAKETWOPAIR: 14,
ERRORTYPE: 15,
EVERYCARDTYPE: 16
};
this.handPatternStr = [ "", "王炸", "炸弹", "单牌", "一对", "三张", "三带一", "三带一对", "顺子", "连对", "飞机", "飞机（带单）", "飞机（带对）", "四带二", "四带两对", "废牌", "任意类型" ];
},
judgePokerType: function(e) {
for (var t = 0; t < e.length; t++) for (var n = t; n < e.length; n++) {
var i = e[t], s = e[n];
if (s < i) {
var a = i;
e[t] = s;
e[n] = a;
}
}
var o = {}, r = this.getPokersDetail(e);
if (1 == e.length) {
o.type = this.handPatterns.SINGLE;
o.value = e[0];
} else if (2 == e.length) if (e[0] == e[1]) {
o.type = this.handPatterns.DOUBLE;
o.value = e[0];
} else 16 == e[0] && 17 == e[1] ? o.type = this.handPatterns.ROKET : o.type = this.handPatterns.ERRORTYPE; else if (3 == e.length) if (e[0] == e[1] && e[1] == e[2]) {
o.type = this.handPatterns.THREE;
o.value = e[0];
} else o.type = this.handPatterns.ERRORTYPE; else if (4 == e.length) if (1 == r.length) {
o.type = this.handPatterns.BOMB;
o.value = e[0];
} else if (2 == r.length) {
o.type = this.handPatterns.THREETAKEONE;
3 == r[0].num ? o.value = r[0].index : 3 == r[1].num ? o.value = r[1].index : o.type = this.handPatterns.ERRORTYPE;
} else o.type = this.handPatterns.ERRORTYPE; else if (5 == e.length) if (2 == r.length) {
o.type = this.handPatterns.THREETAKETWO;
3 == r[0].num ? o.value = r[0].index : o.value = r[1].index;
} else o.type = this.handPatterns.ERRORTYPE;
if (e.length >= 6 && (o.type == this.handPatterns.ERRORTYPE || null == o.type)) {
var c = !1, l = 0, h = new Array(), d = new Array();
for (t = 0; t < r.length; t++) if (4 == r[t].num) {
if (0 != c) {
o.type = this.handPatterns.ERRORTYPE;
c = !1;
break;
}
c = !0;
l = r[t].index;
} else if (2 == r[t].num) h.push(r[t].index); else {
if (1 != r[t].num) {
o.type = this.handPatterns.ERRORTYPE;
c = !1;
break;
}
d.push(r[t].index);
}
if (c) if (2 == h.length && 0 == d.length) {
o.value = l;
o.type = this.handPatterns.FOURTAKETWOPAIR;
} else if (1 == h.length && 0 == d.length) {
o.value = l;
o.type = this.handPatterns.FOURTAKETWO;
} else if (0 == h.length && 2 == d.length) {
o.value = l;
o.type = this.handPatterns.FOURTAKETWO;
} else {
o.value = l;
o.type = this.handPatterns.ERRORTYPE;
}
}
if (e.length >= 8 && (o.type == this.handPatterns.ERRORTYPE || null == o.type)) {
var u = new Array(), p = (h = new Array(), d = new Array(), !0);
for (t = 0; t < r.length; t++) if (3 == r[t].num) u.push(r[t].index); else if (2 == r[t].num) h.push(r[t].index); else {
if (1 != r[t].num) {
o.type = this.handPatterns.ERRORTYPE;
p = !1;
break;
}
d.push(r[t].index);
}
if (p && u.length > 0) {
u.sort();
for (t = 1; t < u.length; t++) if (u[t] - u[t - 1] != 1) {
o.type = this.handPatterns.ERRORTYPE;
p = !1;
break;
}
if (p) if (u.length != h.length && u.length != d.length && u.length != 2 * h.length + d.length) o.type = this.handPatterns.ERRORTYPE; else {
if ((g = u[u.length - 1]) > 14) o.type = this.handPatterns.ERRORTYPE; else {
u.length == h.length ? o.type = this.handPatterns.THREESTRAIGHTTAKEDOUBLE : o.type = this.handPatterns.THREESTRAIGHTTAKESINGLE;
o.max = g;
o.size = u.length;
}
}
}
}
if (e.length >= 6 && (e.length / 3 == r.length || e.length / 2 == r.length) && (o.type == this.handPatterns.ERRORTYPE || null == o.type)) if (this.judgePairIsStraight(r)) {
if ((g = e[e.length - 1]) > 14) o.type = this.handPatterns.ERRORTYPE; else {
e.length / 3 == r.length ? o.type = this.handPatterns.THREESTRAIGHT : o.type = this.handPatterns.DOUBLESTRAIGHT;
o.max = g;
o.size = r.length;
}
} else o.type = this.handPatterns.ERRORTYPE;
if (e.length > 4 && (o.type == this.handPatterns.ERRORTYPE || null == o.type) && e.length == r.length) if (this.judgeIsStraight(e)) {
var g;
if ((g = e[e.length - 1]) > 14) o.type = this.handPatterns.ERRORTYPE; else {
o.type = this.handPatterns.SINGLESTRAIGHT;
o.max = g;
o.size = r.length;
}
} else o.type = this.handPatterns.ERRORTYPE;
null == o.type && (o.type = this.handPatterns.ERRORTYPE);
console.log("judgePokerType return " + JSON.stringify(o));
return o;
},
getPokersDetail: function(e) {
for (var t = new Array(), n = 0; n < e.length; n++) {
for (var i = 0, s = 0; s < e.length; s++) n != s && e[n] == e[s] && i++;
for (var a = !1, o = 0; o < t.length; o++) {
if ((r = t[o]).index == e[n]) {
a = !0;
break;
}
}
if (0 == a) {
var r;
(r = {}).index = e[n];
r.num = i + 1;
t.push(r);
}
}
for (n = 0; n < t.length; n++) for (s = n; s < t.length; s++) {
var c = t[n], l = t[s];
if (l.num < c.num) {
var h = c;
t[n] = l;
t[s] = h;
}
}
console.log("getPokersDetail(" + JSON.stringify(e) + ") return " + JSON.stringify(t));
return t;
},
judgeIsPair: function(e) {
for (var t = e[0].num, n = 0; n < e.length; n++) if (e[n].num != t) return !1;
return !0;
},
judgePairIsStraight: function(e) {
if (1 == e.length) return !1;
for (var t = 1; t < e.length; t++) {
var n = e[t], i = e[t - 1];
if (n.index - i.index != 1) return !1;
}
return !0;
},
judgeIsStraight: function(e) {
if (1 == e.length) return !1;
for (var t = 1; t < e.length; t++) if (e[t] - e[t - 1] != 1) return !1;
return !0;
}
};
cc._RF.pop();
}, {} ],
poker: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "2f830HHnSJIObVEKvQEYuic", "poker");
e("player");
cc.Class({
extends: cc.Component,
properties: {
index: 0,
value: 0,
upNumLabel: {
default: null,
type: cc.Label
},
upColorSprite: {
default: null,
type: cc.Sprite
},
downNumLabel: {
default: null,
type: cc.Label
},
downColorSprite: {
default: null,
type: cc.Sprite
},
colorFrames: {
default: [],
type: cc.SpriteFrame
},
pokerBackground: {
default: null,
type: cc.Sprite
},
pokerFrontBG: {
default: null,
type: cc.SpriteFrame
},
pokerBackBG: {
default: null,
type: cc.SpriteFrame
},
sjokerSprite: {
default: null,
type: cc.Node
},
bjokerSprite: {
default: null,
type: cc.Node
}
},
onLoad: function() {
this.initConfigs();
this.setPoker();
},
initConfigs: function() {
this.pokerutils = e("pokerutils");
this.isSelected = !1;
this.player = null;
this.disabled = !0;
var t = this;
this.node.on(cc.Node.EventType.TOUCH_START, function(e) {
if (t.player && !t.disabled) {
t.isSelected = !t.isSelected;
t.player.pokerSelected(t);
}
}, this.node);
},
setIndex: function(e) {
this.index = e;
},
setValue: function(e) {
this.value = e;
this.pokerutils && this.setPoker();
},
setPoker: function() {
if (this.value > 53) this.info = "未知"; else {
switch (parseInt(this.value / 13)) {
case 0:
this.color = this.pokerutils.hearts;
this.setColorSprite(0);
this.upNumLabel.node.color = cc.Color.RED;
this.downNumLabel.node.color = cc.Color.RED;
this.info = "红桃";
break;

case 1:
this.color = this.pokerutils.spade;
this.setColorSprite(1);
this.upNumLabel.node.color = cc.Color.BLACK;
this.downNumLabel.node.color = cc.Color.BLACK;
this.info = "黑桃";
break;

case 2:
this.color = this.pokerutils.plum;
this.setColorSprite(2);
this.upNumLabel.node.color = cc.Color.BLACK;
this.downNumLabel.node.color = cc.Color.BLACK;
this.info = "梅花";
break;

case 3:
this.color = this.pokerutils.diamonds;
this.setColorSprite(3);
this.upNumLabel.node.color = cc.Color.RED;
this.downNumLabel.node.color = cc.Color.RED;
this.info = "方块";
break;

case 4:
if (52 == this.value) {
this.color = this.pokerutils.sjoker;
this.num = 16;
this.info = "小王";
} else if (53 == this.value) {
this.color = this.pokerutils.bjoker;
this.num = 17;
this.info = "大王";
}
this.setNumLabel("");
}
if (this.color != this.pokerutils.sjoker && this.color != this.pokerutils.bjoker) {
this.num = this.value % 13 + 1;
if (1 == this.num) {
this.setNumLabel("A");
this.info += "A";
this.num = 14;
} else if (2 == this.num) {
this.setNumLabel(2);
this.info += "2";
this.num = 15;
} else if (11 == this.num) {
this.setNumLabel("J");
this.info += "J";
} else if (12 == this.num) {
this.setNumLabel("Q");
this.info += "Q";
} else if (13 == this.num) {
this.setNumLabel("K");
this.info += "K";
} else {
this.setNumLabel(this.num);
this.info += "" + this.num;
}
}
}
},
setNumLabel: function(e) {
this.upNumLabel.string = e;
this.downNumLabel.string = e;
},
setColorSprite: function(e) {
this.upColorSprite.spriteFrame = this.colorFrames[e];
this.downColorSprite.spriteFrame = this.colorFrames[e];
},
getColor: function() {
return this.colorLabel.string;
},
getNum: function() {
return this.numLabel.string;
},
comparePoker: function(e) {},
reveal: function(e) {
if (52 == this.value) {
this.sjokerSprite.active = e;
this.bjokerSprite.active = !1;
this.upColorSprite.node.active = !1;
this.downColorSprite.node.active = !1;
this.pokerBackground.spriteFrame = e ? this.pokerFrontBG : this.pokerBackBG;
} else if (53 == this.value) {
this.sjokerSprite.active = !1;
this.bjokerSprite.active = e;
this.upColorSprite.node.active = !1;
this.downColorSprite.node.active = !1;
this.pokerBackground.spriteFrame = e ? this.pokerFrontBG : this.pokerBackBG;
} else {
this.sjokerSprite.active = !1;
this.bjokerSprite.active = !1;
this.upNumLabel.node.active = e;
this.upColorSprite.node.active = e;
this.downNumLabel.node.active = e;
this.downColorSprite.node.active = e;
this.pokerBackground.spriteFrame = e ? this.pokerFrontBG : this.pokerBackBG;
}
},
getInfo: function() {
return this.info;
},
getDetail: function() {
return "[" + this.index + ", " + this.value + ", " + this.info + "]: " + (this.pokerBackground.spriteFrame === this.pokerFrontBG ? "Up" : "Down") + " [sj: " + this.sjokerSprite.active + ", bj: " + this.bjokerSprite.active + "]";
}
});
cc._RF.pop();
}, {
player: "player",
pokerutils: "pokerutils"
} ],
pokerutils: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "1d3ed94RzxP+bk7DhEZ9qop", "pokerutils");
t.exports = {
hearts: 1048577,
spade: 1048578,
plum: 1048579,
diamonds: 1048580,
sjoker: 1048581,
bjoker: 1048582
};
cc._RF.pop();
}, {} ],
"polyglot.min": [ function(e, t, n) {
"use strict";
cc._RF.push(t, "e26fd9yy65A4q3/JkpVnFYg", "polyglot.min");
var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
return typeof e;
} : function(e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};
(function(e, s) {
"function" == typeof define && define.amd ? define([], function() {
return s(e);
}) : "object" == ("undefined" == typeof n ? "undefined" : i(n)) ? t.exports = s(e) : e.Polyglot = s(e);
})(void 0, function(e) {
function t(e) {
e = e || {}, this.phrases = {}, this.extend(e.phrases || {}), this.currentLocale = e.locale || "en", 
this.allowMissing = !!e.allowMissing, this.warn = e.warn || a;
}
function n(e, t, n) {
var i, a;
return null != n && e ? i = function(e) {
return e.replace(/^\s+|\s+$/g, "");
}((a = e.split(o))[s(t, n)] || a[0]) : i = e, i;
}
function s(e, t) {
return r[function(e) {
var t = function(e) {
var t, n, i, s = {};
for (t in e) if (e.hasOwnProperty(t)) {
n = e[t];
for (i in n) s[n[i]] = t;
}
return s;
}(c);
return t[e] || t.en;
}(e)](t);
}
function a(t) {
e.console && e.console.warn && e.console.warn("WARNING: " + t);
}
t.VERSION = "0.4.3", t.prototype.locale = function(e) {
return e && (this.currentLocale = e), this.currentLocale;
}, t.prototype.extend = function(e, t) {
var n;
for (var s in e) e.hasOwnProperty(s) && (n = e[s], t && (s = t + "." + s), "object" == ("undefined" == typeof n ? "undefined" : i(n)) ? this.extend(n, s) : this.phrases[s] = n);
}, t.prototype.clear = function() {
this.phrases = {};
}, t.prototype.replace = function(e) {
this.clear(), this.extend(e);
}, t.prototype.t = function(e, t) {
var i, s;
return "number" == typeof (t = null == t ? {} : t) && (t = {
smart_count: t
}), "string" == typeof this.phrases[e] ? i = this.phrases[e] : "string" == typeof t._ ? i = t._ : this.allowMissing ? i = e : (this.warn('Missing translation for key: "' + e + '"'), 
s = e), "string" == typeof i && (t = function(e) {
var t = {};
for (var n in e) t[n] = e[n];
return t;
}(t), s = function(e, t) {
for (var n in t) "_" !== n && t.hasOwnProperty(n) && (e = e.replace(new RegExp("%\\{" + n + "\\}", "g"), t[n]));
return e;
}(s = n(i, this.currentLocale, t.smart_count), t)), s;
}, t.prototype.has = function(e) {
return e in this.phrases;
};
var o = "||||", r = {
chinese: function(e) {
return 0;
},
german: function(e) {
return 1 !== e ? 1 : 0;
},
french: function(e) {
return e > 1 ? 1 : 0;
},
russian: function(e) {
return e % 10 == 1 && e % 100 != 11 ? 0 : e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 10 || e % 100 >= 20) ? 1 : 2;
},
czech: function(e) {
return 1 === e ? 0 : e >= 2 && e <= 4 ? 1 : 2;
},
polish: function(e) {
return 1 === e ? 0 : e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 10 || e % 100 >= 20) ? 1 : 2;
},
icelandic: function(e) {
return e % 10 != 1 || e % 100 == 11 ? 1 : 0;
}
}, c = {
chinese: [ "fa", "id", "ja", "ko", "lo", "ms", "th", "tr", "zh" ],
german: [ "da", "de", "en", "es", "fi", "el", "he", "hu", "it", "nl", "no", "pt", "sv" ],
french: [ "fr", "tl", "pt-br" ],
russian: [ "hr", "ru" ],
czech: [ "cs" ],
polish: [ "pl" ],
icelandic: [ "is" ]
};
return t;
});
cc._RF.pop();
}, {} ],
serverutils: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "c57d9QriZBOkqIwo2bphCrb", "serverutils");
t.exports = {
NOT_READY: 0,
READY: 1,
WAITING: 2,
NO_CALL_STATE: 3,
NO_ROB_STATE: 4,
CALL_DIZHU_STATE: 5,
ROB_DIZHU_STATE: 6,
FARMER_STATE: 7,
LADNLORD_STATE: 8,
initServerData: function() {
this.serverData = {};
this.serverData.lastWinner = -1;
}
};
cc._RF.pop();
}, {} ],
splash: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "c355c2go01AOqyexoELq3V2", "splash");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
if (null === cc.dgame || void 0 === cc.dgame) {
cc.dgame = {};
cc.dgame.net = e("Net");
cc.dgame.gameplay = {};
cc.dgame.settings = {};
}
if (null === cc.sys.localStorage.getItem("accountsInfo")) {
cc.sys.localStorage.setItem("accountsInfo", "[]");
cc.dgame.settings.accountsInfo = [];
} else cc.dgame.settings.accountsInfo = JSON.parse(cc.sys.localStorage.getItem("accountsInfo"));
if (cc.sys.isNative && cc.sys.isMobile) {
var t = "[]";
cc.sys.os === cc.sys.OS_IOS ? t = jsb.reflection.callStaticMethod("NativeGengine", "getAccounts") : cc.sys.os === cc.sys.OS_ANDROID && (t = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NativeGengine", "getAccounts", "()Ljava/lang/String;"));
cc.dgame.settings.accounts = JSON.parse(t);
var n = cc.sys.localStorage.getItem("currentAccount");
if (null === n || "" === n) cc.dgame.settings.account = null; else {
cc.dgame.settings.account = JSON.parse(n);
for (var i = !1, s = 0; s < cc.dgame.settings.accounts.length; s++) if (cc.dgame.settings.account.Addr.toLowerCase() === cc.dgame.settings.accounts[s].toLowerCase()) {
i = !0;
break;
}
if (!i) {
cc.sys.localStorage.removeItem("currentAccount");
cc.dgame.settings.account = null;
}
}
}
console.log("cur: " + JSON.stringify(cc.dgame.settings.account) + ", accounts: " + JSON.stringify(cc.dgame.settings.accounts) + ", accountsInfo: " + JSON.stringify(cc.dgame.settings.accountsInfo));
cc.director.preloadScene("gamehall", function() {
cc.log("Next scene preloaded");
});
},
startGame: function() {
null === cc.dgame.settings.account ? cc.director.loadScene("createAccount") : cc.director.loadScene("loginAccount");
}
});
cc._RF.pop();
}, {
Net: "Net"
} ],
string_zh: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "bb70dQBnpREAL5Dc7Y1ttir", "string_zh");
t.exports = {
WAITING_FOR_LOAD: "游戏加载中，请稍候",
LOAD_FAIL_CHECK_NETWORK: "加载失败，请检查网络",
WAITING_FOR_START: "等待匹配玩伴",
POKERS_NOT_MATCHING: "您选择的牌不符合规则",
GAME_OVER: "游戏结束",
CALL_DIZHU: "叫地主",
ROB_DIZHU: "抢地主",
NO_ROB: "不抢",
NO_CALL: "不叫",
NO_OUT: "不要"
};
cc._RF.pop();
}, {} ],
tablectrl: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "4c229a7WYJHO4QF7zxgc3Eb", "tablectrl");
var i = e("poker"), s = e("player"), a = e("operatepanel"), o = (e("countdown"), 
e("gameoverpanel"));
cc.Class({
extends: cc.Component,
properties: {
tableId: cc.Label,
gameMultiple: cc.Label,
pokers: {
default: [],
type: [ i ]
},
landlordPokers: {
default: [],
type: [ i ]
},
table: {
default: null,
type: cc.Node
},
uiLayer: {
default: null,
type: cc.Node
},
pokerPrefab: {
default: null,
type: cc.Prefab
},
playerMyself: {
default: null,
type: s
},
playerUp: {
default: null,
type: s
},
playerDown: {
default: null,
type: s
},
operatePanel: {
default: null,
type: a
},
players: {
default: [],
type: [ s ]
},
remindLabel: {
default: null,
type: cc.Label
},
countDownPrefab: {
default: null,
type: cc.Prefab
},
gameOverPanel: {
default: null,
type: o
}
},
onRecover: function(e) {
console.log(e);
var t = JSON.parse(e);
"Grab" === t.Stage ? this.handleGrabTurnInfo(t.GrabTurnInfo) : "PlayCard" === t.Stage && this.handlePlayCardInfo(t.PlayCardInfo);
},
recoverPlayCardInfo: function(e) {
this.playerMyself.setHandPokers(e.SelfRemainIndex);
for (var t = 0; t < e.OtherremainIndex.length; t++) {
this.getPlayerByPos(e.OtherremainIndex[t].Id).setHandPokers(e.OtherremainIndex[t].RemainIndex);
}
},
onRecoverOrNot: function(e) {
console.log(e);
var t = JSON.parse(e);
if (5 === t.SeatStatus) {
this.playerInfo.needFastjoin = !1;
this.operatePanel.startGame();
this.onAllotTable(t.TableInfo);
for (var n = 0; n < this.players.length; n++) {
this.players[n].hideReady();
}
t.DealFlag && this.handleStartInfo(t.DealInfo, !0);
t.GrabSignFlag && this.handleStartPlayCardInfo(t.GrabResultInfo);
t.PlayCardFlag && this.recoverPlayCardInfo(t.PlayInfo);
cc.dgame.net.sendMsg([ "Recover", "" ], this.onRecover.bind(this));
} else this.operatePanel.showStart();
},
onLoad: function() {
this.playerInfo = {};
this.playerInfo.needFastjoin = !0;
this.initConfigs();
this.initWidget();
this.addPokers();
cc.dgame.net.sendMsg([ "RecoverOrNot", "" ], this.onRecoverOrNot.bind(this));
},
onDestroy: function() {
this.listener.removeListener(this.listener.EVENTSTRINGS.PLAYER_READY, this);
this.listener.removeListener(this.listener.EVENTSTRINGS.DEAL_POKERS, this);
this.listener.removeListener(this.listener.EVENTSTRINGS.DECIDE_DIZHU_CALL_BACK, this);
this.listener.removeListener(this.listener.EVENTSTRINGS.GAME_OVER_CALL_BACK, this);
this.listener.removeListener(this.listener.EVENTSTRINGS.NEW_GAME_CALL_BACK, this);
this.listener.removeListener(this.listener.EVENTSTRINGS.RE_DEAL_CALL_BACK, this);
this.listener.removeListener(this.listener.EVENTSTRINGS.PLAYER_CALLDIZHU_OPERATE, this);
this.listener.removeListener(this.listener.EVENTSTRINGS.PLAYER_ROBDIZHU_OPERATE, this);
this.listener.removeListener(this.listener.EVENTSTRINGS.PLAYER_CALLOUTCARD_OPERATE, this);
this.listener.removeListener(this.listener.EVENTSTRINGS.PLAYER_REMIND, this);
this.listener.removeListener(this.listener.EVENTSTRINGS.HIDE_OPERATE_PANEL, this);
this.unschedule(this.waitForStart);
},
initConfigs: function() {
this.listener = e("eventlistener");
this.listener.init();
this.rule = e("pokerrule");
this.rule.init();
this.strings = e("string_zh");
this.enums = e("serverutils");
this.initServerListener();
this.initClientListener();
},
initServerListener: function() {
var e = this;
this.listener.registerListener(this.listener.EVENTSTRINGS.PLAYER_READY, function() {
if (e.playerInfo.needFastjoin) {
e.playerInfo.needFastjoin = !1;
cc.dgame.net.addEventListener([ "allotTable", 0 ], e.onAllotTable.bind(e));
cc.dgame.net.sendMsg([ "fastjoin", "" ], e.onFastJoin.bind(e));
e.waitCount = 0;
e.schedule(e.waitForStart, .5);
} else cc.dgame.net.sendMsg([ "ready", "" ], e.onSelfReady.bind(e));
}, this);
this.listener.registerListener(this.listener.EVENTSTRINGS.ALL_PLAYERS_READY, function() {}, this);
this.listener.registerListener(this.listener.EVENTSTRINGS.DEAL_POKERS, function(t) {
e.dealPokerHandler(t, !1);
}, this);
this.listener.registerListener(this.listener.EVENTSTRINGS.DECIDE_DIZHU_CALL_BACK, function(t) {
e.decideDiZhuCallback(t);
}, this);
this.listener.registerListener(this.listener.EVENTSTRINGS.GAME_OVER_CALL_BACK, function(t) {
e.remindLabel.string = e.strings.GAME_OVER;
for (var n = 0; n < e.players.length; n++) {
var i = e.getPlayerByPos(n);
if (n === t.winner) {
e.playerInfo[n].amount = e.playerInfo[n].amount + t.base * t.multiple;
i.isDiZhu && (e.playerInfo[n].amount = e.playerInfo[n].amount + t.base * t.multiple);
} else {
e.playerInfo[n].amount = e.playerInfo[n].amount - t.base * t.multiple;
i.isDiZhu && (e.playerInfo[n].amount = e.playerInfo[n].amount - t.base * t.multiple);
}
i.setStakeNum(e.playerInfo[n].amount);
}
var s = "";
if ((i = e.getPlayerByPos(t.winner)).isDiZhu) {
!0;
s = "地主 +" + 2 * t.base * t.multiple + ", 农民 -" + t.base * t.multiple;
} else s = "地主 -" + 2 * t.base * t.multiple + ", 农民 +" + t.base * t.multiple;
e.getComponent("AudioMng").stopMusic();
e.playerMyself.isDiZhu && i.isDiZhu || !e.playerMyself.isDiZhu && !i.isDiZhu ? e.getComponent("AudioMng").playWin() : e.getComponent("AudioMng").playLose();
e.gameOverPanel.setActive(i.isDiZhu ? "地主" : "农民", s, function() {
cc.log("游戏结束");
e.gameMultiple.string = "0";
e.newGameHandle();
});
}, this);
this.listener.registerListener(this.listener.EVENTSTRINGS.NEW_GAME_CALL_BACK, function(t) {
cc.log("新游戏开始");
e.newGameCallback(t);
}, this);
this.listener.registerListener(this.listener.EVENTSTRINGS.RE_DEAL_CALL_BACK, function(t) {
e.scheduleOnce(e.newGameHandle, 1);
}, this);
},
initClientListener: function() {
var e = this;
this.listener.registerListener(this.listener.EVENTSTRINGS.PLAYER_CALLDIZHU_OPERATE, function(t) {
e.operatePanel.showCallPanel();
e.callCountDown.setActive(30, function() {
e.operatePanel.noCallDiZhuClicked();
});
}, this);
this.listener.registerListener(this.listener.EVENTSTRINGS.PLAYER_ROBDIZHU_OPERATE, function(t) {
e.operatePanel.showRob();
e.robCountDown.setActive(30, function() {
e.operatePanel.noRob();
});
}, this);
this.listener.registerListener(this.listener.EVENTSTRINGS.PLAYER_CALLOUTCARD_OPERATE, function(t) {
e.playerMyself.hideRemind();
if (2 == t) {
e.operatePanel.showOnlyOut();
e.outCountDown.setActive(30, function() {
e.playerMyself.disposeHandPokers();
e.playerMyself.handPoker[e.playerMyself.handPoker.length - 1].isSelected = !0;
e.operatePanel.outCard();
});
} else {
e.operatePanel.showOut();
e.followCountDown.setActive(30, function() {
e.operatePanel.noOut();
});
}
}, this);
this.listener.registerListener(this.listener.EVENTSTRINGS.PLAYER_REMIND, function(t) {
e.remindLabel.string = t;
e.scheduleOnce(function() {
e.remindLabel.string = "";
}, 3);
}, this);
this.listener.registerListener(this.listener.EVENTSTRINGS.HIDE_OPERATE_PANEL, function(t) {
e.operatePanel.hideOutPanel();
e.followCountDown.setDisable();
e.outCountDown.setDisable();
}, this);
},
initWidget: function() {
var e = this;
this.operatePanel.setStartCallback(function() {
var t = {};
t.index = e.playerMyself.index;
t.state = e.enums.READY;
e.listener.broadcastListener(e.listener.EVENTSTRINGS.PLAYER_READY, t);
});
this.operatePanel.setCallCallback(function() {
var t = {
ID: cc.dgame.gameplay.seatId,
OP: 1
};
cc.dgame.net.sendMsg([ "Grab", JSON.stringify(t) ], e.onCallRobDizhu.bind(e));
e.callCountDown.setDisable();
}, function() {
var t = {
ID: cc.dgame.gameplay.seatId,
OP: 0
};
cc.dgame.net.sendMsg([ "Grab", JSON.stringify(t) ], e.onCallRobDizhu.bind(e));
e.callCountDown.setDisable();
});
this.operatePanel.setRobCallback(function() {
var t = {
ID: cc.dgame.gameplay.seatId,
OP: 1
};
cc.dgame.net.sendMsg([ "Grab", JSON.stringify(t) ], e.onCallRobDizhu.bind(e));
e.robCountDown.setDisable();
}, function() {
var t = {
ID: cc.dgame.gameplay.seatId,
OP: 0
};
cc.dgame.net.sendMsg([ "Grab", JSON.stringify(t) ], e.onCallRobDizhu.bind(e));
e.robCountDown.setDisable();
});
this.operatePanel.setOutCallback(function() {
e.playerMyself.playerOutCard();
}, function() {
e.playerMyself.noOutCard();
});
this.callCountDownNode = cc.instantiate(this.countDownPrefab);
this.callCountDownNode.x = 0;
this.callCountDownNode.y = 0;
this.uiLayer.addChild(this.callCountDownNode);
this.callCountDown = this.callCountDownNode.getComponent("countdown");
this.callCountDown.setDisable();
this.robCountDownNode = cc.instantiate(this.countDownPrefab);
this.robCountDownNode.x = 0;
this.robCountDownNode.y = 0;
this.uiLayer.addChild(this.robCountDownNode);
this.robCountDown = this.robCountDownNode.getComponent("countdown");
this.robCountDown.setDisable();
this.followCountDownNode = cc.instantiate(this.countDownPrefab);
this.followCountDownNode.x = 0;
this.followCountDownNode.y = 0;
this.uiLayer.addChild(this.followCountDownNode);
this.followCountDown = this.followCountDownNode.getComponent("countdown");
this.followCountDown.setDisable();
this.outCountDownNode = cc.instantiate(this.countDownPrefab);
this.outCountDownNode.x = 0;
this.outCountDownNode.y = 0;
this.uiLayer.addChild(this.outCountDownNode);
this.outCountDown = this.outCountDownNode.getComponent("countdown");
this.outCountDown.setDisable();
this.playerUpCountDownNode = cc.instantiate(this.countDownPrefab);
this.playerUpCountDownNode.x = -300;
this.playerUpCountDownNode.y = 200;
this.uiLayer.addChild(this.playerUpCountDownNode);
this.playerUpCountDown = this.playerUpCountDownNode.getComponent("countdown");
this.playerUpCountDown.setDisable();
this.playerDownCountDownNode = cc.instantiate(this.countDownPrefab);
this.playerDownCountDownNode.x = 300;
this.playerDownCountDownNode.y = 200;
this.uiLayer.addChild(this.playerDownCountDownNode);
this.playerDownCountDown = this.playerDownCountDownNode.getComponent("countdown");
this.playerDownCountDown.setDisable();
},
getPlayerByPos: function(e) {
if (e < 0 || e > 2) return null;
switch (cc.dgame.gameplay.seatId) {
case 0:
return 0 === e ? this.playerMyself : 1 === e ? this.playerDown : this.playerUp;

case 1:
return 0 === e ? this.playerUp : 1 === e ? this.playerMyself : this.playerDown;

case 2:
return 0 === e ? this.playerDown : 1 === e ? this.playerUp : this.playerMyself;
}
return null;
},
dealPokerHandler: function(e, t) {
cc.log(JSON.stringify(e));
if (t) {
for (s = 0; s < 17; s++) for (var n = 0; n < 3; n++) {
var i = e.Pokers[n];
if (0 == n) {
this.pokers[i[s]].setValue(cc.dgame.gameplay.Pokers[i[s]]);
this.pokers[i[s]].reveal(!0);
this.playerMyself.pickUpOne(this.pokers[i[s]]);
} else if (1 == n) {
this.pokers[i[s]].reveal(!1);
this.playerDown.pickUpOne(this.pokers[i[s]]);
} else {
this.pokers[i[s]].reveal(!1);
this.playerUp.pickUpOne(this.pokers[i[s]]);
}
}
this.pokers[e.Pokers[3][0]].reveal(!1);
this.pokers[e.Pokers[3][1]].reveal(!1);
this.pokers[e.Pokers[3][2]].reveal(!1);
this.pokers[e.Pokers[3][0]].node.x -= 100;
this.pokers[e.Pokers[3][2]].node.x += 100;
} else {
var s = 0, a = this;
this.getComponent("AudioMng").playCard();
this.schedule(function() {
for (var t = 0; t < 3; t++) {
var n = e.Pokers[t];
if (0 == t) {
a.pokers[n[s]].setValue(cc.dgame.gameplay.Pokers[n[s]]);
a.pokers[n[s]].reveal(!0);
a.playerMyself.pickUpOne(a.pokers[n[s]]);
} else if (1 == t) {
a.pokers[n[s]].reveal(!1);
a.playerDown.pickUpOne(a.pokers[n[s]]);
} else {
a.pokers[n[s]].reveal(!1);
a.playerUp.pickUpOne(a.pokers[n[s]]);
}
}
if (16 == s) {
a.pokers[e.Pokers[3][0]].reveal(!1);
a.pokers[e.Pokers[3][1]].reveal(!1);
a.pokers[e.Pokers[3][2]].reveal(!1);
a.pokers[e.Pokers[3][0]].node.x -= 100;
a.pokers[e.Pokers[3][2]].node.x += 100;
if (cc.dgame.gameplay.seatId === e.Turn) {
a.operatePanel.showCallPanel();
a.callCountDown.setActive(30, function() {
a.operatePanel.noCallDiZhuClicked();
});
} else {
a.getPlayerByPos(e.Turn) === a.playerUp ? a.playerUpCountDown.setActive(30, function() {
a.playerUpCountDown.setDisable();
}) : a.playerDownCountDown.setActive(30, function() {
a.playerDownCountDown.setDisable();
});
}
a.printPokerInfo();
}
s++;
}, .22, 16);
}
},
decideDiZhuCallback: function(e) {
for (var t = 0; t < e.dizhuPoker.length; t++) {
this.pokers[e.dizhuPoker[t]].reveal(!0);
}
var n = this;
this.scheduleOnce(function() {
for (var t = 0; t < n.players.length; t++) {
var i = n.players[t];
if (i.index == e.index) {
i.setIsDiZhu(!0);
for (var s = 0; s < e.dizhuPoker.length; s++) {
i.isSelf || n.pokers[e.dizhuPoker[s]].reveal(!1);
i.pickUpOne(n.pokers[e.dizhuPoker[s]]);
}
i.setPokerAble();
} else i.setIsDiZhu(!1);
i.hideRemind();
}
}, 1);
},
newGameCallback: function(e) {
for (var t = 0; t < this.players.length; t++) {
var n = this.players[t];
n.clearHandPokers();
n.setIsDiZhu(!1);
}
this.remindLabel.string = "";
this.getComponent("AudioMng").playNormal();
},
addPokers: function() {
for (var e = 0; e < 54; e++) {
(n = (t = cc.instantiate(this.pokerPrefab)).getComponent("poker")).setIndex(e);
n.setValue(54);
t.x = 0;
t.y = 250;
n.reveal(!1);
this.table.addChild(t);
this.pokers.push(n);
}
for (e = 0; e < 3; e++) {
var t, n;
(n = (t = cc.instantiate(this.pokerPrefab)).getComponent("poker")).setIndex(e);
n.setValue(54);
t.setScale(.8);
t.x = 0;
t.y = 250;
n.reveal(!1);
n.node.active = !1;
this.table.addChild(t);
this.landlordPokers.push(n);
}
this.landlordPokers[0].node.x -= 60;
this.landlordPokers[2].node.x += 60;
},
newGameHandle: function() {
for (var e = 0; e < this.pokers.length; e++) {
(t = this.pokers[e]).setIndex(e);
t.setValue(54);
t.node.active = !0;
t.node.x = 0;
t.node.y = 250;
t.scale = 1;
t.reveal(!1);
}
for (e = 0; e < 3; e++) {
var t;
(t = this.landlordPokers[e]).setIndex(e);
t.setValue(54);
t.reveal(!1);
t.node.active = !1;
}
for (e = 0; e < this.players.length; e++) {
var n = this.players[e];
n.clearHandPokers();
n.setIsDiZhu(!1);
}
this.remindLabel.string = "";
this.operatePanel.hideOutPanel();
this.operatePanel.robPanel.active = !1;
this.operatePanel.showStart();
this.getComponent("AudioMng").playMusic();
},
onLeaveTable: function(e) {
null !== this.playerInfo && (this.playerInfo.needFastjoin = !0);
var t = parseInt(cc.dgame.gameplay.tableid);
if (!isNaN(t)) {
cc.dgame.net.removeEventListener([ "leave" ]);
cc.dgame.net.removeEventListener([ "ready" ]);
cc.dgame.net.removeEventListener([ "startGame" ]);
cc.dgame.net.removeEventListener([ "gameEvent" ]);
cc.dgame.net.removeEventListener([ "settle" ]);
cc.dgame.net.removeEventListener([ "allotTable" ]);
cc.dgame.gameplay.tableid = "";
}
cc.director.loadScene("gamehall");
},
backToMenu: function() {
cc.dgame.net.sendMsg([ "leave", "" ], this.onLeaveTable.bind(this));
},
waitForStart: function() {
0 === this.waitCount && (this.remindLabel.string = this.strings.WAITING_FOR_START);
this.remindLabel.string += ".";
this.waitCount++;
5 == this.waitCount && (this.waitCount = 0);
},
onFastJoin: function(e) {
cc.log(JSON.stringify(e));
},
onAllotTable: function(e) {
cc.log(JSON.stringify(e));
cc.dgame.gameplay.tableid = e.TableID;
var t = cc.find("Canvas/tablelayer/tablebg/tableid").getComponent(cc.Label);
t.string = cc.dgame.gameplay.tableid;
t.node.active = !0;
var n = parseInt(cc.dgame.gameplay.tableid);
cc.dgame.net.addEventListener([ "leave", n ], this.onLeave.bind(this));
cc.dgame.net.addEventListener([ "ready", n ], this.onReady.bind(this));
cc.dgame.net.addEventListener([ "startGame", n ], this.onStartGame.bind(this));
cc.dgame.net.addEventListener([ "gameEvent", n ], this.onGameEvent.bind(this));
cc.dgame.net.addEventListener([ "settle", n ], this.onSettle.bind(this));
this.onPlayersInfo(e.Players);
},
onPlayersInfo: function(e) {
for (var t = 0; t < e.length; t++) {
var n = e[t].Pos;
this.playerInfo[n] = {};
this.playerInfo[n].playerAddr = e[t].PlayerAddr;
this.playerInfo[n].amount = e[t].Amount;
if (e[t].PlayerAddr.toLowerCase() === cc.dgame.gameplay.selfaddr) {
cc.dgame.gameplay.seatId = n;
cc.dgame.gameplay.Multiple = 0;
this.playerMyself.setPlayerAddr(e[t].PlayerAddr);
this.playerMyself.setStakeNum(e[t].Amount);
cc.dgame.net.sendMsg([ "ready", "" ], this.onSelfReady.bind(this));
}
}
switch (cc.dgame.gameplay.seatId) {
case 0:
this.playerMyself.index = 0;
this.playerDown.index = 1;
this.playerUp.index = 2;
this.playerUp.setPlayerAddr(this.playerInfo[2].playerAddr);
this.playerUp.setStakeNum(this.playerInfo[2].amount);
this.playerDown.setPlayerAddr(this.playerInfo[1].playerAddr);
this.playerDown.setStakeNum(this.playerInfo[1].amount);
break;

case 1:
this.playerMyself.index = 1;
this.playerDown.index = 2;
this.playerUp.index = 0;
this.playerUp.setPlayerAddr(this.playerInfo[0].playerAddr);
this.playerUp.setStakeNum(this.playerInfo[0].amount);
this.playerDown.setPlayerAddr(this.playerInfo[2].playerAddr);
this.playerDown.setStakeNum(this.playerInfo[2].amount);
break;

case 2:
this.playerMyself.index = 2;
this.playerDown.index = 0;
this.playerUp.index = 1;
this.playerUp.setPlayerAddr(this.playerInfo[1].playerAddr);
this.playerUp.setStakeNum(this.playerInfo[1].amount);
this.playerDown.setPlayerAddr(this.playerInfo[0].playerAddr);
this.playerDown.setStakeNum(this.playerInfo[0].amount);
}
},
onSelfReady: function(e) {
cc.log(e);
this.playerInfo[cc.dgame.gameplay.seatId].ready = !0;
this.playerMyself.setReady();
},
onLeave: function(e) {
cc.log(e);
this.playerInfo.needFastjoin = !0;
var t = parseInt(cc.dgame.gameplay.tableid);
if (!isNaN(t)) {
cc.dgame.net.removeEventListener([ "leave" ]);
cc.dgame.net.removeEventListener([ "ready" ]);
cc.dgame.net.removeEventListener([ "startGame" ]);
cc.dgame.net.removeEventListener([ "gameEvent" ]);
cc.dgame.net.removeEventListener([ "settle" ]);
cc.dgame.net.removeEventListener([ "allotTable" ]);
}
for (var n = 0; n < this.players.length; n++) {
var i = this.players[n];
i.setPlayerAddr("");
i.hideStake();
this.playerInfo[n] = {};
}
cc.dgame.gameplay.tableid = "";
var s = cc.find("Canvas/tablelayer/tablebg/tableid").getComponent(cc.Label);
s.string = cc.dgame.gameplay.tableid;
s.node.active = !1;
this.unschedule(this.waitForStart);
this.waitCount = 0;
this.operatePanel.showStart();
},
onReady: function(e) {
cc.log(e);
this.playerInfo[e.Pos].ready = !0;
this.getPlayerByPos(e.Pos).setReady();
},
onStartGame: function(e) {
cc.log(e);
},
handleStartInfo: function(e, t) {
for (var n = 0; n < this.players.length; n++) {
this.players[n].hideReady();
}
this.getComponent("AudioMng").playNormal();
this.remindLabel.string = "";
this.waitCount = 0;
this.unschedule(this.waitForStart);
var i = {};
i.Turn = e.Turn;
cc.dgame.gameplay.Pokers = new Array();
var s = new Array(), a = new Array(), o = new Array();
for (n = 0; n < 54; n++) {
cc.dgame.gameplay.Pokers[n] = void 0;
n < 17 ? s.push(n) : n < 34 ? a.push(n) : n < 51 && o.push(n);
}
for (n = 0; n < e.SelfCard.privateIndex.length; n++) cc.dgame.gameplay.Pokers[e.SelfCard.privateIndex[n]] = e.SelfCard.privateCard[n];
var r = new Array();
if (0 === e.SelfCard.privateIndex[0]) {
r.push(s);
r.push(a);
r.push(o);
} else if (17 === e.SelfCard.privateIndex[0]) {
r.push(a);
r.push(o);
r.push(s);
} else {
r.push(o);
r.push(s);
r.push(a);
}
var c = new Array();
c.push(e.DeskCard.publicIndex[0]);
c.push(e.DeskCard.publicIndex[1]);
c.push(e.DeskCard.publicIndex[2]);
r.push(c);
i.Pokers = r;
this.dealPokerHandler(i, t);
},
handleGrabTurnInfo: function(e) {
var t = this.getPlayerByPos(e.Grab.ID);
t === this.playerUp ? this.playerUpCountDown.setDisable() : t === this.playerDown && this.playerDownCountDown.setDisable();
if (null !== t) {
t.remindLabel.node.active = !0;
e.Multiple < 2 ? t.remindLabel.string = 1 == e.Grab.OP ? this.strings.CALL_DIZHU : this.strings.NO_CALL : t.remindLabel.string = 1 == e.Grab.OP ? this.strings.ROB_DIZHU : this.strings.NO_ROB;
}
cc.dgame.gameplay.Multiple = e.Multiple;
this.gameMultiple.string = e.Multiple;
var n = this.getPlayerByPos(e.CurnSeat);
if (n === this.playerUp) {
var i = this;
this.playerUpCountDown.setActive(30, function() {
i.playerUpCountDown.setDisable();
});
} else if (n === this.playerDown) {
i = this;
this.playerDownCountDown.setActive(30, function() {
i.playerDownCountDown.setDisable();
});
}
if (e.IsMyTurn) {
i = this;
if (0 === e.CurnOPName) {
this.operatePanel.showCallPanel();
this.callCountDown.setActive(30, function() {
i.operatePanel.noCallDiZhuClicked();
});
} else {
this.operatePanel.showRob();
this.robCountDown.setActive(30, function() {
i.operatePanel.noRob();
});
}
}
},
handleStartPlayCardInfo: function(e) {
this.playerUpCountDown.setDisable();
this.playerDownCountDown.setDisable();
cc.dgame.gameplay.Multiple = e.FinalMultiple;
cc.dgame.gameplay.LandlordSeat = e.LandlordSeat;
for (var t = 0; t < e.DeskCard.publicIndex.length; t++) {
cc.dgame.gameplay.Pokers[e.DeskCard.publicIndex[t]] = e.DeskCard.publicCard[t];
this.pokers[e.DeskCard.publicIndex[t]].setValue(e.DeskCard.publicCard[t]);
this.pokers[e.DeskCard.publicIndex[t]].reveal(!0);
this.landlordPokers[t].setValue(e.DeskCard.publicCard[t]);
}
cc.log(new Date().toLocaleString() + " 显示最后三张牌");
var n = this;
this.scheduleOnce(function() {
for (var t = 0; t < n.players.length; t++) {
var i = n.players[t];
if (i.index === cc.dgame.gameplay.LandlordSeat) {
i.setIsDiZhu(!0);
for (var s = 0; s < e.DeskCard.publicIndex.length; s++) {
i.isSelf || n.pokers[e.DeskCard.publicIndex[s]].reveal(!1);
i.pickUpOne(n.pokers[e.DeskCard.publicIndex[s]]);
n.landlordPokers[s].reveal(!0);
n.landlordPokers[s].node.active = !0;
}
cc.log(new Date().toLocaleString() + " 地主拿走最后三张牌");
i.setPokerAble();
} else i.setIsDiZhu(!1);
i.hideRemind();
}
}, 1);
},
handlePlayCardInfo: function(e) {
this.printTurnInfo(e);
this.gameMultiple.string = e.CurrentMultiple;
if (null !== e.CurrentPlay.Seat && void 0 !== e.CurrentPlay.Seat && e.CurrentPlay.Seat !== cc.dgame.gameplay.seatId) {
for (var t = 0; t < e.CurrentPlay.Index.length; t++) {
cc.dgame.gameplay.Pokers[e.CurrentPlay.Index[t]] = e.CurrentPlay.Card[t];
this.pokers[e.CurrentPlay.Index[t]].setValue(e.CurrentPlay.Card[t]);
this.pokers[e.CurrentPlay.Index[t]].reveal(!0);
}
var n = this.getPlayerByPos(e.CurrentPlay.Seat);
n === this.playerUp ? this.playerUpCountDown.setDisable() : n === this.playerDown && this.playerDownCountDown.setDisable();
n.showOutCard(e.CurrentPlay);
}
if (e.IsMyTurn) {
this.playerMyself.hideRemind();
this.listener.broadcastListener(this.listener.EVENTSTRINGS.READY_PLAY_A_HAND_CALL_BACK, e);
} else if (-1 !== e.NextTurn) {
var i = this.getPlayerByPos(e.NextTurn);
i.clearTablePokers();
if (i === this.playerUp) {
var s = this;
this.playerUp.hideRemind();
this.playerUpCountDown.setActive(30, function() {
s.playerUpCountDown.setDisable();
});
} else if (i === this.playerDown) {
s = this;
this.playerDown.hideRemind();
this.playerDownCountDown.setActive(30, function() {
s.playerDownCountDown.setDisable();
});
}
}
},
handleGameOverInfo: function(e) {
for (var t = 0; t < e.RemainCard.length; t++) {
var n = this.getPlayerByPos(e.RemainCard[t].Seat);
cc.log("before getHandPokers(" + e.RemainCard[t].Seat + "): " + n.getHandPokers());
for (var i = 0; i < e.RemainCard[t].Index.length; i++) {
cc.dgame.gameplay.Pokers[e.RemainCard[t].Index[i]] = e.RemainCard[t].Card[i];
this.pokers[e.RemainCard[t].Index[i]].setValue(e.RemainCard[t].Card[i]);
}
cc.log("after getHandPokers(" + e.RemainCard[t].Seat + "): " + n.getHandPokers());
n.hideDizhuMark();
if (n !== this.playerMyself) {
n.resortHandPokers(e.RemainCard[t].Card, e.RemainCard[t].Index);
n.revealHandPokers();
}
}
for (t = 0; t < this.players.length; t++) {
(n = this.players[t]) !== this.playerMyself && n.hideCardsNum();
n.hideRemind();
}
this.printPokerInfo();
this.overData = {};
this.overData.winner = e.Win;
this.overData.base = e.Base;
this.overData.multiple = e.Multiple;
},
handleReshuffleInfo: function() {
for (var e = 0; e < this.pokers.length; e++) {
var t = this.pokers[e];
t.setIndex(e);
t.setValue(54);
t.node.active = !0;
t.node.x = 0;
t.node.y = 250;
t.scale = 1;
t.reveal(!1);
}
this.callCountDown.setDisable();
this.robCountDown.setDisable();
this.playerUpCountDown.setDisable();
this.playerDownCountDown.setDisable();
for (e = 0; e < this.players.length; e++) {
var n = this.players[e];
n.clearHandPokers();
n.setIsDiZhu(!1);
n.hideRemind();
}
this.remindLabel.string = "";
},
onGameEvent: function(e) {
cc.log(e);
"StartInfo" === e.Event ? this.handleStartInfo(e.Params, !1) : "GrabTurnInfo" === e.Event ? this.handleGrabTurnInfo(e.Params) : "StartPlayCardInfo" === e.Event ? this.handleStartPlayCardInfo(e.Params) : "PlayCardInfo" === e.Event ? this.handlePlayCardInfo(e.Params) : "GameOverInfo" === e.Event ? this.handleGameOverInfo(e.Params) : "ReshuffleInfo" === e.Event && this.handleReshuffleInfo();
},
onSettle: function(e) {
cc.log(e);
this.listener.broadcastListener(this.listener.EVENTSTRINGS.GAME_OVER_CALL_BACK, this.overData);
},
onCallRobDizhu: function(e) {
cc.log(e);
},
printTurnInfo: function(e) {
if (null !== e.CurrentPlay.Seat && void 0 !== e.CurrentPlay.Seat) {
var t = this.getPlayerByPos(e.CurrentPlay.Seat);
cc.log(new Date().toLocaleString() + " 上轮 " + (t === this.playerMyself ? "我" : t === this.playerUp ? "上家" : "下家") + " 出牌 " + JSON.stringify(e.CurrentPlay.Card));
}
if (-1 !== e.NextTurn) {
t = this.getPlayerByPos(e.NextTurn);
cc.log(new Date().toLocaleString() + " 本轮轮到 " + (t === this.playerMyself ? "我" : t === this.playerUp ? "上家" : "下家") + " 出牌");
} else cc.log(new Date().toLocaleString());
},
printPokerInfo: function() {
for (var e = new Array(), t = 0; t < this.pokers.length; t++) e.push(this.pokers[t].getInfo());
cc.log(e);
e = new Array();
for (t = 0; t < cc.dgame.gameplay.Pokers.length; t++) e.push(cc.dgame.gameplay.Pokers[t]);
cc.log(e);
}
});
cc._RF.pop();
}, {
countdown: "countdown",
eventlistener: "eventlistener",
gameoverpanel: "gameoverpanel",
operatepanel: "operatepanel",
player: "player",
poker: "poker",
pokerrule: "pokerrule",
serverutils: "serverutils",
string_zh: "string_zh"
} ]
}, {}, [ "LanguageData", "LocalizedLabel", "LocalizedSprite", "SpriteFrameSet", "polyglot.min", "eventlistener", "player", "poker", "Net", "NetConfig", "NetControl", "onfire", "serverutils", "gamehall", "splash", "tablectrl", "eventutils", "pokerrule", "pokerutils", "string_zh", "accountItem", "accountList", "createAccount", "exchange", "loginAccount", "loginMnemonic", "AudioMng", "countdown", "gameoverpanel", "operatepanel" ]);