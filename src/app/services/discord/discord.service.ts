import {ApplicationRef, Injectable} from '@angular/core';
import {Snowflake, VoiceChannel} from 'discord.js';
import {IpcService} from '../ipc/ipc.service';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscordService {

    public currentChannel: Snowflake = null;
    private _leftChannelSubject = new Subject<void>();

    constructor(private appRef: ApplicationRef, private ipcService: IpcService) {}

    public login(token: string): Promise<string> {
        this.ipcService.botMoved.subscribe((newChannel: Snowflake) => {
            console.log('kaslska');
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
        this.currentChannel = null;
        this._leftChannelSubject.next();
    }

    public get leftChannel(): Observable<void> {
        return this._leftChannelSubject.asObservable();
    }
}
