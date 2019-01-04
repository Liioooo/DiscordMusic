import { Component, OnInit } from '@angular/core';
import {DiscordService} from '../../services/discord.service';
import {Snowflake, VoiceChannel} from 'discord.js';
import {from, Observable, timer} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public channels: Observable<Array<VoiceChannel>>;
  public currentChannel: Snowflake;

  public joinError: string;
  public showingJoinError = false;
  private showJoinErrorTimer: Observable<number>;

  constructor(private discordService: DiscordService) { }

  ngOnInit() {
    this.channels = from(this.discordService.getChannels());
  }

  public joinChannel(channel: VoiceChannel) {
    this.discordService.joinChannel(channel)
        .then(id => this.currentChannel = id)
        .catch(err => {
          this.joinError = 'Unable to join!';
          this.showingJoinError = true;
          this.showJoinErrorTimer = timer(6000);
          this.showJoinErrorTimer.subscribe(() => this.showingJoinError = false);
        });
  }

}
