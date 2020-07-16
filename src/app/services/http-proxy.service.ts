import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SandboxImpl } from '../clazz/offline.impl';
import { OnlineImpl } from '../clazz/online.impl';
import { INetworkService } from '../interfaze/commom.interface';
/**
 * proxy http to enalbe offline mode and mocking
 */
@Injectable({
  providedIn: 'root'
})
export class HttpProxyService {
  netImpl: INetworkService;
  inProgress = false;
  refreshInprogress = false;
  constructor(private http: HttpClient) {
    this.netImpl = new OnlineImpl(this.http);
    // if (environment.mode === 'offline') {
    //   this.netImpl = new SandboxImpl(this.http);
    // } else {
    //   this.netImpl = new OnlineImpl(this.http);
    // }
  }
}
