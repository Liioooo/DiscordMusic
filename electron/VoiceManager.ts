import {StreamDispatcher, VoiceConnection} from 'discord.js';
import * as ytdl from 'ytdl-core';
import {WebContents, ipcMain} from 'electron';

export class VoiceManager {

    private connection: VoiceConnection;
    private voiceDispatcher: StreamDispatcher;
    private currentVolume = 0.25;

    constructor(private webContents: WebContents) {
        ipcMain.on('playYT', (event, data) => this.playYouTube(data['path']));
        ipcMain.on('playFile', (event, data) => this.playFile(data['path']));
        ipcMain.on('resume', () => this.resume());
        ipcMain.on('pause', () => this.pause());
        ipcMain.on('setVolume', (event, data) => this.setVolume(data['volume']));
    }

    public set voiceConnection(vc: VoiceConnection) {
        this.connection = vc;
    }

    public disconnectVoice() {
        if (this.connection) {
            this.connection.disconnect();
        }
    }

    public playFile(path: string) {
        console.log('play', path);
        this.voiceDispatcher = this.connection.play(path, {volume: this.currentVolume});
        this.appendEndEvent();
    }

    public playYouTube(url: string) {
        console.log('play', url);
        this.voiceDispatcher = this.connection.play(ytdl(url, {filter: 'audioonly'}));
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

    public setVolume(volume: number) {
        this.currentVolume = volume;
        if (this.voiceDispatcher) {
            this.voiceDispatcher.setVolume(volume);
        }
    }

    private appendEndEvent() {
        this.voiceDispatcher.on('finish', () => this.webContents.send('songEnded'));
    }
}
