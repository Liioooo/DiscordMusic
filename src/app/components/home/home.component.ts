import { Component, OnInit } from '@angular/core';
import {DiscordService} from '../../services/discord/discord.service';
import { VoiceChannel} from 'discord.js';
import {from, Observable, Subscription, timer} from 'rxjs';
import {AudioService} from '../../services/audio/audio.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public channels: Observable<Array<VoiceChannel>>;

  public joinError: string;
  public showingJoinError = false;
  private showJoinErrorTimer: Observable<number>;

  constructor(private discordService: DiscordService, public audioService: AudioService) { }

  ngOnInit() {
      this.channels = from(this.discordService.getChannels());
  }

  public joinChannel(channel: VoiceChannel) {
      this.discordService.joinChannel(channel)
        .catch(err => {
          this.joinError = 'Unable to join!';
          this.showingJoinError = true;
          this.showJoinErrorTimer = timer(6000);
          this.showJoinErrorTimer.subscribe(() => this.showingJoinError = false);
        });
  }

  public leaveChannel() {
      this.discordService.leaveChannel();
  }

}
