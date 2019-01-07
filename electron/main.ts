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
      minHeight: 400,
      minWidth: 600,
      frame: false
  });

  if (serve) {
      require('electron-reload')(__dirname, {
          electron: require(path.join(__dirname, `../../node_modules/electron`))
      });
      win.loadURL('http://localhost:4200');
      win.webContents.openDevTools();
  } else {
      win.loadURL(url.format({
        pathname: path.join(__dirname, '../../dist/index.html'),
        protocol: 'file:',
        slashes: true
      }));
  }

  discordMan = new DiscordManager(win.webContents);

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