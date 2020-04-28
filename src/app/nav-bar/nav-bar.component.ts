import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MediaMatcher, BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { environment } from 'src/environments/environment';
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { Subscription } from 'rxjs';
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
    },
    {
      link: 'products',
      display: 'Product Dashboard',
      icon: 'storefront',
      params: {
        state: 'none',
      },
    },
    {
      link: 'categories',
      display: 'Category Dashboard',
      icon: 'category',
      params: {
        state: 'none',
      },
    },
    {
      link: 'orders',
      display: 'Order Dashboard',
      icon: 'assignment',
      params: {
        state: 'none',
      },
    },
    {
      link: 'client',
      display: 'Add Client',
      icon: 'add',
      params: {
        state: 'create',
      },
    },
    {
      link: 'security-profile',
      display: 'Add Security Profile',
      icon: 'add',
      params: {
        state: 'create',
      },
    },
    {
      link: 'product',
      display: 'Add Product',
      icon: 'add',
      params: {
        state: 'create',
      },
    },
    {
      link: 'category',
      display: 'Add Category',
      icon: 'add',
      params: {
        state: 'create',
      },
    },
    {
      link: 'resource-owner',
      display: 'Update Password',
      icon: 'vpn_key',
      params: {
        state: 'update:pwd',
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
  private sub: Subscription;
  @ViewChild("snav", { static: true }) snav: MatSidenav;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public route: ActivatedRoute, public router: Router, private breakpointObserver: BreakpointObserver) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.sub = this.breakpointObserver.observe([Breakpoints.Large,
    Breakpoints.XLarge,]).subscribe(next => {
      if (next.breakpoints[Breakpoints.Large] || next.breakpoints[Breakpoints.XLarge]) {
        this.snav.open()
      }
      else {
        console.warn('unknown device width match!')
      }
    })
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.sub.unsubscribe();
  }

  ngOnInit() {
  }
  toGitHub() {
    window.open(environment.home, '_blank')
  }
}
