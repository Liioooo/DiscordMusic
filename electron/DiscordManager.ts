import * as Discord from 'discord.js';
import {Channel, Client, Snowflake, VoiceChannel} from 'discord.js';
import { ipcMain, WebContents } from 'electron';
import {VoiceManager} from './VoiceManager';

export class DiscordManager {

    private client: Client;
    private voiceManager: VoiceManager;
    private currentChannel: VoiceChannel;

    constructor(private webContents: WebContents) {
        this.client = new Discord.Client();
        this.registerListeners();
    }

    private registerListeners() {
        ipcMain.on('login', (event, data) => this.returnResult('loginResponse', this.login(data['token'])));
        ipcMain.on('getChannels', () => this.returnResult('getChannelsResponse', this.getChannels()));
        ipcMain.on('joinChannel', (event, data) => this.returnResult('joinChannelResponse', this.joinChannel(data['channel'])));
        ipcMain.on('leaveChannel', () => this.leaveChannel());
    }

    private returnResult(responseName: string, promise: Promise<any>) {
        promise.then(data => {
            this.webContents.send(responseName, {
                result: 'res',
                data: data
            });
        }).catch(error => {
            this.webContents.send(responseName, {
                result: 'rej',
                data: error
            });
        });
    }

    private listenForClientMoved() {
        this.client.on('voiceStateUpdate', (oldMember, newMember) => {
           if (newMember.user.id === this.client.user.id && newMember.voiceChannel) {
               this.voiceManager.voiceConnection = newMember.voiceChannel.connection;
               this.webContents.send('botMoved', {
                   channel: newMember.voiceChannel
               });
           }
        });
    }

    private login(token: string): Promise<string> {
        this.listenForClientMoved();
        this.voiceManager = new VoiceManager(this.webContents);
        return this.client.login(token);
    }

    public disconnect() {
        this.client.destroy();
    }

    private getChannels(): Promise<any> {
        return Promise.resolve(
            this.client.channels
            .map((value: Channel) => value)
            .filter((channel: Channel) => channel.type === 'voice')
            .map(channel => channel as VoiceChannel)
        );
    }

    private async joinChannel(channel: VoiceChannel): Promise<Snowflake> {
            const vc = this.client.channels.get(channel.id) as VoiceChannel;
            this.currentChannel = vc;
            this.voiceManager.voiceConnection = await vc.join();
            return vc.id;
    }

    private leaveChannel() {
        if (this.currentChannel) {
            this.voiceManager.disconnectVoice();
            this.currentChannel.leave();
            delete this.currentChannel;
        }
    }

}
