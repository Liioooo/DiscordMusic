import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ElectronService} from 'ngx-electron';
import {DiscordService} from '../../services/discord/discord.service';
import {Router} from '@angular/router';
import {TokenSaveService} from '../../services/token-save/token-save.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public loginForm: FormGroup;
    public loginFormSubmitted = false;

    constructor(private formBuilder: FormBuilder, private electronService: ElectronService, private discordService: DiscordService, private router: Router, private tokenSave: TokenSaveService) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            clientID: [''],
            token: ['', Validators.required],
            rememberToken: ['']
        });
        this.tokenSave.readToken().then(token => this.loginForm.controls.token.setValue(token));
    }

    public loginFormSubmit() {
        this.loginFormSubmitted = true;

        if (this.loginForm.invalid) {
            return;
        }


        const token = this.loginForm.controls.token.value;
        this.discordService.login(token).then(() => {
            if (this.loginForm.controls.rememberToken.value === true) {
                this.saveToken(token);
            }
            this.router.navigate(['/home']);
        }).catch(() => {
            this.loginForm.controls.token.setErrors({invalid: true});
        });

    }

    public clientIDHasValue(): boolean {
        return this.loginForm.controls.clientID.value;
    }

    public openBotAuthSite() {
        const clientID = this.loginForm.controls.clientID.value;
        this.electronService.shell.openExternal(`https://discordapp.com/oauth2/authorize?client_id=${clientID}&scope=bot&permissions=70466624`);
    }

    public howToClicked() {
        this.electronService.shell.openExternal('https://github.com/Liiioooo/DiscordMusic/wiki/Creating-a-discord-bot-&-adding-it-to-a-server');
    }

    private saveToken(token: string) {
        this.tokenSave.saveToken(token);
    }

}
