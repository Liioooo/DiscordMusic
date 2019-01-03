import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Channel} from 'discord.js';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

  @Input()
  public channel: Channel;

  @Output()
  public clickedOnChannel = new EventEmitter<Channel>();

  constructor() { }

  ngOnInit() {
  }

  public handleClick() {
    this.clickedOnChannel.emit(this.channel);
  }

}
