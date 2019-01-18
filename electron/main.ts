import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
import {DiscordManager} from './DiscordManager';

let win: BrowserWindow, serve, discordMan: DiscordManager;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {
  win = new BrowserWindow({
      width: 800,
      height: 600,
      minHeight: 440,
      minWidth: 600,
      frame: false
  });

  if (serve) {
      require('electron-reload')(__dirname, {
          electron: require(path.join(__dirname, `../../node_modules/electron`))
      });
      win.webContents.openDevTools();
      win.loadURL('http://localhost:4200');
  } else {
      win.loadURL(url.format({
        pathname: path.join(__dirname, '../../dist/index.html'),
        protocol: 'file:',
        slashes: true
      }));
  }

  discordMan = new DiscordManager(win.webContents);
  process.env.FFMPEG_PATH = './node_modules/ffmpeg-binaries/bin/ffmpeg.exe';

  win.on('closed', () => {
      win = null;
  });

}

try {
  app.on('ready', createWindow);

  app.on('window-all-closed', () => {
      discordMan.disconnect();
      if (process.platform !== 'darwin') {
        app.quit();
      }
  });

  app.on('activate', () => {
      if (win === null) {
        createWindow();
      }
  });

} catch (e) {}
