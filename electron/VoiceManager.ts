import {StreamDispatcher, VoiceConnection} from 'discord.js';
import * as ytdl from 'ytdl-core';
import {WebContents, ipcMain} from 'electron';

export class VoiceManager {

    private connection: VoiceConnection;
    private voiceDispatcher: StreamDispatcher;

    constructor(private webContents: WebContents) {
        ipcMain.on('playYT', (event, data) => this.playYouTube(data['path']));
        ipcMain.on('playFile', (event, data) => this.playFile(data['path']));
        ipcMain.on('resume', () => this.resume());
        ipcMain.on('pause', () => this.pause());
    }

    public set voiceConnection(vc: VoiceConnection) {
        this.connection = vc;
    }

    public playFile(path: string) {
        console.log('play start');
        this.voiceDispatcher = this.connection.playFile(path);
        console.log('playing');
        this.appendEndEvent();
    }

    public playYouTube(url: string) {
        this.voiceDispatcher = this.connection.playStream(ytdl(url, {filter: 'audioonly'}));
        this.appendEndEvent();
    }

    public get isPlaying(): boolean {
        return (this.voiceDispatcher && !this.voiceDispatcher.paused);
    }

    public pause() {
        if (this.isPlaying) {
           this.voiceDispatcher.pause();
        }
    }

    public resume() {
        if (!this.isPlaying) {
            this.voiceDispatcher.resume();
        }
    }

    private appendEndEvent() {
        this.voiceDispatcher.on('end', () => this.webContents.send('songIsOver'));
    }
}
