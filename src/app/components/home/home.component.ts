import { Component, OnInit } from '@angular/core';
import {DiscordService} from '../../services/discord.service';
import { VoiceChannel} from 'discord.js';
import {from, Observable} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public channels: Observable<Array<VoiceChannel>>;

  constructor(private discordService: DiscordService) { }

  ngOnInit() {
    this.channels = from(this.discordService.getChannels());
  }

  public joinChannel(channel: VoiceChannel) {
    this.discordService.joinChannel(channel).catch(err => console.log('can not join!'));
  }

}
