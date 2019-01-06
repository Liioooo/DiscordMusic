import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Channel, Snowflake} from 'discord.js';
import {DiscordService} from '../../services/discord/discord.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

    @Input()
    public channel: Channel;

    @Output()
    public clickedOnChannel = new EventEmitter<any>();

    constructor(public discordService: DiscordService) { }

    ngOnInit() {
    }

    public handleClick() {
      this.clickedOnChannel.emit();
    }

}
