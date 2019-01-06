import { Injectable } from '@angular/core';
import {Song} from '../../models/Song';
import {getBasicInfo, validateURL, videoInfo} from 'ytdl-core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private _songQueue = <Song[]>[];

  constructor() { }

  public get songQueue() {
      return this._songQueue;
  }

  public checkYouTubeURL(url: string) {
    return validateURL(url);
  }

  public addSongYouTube(song: Song): boolean {
      if (this.checkYouTubeURL(song.path)) {
        this.getSongName(song).then(name => {
            song.name = name;
            this._songQueue.push(song);
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
