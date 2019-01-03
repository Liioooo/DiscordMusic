import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {BackToLoginGuard} from './guards/back-to-login.guard';

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent, canDeactivate: [BackToLoginGuard] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
