import { Component, OnInit } from '@angular/core';
import {AudioService} from '../../services/audio/audio.service';

@Component({
  selector: 'app-song-adder',
  templateUrl: './song-adder.component.html',
  styleUrls: ['./song-adder.component.scss']
})
export class SongAdderComponent implements OnInit {

  public youtubeLink = '';
  public youtubeLinkError = false;

  constructor(private audioService: AudioService) { }

  ngOnInit() {
  }

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
      const file: File = event.target.files[0];
      if (!file) { return; }
      this.audioService.addSongFile({
          type: 'file',
          path: file.path
      });
  }

}
