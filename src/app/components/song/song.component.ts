import {Component, Input, OnInit} from '@angular/core';
import {Song} from '../../models/Song';
import {DiscordService} from '../../services/discord/discord.service';
import {AudioService} from '../../services/audio/audio.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit {

    @Input()
    public song: Song;

    @Input()
    public queuePosition: number;

    constructor(private audioService: AudioService) { }

    ngOnInit() {
    }

    public isLast(): boolean {
      return this.queuePosition === this.audioService.songQueue.length - 1;
    }

    public isFirst() {
        return this.queuePosition === this.audioService.currentQueuePos + 1;
    }

    public moveUp() {
        this.audioService.moveUp(this.queuePosition);
    }

    public moveDow() {
        this.audioService.moveDown(this.queuePosition);
    }

    public remove() {
        this.audioService.remove(this.queuePosition);
    }

}
