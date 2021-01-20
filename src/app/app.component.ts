import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpProxyService } from './services/http-proxy.service';
declare var SockJS: any;
declare var Stomp: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterContentChecked, OnInit {
  title = 'OAuth2-Manager';
  private stompClient = null;
  private SOCKET_ENDPOINT = "http://localhost:8085/web-socket?token=123";
  // private SEND_ENDPOINT = "/notification";
  constructor(public httpProxy: HttpProxyService, private changeDec: ChangeDetectorRef, public translate: TranslateService) {
    this.translate.setDefaultLang('zhHans');
    this.translate.use('zhHans')
  }
  ngAfterContentChecked(): void {
    this.changeDec.detectChanges()
  }
  ngOnInit(): void {
    let socket = new SockJS(this.SOCKET_ENDPOINT);
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame: any) => {
      alert("连接成功");
      this.stompClient.subscribe("notify", (responseBody: any) => {
        console.dir(responseBody.body)
      });
    });
  }

}
