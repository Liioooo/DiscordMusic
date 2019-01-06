import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import {NgxElectronModule} from 'ngx-electron';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ChannelComponent } from './components/channel/channel.component';
import { SongComponent } from './components/song/song.component';
import { PlayerComponent } from './components/player/player.component';
import { SongAdderComponent } from './components/song-adder/song-adder.component';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  declarations: [
      AppComponent,
      LoginComponent,
      HomeComponent,
      ChannelComponent,
      SongComponent,
      PlayerComponent,
      SongAdderComponent,
      TruncatePipe
  ],
  imports: [
      BrowserModule,
      FormsModule,
      HttpClientModule,
      AppRoutingModule,
      NgxElectronModule,
      ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
