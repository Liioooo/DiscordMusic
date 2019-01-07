import { Injectable } from '@angular/core';
import {Song} from '../../models/Song';
import {getBasicInfo, validateURL, videoInfo} from 'ytdl-core';
import {IpcService} from '../ipc/ipc.service';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private _songQueue = <Song[]>[];
  private _currentQueuePos = 0;
  private _playState = false;

  constructor(private ipcService: IpcService) { }

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
      }
  }

  public next() {
      if (this._currentQueuePos < this._songQueue.length - 1) {
          this._currentQueuePos++;
      }
  }

  public playPause() {

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
