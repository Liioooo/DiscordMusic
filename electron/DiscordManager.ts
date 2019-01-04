import * as Discord from 'discord.js';
import {Channel, Client, Snowflake, VoiceChannel, VoiceConnection} from 'discord.js';
import { ipcMain, WebContents } from 'electron';

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
        return Promise.resolve(
            this.client.channels
            .map((value: Channel) => value)
            .filter((channel: Channel) => channel.type === 'voice')
            .map(channel => channel as VoiceChannel)
        );
    }

    private async joinChannel(channel: VoiceChannel): Promise<Snowflake> {
            const vc = this.client.channels.get(channel.id) as VoiceChannel;
            this.voiceConnection = await vc.join();
            return vc.id;
    }

}
