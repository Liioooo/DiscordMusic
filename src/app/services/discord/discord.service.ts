import {ApplicationRef, Injectable} from '@angular/core';
import {Snowflake, VoiceChannel} from 'discord.js';
import {IpcService} from '../ipc/ipc.service';

@Injectable({
  providedIn: 'root'
})
export class DiscordService {

    public currentChannel: Snowflake = null;

    constructor(private appRef: ApplicationRef, private ipcService: IpcService) {}

    public get currentlyInChannel(): boolean {
        return this.currentChannel !== null;
    }

    public login(token: string): Promise<string> {
        this.ipcService.botMoved.subscribe((newChannel: Snowflake) => {
            this.currentChannel = newChannel;
            this.appRef.tick();
        });
        return this.ipcService.sendIPCwithResponse('login', {
              token: token
        });
    }

    public getChannels(): Promise<Array<VoiceChannel>> {
        return this.ipcService.sendIPCwithResponse('getChannels', {});
    }

    public joinChannel(channel: VoiceChannel): Promise<Snowflake> {
        return this.ipcService.sendIPCwithResponse('joinChannel', {
            channel: channel
        });
    }

    public leaveChannel() {
        this.ipcService.sendIPC('leaveChannel', {});
    }

    public disconnect() {
        this.ipcService.sendIPC('disconnect', {});
    }
}
