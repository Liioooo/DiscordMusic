import {ApplicationRef, Injectable, OnDestroy} from '@angular/core';
import {Song} from '../../models/Song';
import {getBasicInfo, validateURL, videoInfo} from 'ytdl-core';
import {IpcService} from '../ipc/ipc.service';
import {DiscordService} from '../discord/discord.service';
import {Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService implements OnDestroy {

  private _songQueue = <Song[]>[];
  private _currentQueuePos = 0;
  private _playState = false;
  private _startedPlayingCurrentSong = false;

  private _songEndedSubscription: Subscription;
  private _leftChannelSubscription: Subscription;

  constructor(private ipcService: IpcService, private discordService: DiscordService, private appRef: ApplicationRef) {
      this._songEndedSubscription = this.ipcService.songEnded.subscribe(() => {
          if (this._currentQueuePos < this._songQueue.length - 1) {
              this.next(false);
          } else {
              this._playState = false;
              this._startedPlayingCurrentSong = false;
          }
          appRef.tick();
      });
      this._leftChannelSubscription = this.discordService.leftChannel.subscribe(() => {
          this._playState = false;
          this._startedPlayingCurrentSong = false;
      });
  }

  ngOnDestroy(): void {
      this._leftChannelSubscription.unsubscribe();
      this._songEndedSubscription.unsubscribe();
  }

  public get songQueue(): Song[] {
      return this._songQueue;
  }

  public get currentQueuePos(): number {
      return this._currentQueuePos;
  }

  public get playState(): boolean {
      return this._playState;
  }

  public checkYouTubeURL(url: string) {
    return validateURL(url);
  }

  public setVolume(volume: number) {
      this.ipcService.sendIPC('setVolume', {volume});
  }

  public moveUp(id: number) {
      const oldUpper = this._songQueue[id - 1];
      this._songQueue[id - 1] = this._songQueue[id];
      this._songQueue[id] = oldUpper;
  }

  public moveDown(id: number) {
      const oldLower = this._songQueue[id + 1];
      this._songQueue[id + 1] = this._songQueue[id];
      this._songQueue[id] = oldLower;
  }

  public remove(id: number) {
      this._songQueue = this._songQueue.filter((value, index) => index !== id);
  }

  public back() {
      if (this._currentQueuePos > 0) {
          this._currentQueuePos--;
          this._startedPlayingCurrentSong = false;
          if (this._playState) {
              this._startedPlayingCurrentSong = true;
              this.playSong(this._songQueue[this.currentQueuePos]);
          }
      }
  }

  // true=click, false=songEnded
  public next(source: boolean) {
      if (this._currentQueuePos < this._songQueue.length - 1) {
          this._currentQueuePos++;
          this._startedPlayingCurrentSong = false;
          if (this._playState) {
              this._startedPlayingCurrentSong = true;
              this.playSong(this._songQueue[this.currentQueuePos]);
          }
      } else if (!source) {
          this._playState = false;
      }
  }

  public playPause() {
        if (this._songQueue.length === 0 || this.discordService.currentChannel === null) {return; }
        if (this._playState) {
            this.ipcService.sendIPC('pause', {});
            this._playState = false;
            return;
        }
        if (this._startedPlayingCurrentSong) {
            this.ipcService.sendIPC('resume', {});
            this._playState = true;
        } else {
            this.playSong(this._songQueue[this.currentQueuePos]);
            this._playState = true;
            this._startedPlayingCurrentSong = true;
        }
  }

  private playSong(song: Song) {
      if (song.type === 'file') {
            this.ipcService.sendIPC('playFile', {path: song.path});
      } else {
          this.ipcService.sendIPC('playYT', {path: song.path});
      }
  }

  public addSongYouTube(song: Song): boolean {
      if (this.checkYouTubeURL(song.path)) {
          song.name = 'Loading...';
          const newItem = this._songQueue.push(song) - 1;
          this.getSongName(song).then(name => {
              this._songQueue[newItem].name = name;
        });
        return true;
      }
      return false;
  }

  public addSongFile(song: Song) {
      this.getSongName(song).then(name => {
          song.name = name;
          this._songQueue.push(song);
      });
  }

  private getSongName(song: Song): Promise<string> {
      if (song.type === 'file') {
        return Promise.resolve(song.path.substring(song.path.lastIndexOf('\\') + 1, song.path.lastIndexOf('.')));
      } else {
        return new Promise<string>(resolve => {
            getBasicInfo(song.path).then((info: videoInfo) => {
              resolve(info.title);
            });
        });
      }
  }
}
