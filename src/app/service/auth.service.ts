import { Injectable } from '@angular/core';
import { Router, CanActivateChild, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpProxyService } from './http-proxy.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivateChild, CanActivate {
  constructor(private router: Router, private httpProxy: HttpProxyService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.defaultCanActivate()
  }
  canActivateChild(): boolean {
    return this.defaultCanActivate()
  }
  private defaultCanActivate(): boolean {
    if (this.httpProxy.netImpl.currentUserAuthInfo === undefined || this.httpProxy.netImpl.currentUserAuthInfo === null) {
      sessionStorage.getItem('jwt')
      console.dir(window.sessionStorage.getItem('jwt'));
      console.dir(window.localStorage.getItem('jwt'));
      console.error('no authentication found! redirect to login page')
      this.router.navigateByUrl('/login');
      return false;
    } else {
      return true;
    }

  }
}
