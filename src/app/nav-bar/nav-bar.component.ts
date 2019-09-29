import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { environment } from 'src/environments/environment';
export interface INavElement {
  link: string;
  display: string;
  params: any
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  mobileQuery: MediaQueryList;
  fillerNav: INavElement[] = [
    {
      link: 'clients',
      display: 'Client dashboard',
      params: {
        state: 'none',
        pageId: 0
      },
    }
    ,
    {
      link: 'resource-owners',
      display: 'Resource owner dashboard',
      params: {
        state: 'none',
        pageId: 0
      },
    }
    ,
    {
      link: 'security-profiles',
      display: 'Security Profile dashboard',
      params: {
        state: 'none',
        pageId: 0
      },
    }
    ,
    {
      link: 'client',
      display: 'Create Client',
      params: {
        state: 'create',
      },
    }
    ,
    {
      link: 'resource-owner',
      display: 'Update password',
      params: {
        state: 'update:pwd',
      },
    },
    {
      link: 'security-profile',
      display: 'Add Security Profile',
      params: {
        state: 'create',
      },
    },
    {
      link: '/login',
      display: 'Logout',
      params: {
        state: 'none',
      },
    }
  ];
  private _mobileQueryListener: () => void;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
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
}
