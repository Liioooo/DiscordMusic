import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenSaveService {

  private fs;
  private  tokenJsonPath = 'bot-info.json';

  constructor() {
    this.fs = require('fs');
  }

  public readToken(): Promise<string> {
      return new Promise<string>((resolve => {
          if (!this.fs.existsSync(process.cwd() + '\\' + this.tokenJsonPath)) {
            resolve('');
            return;
          }
          const file = this.fs.readFileSync(process.cwd() + '\\' + this.tokenJsonPath);
          const json = JSON.parse(file);
          if (!json.hasOwnProperty('token')) {
            resolve('');
            return;
          }
          resolve(json.token);
      }));
  }

  public saveToken(token: string): Promise<void> {
    return new Promise<void>((resolve => {
        const json = JSON.stringify({token});
        console.log(process.cwd() + '\\' + this.tokenJsonPath);
        this.fs.writeFileSync(process.cwd() + '\\' + this.tokenJsonPath, json);
        resolve();
    }));
  }
}
