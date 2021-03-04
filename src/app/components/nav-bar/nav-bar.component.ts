import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { logout } from 'src/app/clazz/utility';
import { DeviceService } from 'src/app/services/device.service';
import { MessageService } from 'src/app/services/message.service';
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
  msgDetails: boolean = false;
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
    {
      link: 'revoke-token',
      display: 'REVOKE_TOKEN_DASHBOARD',
      icon: 'stars',
      params: {
      },
    },
    {
      link: 'cache-mngr',
      display: 'CACHE_DASHBOARD',
      icon: 'cached',
      params: {
      },
    },
    {
      link: 'message-center',
      display: 'MESSAGE_DASHBOARD',
      icon: 'message',
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
      link: 'skus',
      display: 'SKU_DASHBOARD',
      icon: 'storage',
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
    {
      link: 'tasks',
      display: 'TASK_DASHBOARD',
      icon: 'import_contacts',
      params: {
      },
    },
    {
      link: 'mall-message-center',
      display: 'MALL_MSG_DASHBOARD',
      icon: 'message',
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
      display: 'OPERATION_DASHBOARD_CLIENT',
      icon: 'apps',
      params: {
        type:'auth',
        entity:'client'
      },
    },
    {
      link: 'operation-history',
      display: 'OPERATION_DASHBOARD_USER',
      icon: 'perm_identity',
      params: {
        type:'auth',
        entity:'user'
      },
    },
    {
      link: 'operation-history',
      display: 'OPERATION_DASHBOARD_EP',
      icon: 'security',
      params: {
        type:'proxy',
        entity:'endpoint'
      },
    },
    {
      link: 'operation-history',
      display: 'OPERATION_DASHBOARD_TOKEN',
      icon: 'stars',
      params: {
        type:'proxy',
        entity:'token'
      },
    },
    {
      link: 'operation-history',
      display: 'OPERATION_DASHBOARD_PRODUCT',
      icon: 'storefront',
      params: {
        type:'product',
        entity:'product'
      },
    },
    {
      link: 'operation-history',
      display: 'OPERATION_DASHBOARD_SKU',
      icon: 'storage',
      params: {
        type:'product',
        entity:'sku'
      },
    },
    {
      link: 'operation-history',
      display: 'OPERATION_DASHBOARD_CATALOG',
      icon: 'category',
      params: {
        type:'product',
        entity:'catalog'
      },
    },
    {
      link: 'operation-history',
      display: 'OPERATION_DASHBOARD_ATTR',
      icon: 'subject',
      params: {
        type:'product',
        entity:'attribute'
      },
    },
    {
      link: 'operation-history',
      display: 'OPERATION_DASHBOARD_FILTER',
      icon: 'filter_list',
      params: {
        type:'product',
        entity:'filter'
      },
    },
    {
      link: 'operation-history',
      display: 'OPERATION_DASHBOARD_ORDER',
      icon: 'assignment',
      params: {
        type:'profile',
        entity:'order'
      },
    },
  ]
  private _mobileQueryListener: () => void;
  @ViewChild("snav", { static: true }) snav: MatSidenav;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public route: ActivatedRoute, public router: Router, public translate: TranslateService,public deviceSvc:DeviceService,public msgSvc:MessageService) {
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
    this.msgSvc.connectSystemMonitor();
    this.msgSvc.connectMallMonitor();
  }
  doLogout(){
    logout()
  }  
}
