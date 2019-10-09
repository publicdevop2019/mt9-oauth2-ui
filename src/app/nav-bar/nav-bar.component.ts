import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { environment } from 'src/environments/environment';
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';
export interface INavElement {
  link: string;
  icon?: string;
  display: string;
  params: any
}
export const NAV_LIST: { [index: string]: string } = {
  'clients': ''
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  menuOpen: boolean = false;
  mobileQuery: MediaQueryList;
  fillerNav: INavElement[] = [
    {
      link: 'clients',
      display: 'Client Dashboard',
      icon: 'apps',
      params: {
        state: 'none',
      },
    }
    ,
    {
      link: 'resource-owners',
      display: 'Resource Owner Dashboard',
      icon: 'perm_identity',
      params: {
        state: 'none',
      },
    }
    ,
    {
      link: 'security-profiles',
      display: 'Security Profile Dashboard',
      icon: 'security',
      params: {
        state: 'none',
      },
    }
    ,
    {
      link: 'client',
      display: 'Create Client',
      icon: 'create',
      params: {
        state: 'create',
      },
    }
    ,
    {
      link: 'resource-owner',
      display: 'Update Password',
      icon: 'vpn_key',
      params: {
        state: 'update:pwd',
      },
    },
    {
      link: 'security-profile',
      display: 'Add Security Profile',
      icon: 'brush',
      params: {
        state: 'create',
      },
    },
    {
      link: '/login',
      display: 'Logout',
      icon: 'exit_to_app',
      params: {
        state: 'none',
      },
    }
  ];
  private _mobileQueryListener: () => void;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public route: ActivatedRoute, public router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
  }
  toGitHub() {
    window.open(environment.home, '_blank')
  }
  getPageHeader() {
    const url: string = this.router.routerState.snapshot.url;
    const nav: INavElement = this.fillerNav.find(el => el.link === url.substring(url.lastIndexOf('/') + 1, url.indexOf('?') > -1 ? url.indexOf('?') : undefined));
    return nav ? nav.display : undefined;
  }
}
