import { Component, OnInit } from '@angular/core';
import {DiscordService} from '../../services/discord.service';
import {Channel} from 'discord.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public channels: Array<Channel>;

  constructor(private discordService: DiscordService) { }

  ngOnInit() {
    this.channels = this.discordService.getChannels();
    console.log(this.channels);
  }

  public joinChannel(channel: Channel) {
    this.discordService.joinChannel(channel);
  }

}
