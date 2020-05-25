import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { IClient } from '../pages/summary-client/summary-client.component';
import { IResourceOwner } from '../pages/summary-resource-owner/summary-resource-owner.component';
import { SandboxImpl } from '../clazz/offline.impl';
import { OnlineImpl } from '../clazz/online.impl';
import { INetworkService } from '../interfaze/commom.interface';
import { environment } from 'src/environments/environment';
/**
 * proxy http to enalbe offline mode and mocking
 */
@Injectable({
  providedIn: 'root'
})
export class HttpProxyService {
  netImpl: INetworkService;
  inProgress = false;
  expireRefresh = false;
  constructor(private http: HttpClient) {
    if (environment.mode === 'offline') {
      this.netImpl = new SandboxImpl(this.http);
    } else {
      this.netImpl = new OnlineImpl(this.http);
    }
  }
}
