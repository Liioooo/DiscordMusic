import { Component, OnInit } from '@angular/core';
import {AudioService} from '../../services/audio/audio.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  public volumeValue: number;

  constructor(public audioService: AudioService) { }

  ngOnInit() {
  }

  public back() {
      this.audioService.back();
  }

  public next() {
      this.audioService.next(true);
  }

  public playPause() {
    this.audioService.playPause();
  }

  public volumeChanged() {
    this.audioService.setVolume(this.volumeValue);
  }

}
