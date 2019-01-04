import * as Discord from 'discord.js';
import {Channel, Client, VoiceChannel, VoiceConnection} from 'discord.js';
import { ipcMain, WebContents } from 'electron';
import {reject} from 'q';

export class DiscordManager {

    private client: Client;
    private voiceConnection: VoiceConnection;

    constructor(private webContents: WebContents) {
        this.client = new Discord.Client();
        this.registerListeners();
    }

    private registerListeners() {
        ipcMain.on('login', (event, data) => this.returnResult('loginResponse', this.login(data['token'])));
        ipcMain.on('getChannels', (event, data) => this.returnResult('getChannelsResponse', this.getChannels()));
        ipcMain.on('joinChannel', (event, data) => this.returnResult('joinChannelResponse', this.joinChannel(data['channel'])));
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

    private login(token: string): Promise<string> {
        return this.client.login(token);
    }

    private getChannels(): Promise<any> {
        return new Promise<any>(resolve => {
            const channels = this.client.channels
                .map((value: Channel) => value)
                .filter((channel: Channel) => channel.type === 'voice')
                .map(channel => channel as VoiceChannel);
            resolve(channels);
        });
    }

    private joinChannel(channel: VoiceChannel): Promise<any> {
        return new Promise<any>(resolve => {
            const vc = this.client.channels.get(channel.id) as VoiceChannel;
            vc.join().then((con: VoiceConnection) => {
                this.voiceConnection = con;
                resolve();
            }).catch(err => reject(err));
        });
    }

}
