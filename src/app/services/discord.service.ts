import { Injectable } from '@angular/core';
import {VoiceChannel} from 'discord.js';
import {ElectronService} from 'ngx-electron';
import {IPCResponse} from '../models/IPCResponse';

@Injectable({
  providedIn: 'root'
})
export class DiscordService {


  constructor(private electronService: ElectronService) {}

  public login(token: string): Promise<string> {
      return this.sendIPC('login', {
            token: token
      });
  }

  public getChannels(): Promise<Array<VoiceChannel>> {
      return new Promise<Array<VoiceChannel>>(resolve => {
          this.sendIPC('getChannels', {}).then((data) => {
              resolve(data);
          });
      });
  }

  public joinChannel(channel: VoiceChannel): Promise<any> {
      return this.sendIPC('joinChannel', {
          channel: channel
      });
  }

  private sendIPC(command: string, data: any): Promise<any> {
      return new Promise<any>((resolve, reject) => {
          this.electronService.ipcRenderer.send(command, data);
          this.electronService.ipcRenderer.once(`${command}Response`, (event, dataResponse: IPCResponse) => {
              if (dataResponse.result === 'res') {
                  resolve(dataResponse.data);
              } else {
                  reject(dataResponse.data);
              }
          });
      });
  }
}
