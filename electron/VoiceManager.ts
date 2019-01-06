import {StreamDispatcher, VoiceConnection} from 'discord.js';
import * as ytdl from 'ytdl-core';

export class VoiceManager {

    private connection: VoiceConnection;
    private voiceDispatcher: StreamDispatcher;

    constructor() {}

    public set voiceConnection(vc: VoiceConnection) {
        this.connection = vc;
    }

    public playFile(path: string) {
        this.pause();
        this.voiceDispatcher = this.connection.playFile(path);
        this.resume();
    }

    public playYouTube(url: string) {
        this.pause();
        this.voiceDispatcher = this.connection.playStream(ytdl(url, {filter: 'audioonly'}));
        this.resume();
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
}
