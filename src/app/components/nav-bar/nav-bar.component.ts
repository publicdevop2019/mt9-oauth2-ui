import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MediaMatcher, BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { environment } from 'src/environments/environment';
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DeviceService } from 'src/app/services/device.service';
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
  menuAuth: INavElement[] = [
    {
      link: 'clients',
      display: 'CLIENT_DASHBOARD',
      icon: 'apps',
      params: {
      },
    },
    {
      link: 'security-profiles',
      display: 'SECURITY_PROFILE_DASHBOARD',
      icon: 'security',
      params: {
      },
    },
  ];
  menuUser: INavElement[] = [
    {
      link: 'resource-owners',
      display: 'RESOURCE_OWNER_DASHBOARD',
      icon: 'perm_identity',
      params: {
      },
    },
  ];
  menuMisc: INavElement[] = [
    {
      link: 'updatePwd',
      display: 'UPDATE_PASSWORD',
      icon: 'vpn_key',
      params: {
      },
    },
    {
      link: 'settings',
      display: 'SYSTEM_SETTINGS',
      icon: 'settings',
      params: {
      },
    },
    {
      link: '/login',
      display: 'LOGOUT',
      icon: 'exit_to_app',
      params: {

      },
    }
  ];
  menuMall: INavElement[] = [
    {
      link: 'products',
      display: 'PRODUCT_DASHBOARD',
      icon: 'storefront',
      params: {
      },
    },
    {
      link: 'catalogs',
      display: 'CATEGORY_DASHBOARD',
      icon: 'category',
      params: {
        type: 'frontend'
      },
    },
    {
      link: 'catalogs',
      display: 'CATEGORY_ADMIN_DASHBOARD',
      icon: 'store',
      params: {
        type: 'backend'
      },
    },
    {
      link: 'attributes',
      display: 'ATTRIBUTE_DASHBOARD',
      icon: 'subject',
      params: {
      },
    },
    {
      link: 'filters',
      display: 'FILTER_DASHBOARD',
      icon: 'filter_list',
      params: {
      },
    },
    {
      link: 'orders',
      display: 'ORDER_DASHBOARD',
      icon: 'assignment',
      params: {
      },
    },
  ];
  menuBbs: INavElement[] = [
    {
      link: 'posts',
      display: 'POSTS',
      icon: 'post_add',
      params: {

      },
    },
    {
      link: 'comments',
      display: 'COMMENTS',
      icon: 'mode_comment',
      params: {

      },
    },
    {
      link: 'reports',
      display: 'REPORTS',
      icon: 'block',
      params: {

      },
    },
    {
      link: 'likess',
      display: 'LIKES',
      icon: 'thumb_up',
      params: {

      },
    },
    {
      link: 'dislikes',
      display: 'DISLIKES',
      icon: 'thumb_down',
      params: {
        state: 'create',
      },
    },
    {
      link: 'notInterested',
      display: 'NOT_INTERESTED',
      icon: 'label_off',
      params: {

      },
    },

  ];
  menuOpt: INavElement[] =[
    {
      link: 'operation-history',
      display: 'OPERATION_DASHBOARD_AUTH',
      icon: 'edit',
      params: {
        type:'auth'
      },
    },
    {
      link: 'operation-history',
      display: 'OPERATION_DASHBOARD_PROXY',
      icon: 'edit',
      params: {
        type:'proxy'
      },
    },
    {
      link: 'operation-history',
      display: 'OPERATION_DASHBOARD_PRODUCT',
      icon: 'edit',
      params: {
        type:'product'
      },
    },
  ]
  private _mobileQueryListener: () => void;
  @ViewChild("snav", { static: true }) snav: MatSidenav;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public route: ActivatedRoute, public router: Router, public translate: TranslateService,public deviceSvc:DeviceService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  openedHandler(panelName: string) {
    localStorage.setItem(panelName, 'true')
  }
  closedHander(panelName: string) {
    localStorage.setItem(panelName, 'false')
  }
  navExpand(panelName: string) {
    return localStorage.getItem(panelName) === 'true'
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
  }
  
}
