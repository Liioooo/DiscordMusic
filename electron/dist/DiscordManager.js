"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Discord = require("discord.js");
var electron_1 = require("electron");
var DiscordManager = /** @class */ (function () {
    function DiscordManager(webContents) {
        this.webContents = webContents;
        this.client = new Discord.Client();
        this.registerListeners();
    }
    DiscordManager.prototype.registerListeners = function () {
        var _this = this;
        electron_1.ipcMain.on('login', function (event, data) { return _this.returnResult('loginResponse', _this.login(data['token'])); });
        electron_1.ipcMain.on('getChannels', function (event, data) { return _this.returnResult('getChannelsResponse', _this.getChannels()); });
        electron_1.ipcMain.on('joinChannel', function (event, data) { return _this.returnResult('joinChannelResponse', _this.joinChannel(data['channel'])); });
    };
    DiscordManager.prototype.returnResult = function (responseName, promise) {
        var _this = this;
        promise.then(function (data) {
            _this.webContents.send(responseName, {
                result: 'res',
                data: data
            });
        }).catch(function (error) {
            _this.webContents.send(responseName, {
                result: 'rej',
                data: error
            });
        });
    };
    DiscordManager.prototype.login = function (token) {
        return this.client.login(token);
    };
    DiscordManager.prototype.getChannels = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var channels = _this.client.channels
                .map(function (value) { return value; })
                .filter(function (channel) { return channel.type === 'voice'; })
                .map(function (channel) { return channel; });
            resolve(channels);
        });
    };
    DiscordManager.prototype.joinChannel = function (channel) {
        console.log(channel);
        var vc = this.client.channels.get(channel.id);
        return vc.join();
    };
    return DiscordManager;
}());
exports.DiscordManager = DiscordManager;
//# sourceMappingURL=DiscordManager.js.map