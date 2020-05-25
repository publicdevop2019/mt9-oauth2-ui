import { Component, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { HttpProxyService } from './services/http-proxy.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterContentChecked{
  ngAfterContentChecked(): void {
    this.changeDec.detectChanges()
  }
  title = 'OAuth2-Manager';
  constructor(public httpProxy:HttpProxyService,private changeDec:ChangeDetectorRef,public translate: TranslateService){
    this.translate.setDefaultLang('zhHans');
    this.translate.use('zhHans')
  }
}
