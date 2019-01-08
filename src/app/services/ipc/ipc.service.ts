import { Injectable } from '@angular/core';
import {IPCResponse} from '../../models/IPCResponse';
import {ElectronService} from 'ngx-electron';
import {Observable, Subject} from 'rxjs';
import {Snowflake} from 'discord.js';

@Injectable({
  providedIn: 'root'
})
export class IpcService {

    private _botMovedSubject: Subject<Snowflake>;
    private _songEndedSubject: Subject<any>;

    constructor(private electronService: ElectronService) { }

    public sendIPCwithResponse(command: string, data: any): Promise<any> {
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

    public sendIPC(command: string, data: any) {
        this.electronService.ipcRenderer.send(command, data);
    }

    public get botMoved(): Observable<Snowflake> {
        this._botMovedSubject = new Subject<Snowflake>();
        this.electronService.ipcRenderer.on('botMoved', (event, response) => {
            this._botMovedSubject.next(response['channel'].id);
        });
        return this._botMovedSubject.asObservable();
    }

    public get songEnded(): Observable<any> {
        this._songEndedSubject = new Subject<any>();
        this.electronService.ipcRenderer.on('songEnded', () => this._songEndedSubject.next());
        return this._songEndedSubject.asObservable();
    }

}
