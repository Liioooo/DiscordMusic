import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {HomeComponent} from '../components/home/home.component';

@Injectable({
  providedIn: 'root'
})
export class BackToLoginGuard implements CanDeactivate<HomeComponent> {

    canDeactivate(component: HomeComponent, currentRoute: ActivatedRouteSnapshot,
                  currentState: RouterStateSnapshot,
                  nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return false;
    }

}
