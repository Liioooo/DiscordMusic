import { Injectable } from '@angular/core';
import * as Discord from 'discord.js';
import {Channel, Client, VoiceChannel} from 'discord.js';

@Injectable({
  providedIn: 'root'
})
export class DiscordService {

  private client: Client;

  constructor() {}

  public login(token: string): Promise<string> {
      this.client = new Discord.Client();
      return this.client.login(token);
  }

  public getChannels(): Array<Channel> {
      return this.client.channels
          .map((value: Channel) => value)
          .filter((channel: Channel) => channel.type === 'voice');
  }

  public joinChannel(channel: Channel) {
      console.log(typeof window);
      const voiceChannel = channel as VoiceChannel;
      voiceChannel.join();
  }
}
