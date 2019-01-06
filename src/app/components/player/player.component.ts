import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  public currentSongName = 'Song Name is to long xd hahahhahhaha';

  constructor() { }

  ngOnInit() {
  }

}
