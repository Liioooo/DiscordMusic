import {ApplicationRef, Injectable} from '@angular/core';
import {Snowflake, VoiceChannel} from 'discord.js';
import {IpcService} from '../ipc/ipc.service';

@Injectable({
  providedIn: 'root'
})
export class DiscordService {

    public currentChannel: Snowflake = null;

    constructor(private appRef: ApplicationRef, private ipcService: IpcService) {}

    public login(token: string): Promise<string> {
        this.ipcService.botMoved.subscribe((newChannel: Snowflake) => {
            this.currentChannel = newChannel;
            this.appRef.tick();
        });
        return this.ipcService.sendIPC('login', {
              token: token
        });
    }

    public getChannels(): Promise<Array<VoiceChannel>> {
        return this.ipcService.sendIPC('getChannels', {});
    }

    public joinChannel(channel: VoiceChannel): Promise<Snowflake> {
        return this.ipcService.sendIPC('joinChannel', {
            channel: channel
        });
    }
}
