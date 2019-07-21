import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { environment } from 'src/environments/environment';
export interface INavElement {
  link: string;
  display: string;
  state: string
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
      state: 'none'
    }
    ,
    {
      link: 'resource-owners',
      display: 'Resource owner dashboard',
      state: 'none'
    }
    ,
    {
      link: 'security-profiles',
      display: 'Security Profile dashboard',
      state: 'none'
    }
    ,
    {
      link: 'client',
      display: 'Create Client',
      state: 'create'
    }
    ,
    {
      link: 'resource-owner',
      display: 'Update password',
      state: 'update:pwd'
    },
    {
      link: 'security-profile',
      display: 'Add Security Profile',
      state: 'create'
    },
    {
      link: '/login',
      display: 'Logout',
      state: 'none'
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
  toGitHub(){
    window.open(environment.home,'_blank')
  }
}
