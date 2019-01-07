import {Component, Input, OnInit} from '@angular/core';
import {Song} from '../../models/Song';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit {

  @Input()
  public song: Song

  constructor() { }

  ngOnInit() {
  }

}
