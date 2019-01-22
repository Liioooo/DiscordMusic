import { Component, OnInit } from '@angular/core';
import {AudioService} from '../../services/audio/audio.service';

@Component({
  selector: 'app-song-adder',
  templateUrl: './song-adder.component.html',
  styleUrls: ['./song-adder.component.scss']
})
export class SongAdderComponent {

  public youtubeLink = '';
  public youtubeLinkError = false;

  constructor(private audioService: AudioService) { }

  public youtubeLinkHasValue(): boolean {
    return this.youtubeLink !== '';
  }

  public youTubeInputChanged() {
    if (!this.youtubeLinkHasValue()) {
      this.youtubeLinkError = false;
    }
  }

  public addYoutube() {
      this.youtubeLinkError = !this.audioService.addSongYouTube({
        type: 'yt',
        path: this.youtubeLink
    });
    if (!this.youtubeLinkError)  {
      this.youtubeLink = '';
    }
  }

  public addFile() {
    document.getElementById('addSongFileInput').click();
  }

  public fileInInputChanged(event: any) {
      const files: FileList = event.target.files;

      if (files.length === 0) { return; }
      for (let i = 0; i < files.length; i++) {
          this.audioService.addSongFile({
              type: 'file',
              path: files[i].path
          });
      }
  }

}
