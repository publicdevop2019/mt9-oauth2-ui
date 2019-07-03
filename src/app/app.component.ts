import { Component } from '@angular/core';
import { HttpProxyService } from './service/http-proxy.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OAuth2-Manager';
  constructor(public httpProxy:HttpProxyService){

  }
}
