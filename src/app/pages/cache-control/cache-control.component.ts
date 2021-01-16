import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { HttpProxyService } from 'src/app/services/http-proxy.service';
import * as UUID from 'uuid/v1';
@Component({
  selector: 'app-cache-control',
  templateUrl: './cache-control.component.html',
  styleUrls: ['./cache-control.component.css']
})
export class CacheControlComponent implements OnInit {
 private cacheChangeId = UUID();
  constructor(protected httpProxySvc:HttpProxyService, private _snackBar: MatSnackBar, private translate: TranslateService) { }
  cacheInProgress=false;
  ngOnInit(): void {
  }
  sendReloadRequest(){
    this.cacheInProgress=true
    this.httpProxySvc.sendReloadRequest(this.cacheChangeId).subscribe(_=>{
      this.cacheInProgress=false;
      this.openSnackbar('CACHE_RELOAD_MSG_SENT')
    },error=>{
      this.cacheInProgress=false;
    }
    )
  }
  openSnackbar(message: string) {
    this.translate.get(message).subscribe(next => {
      this._snackBar.open(next, 'OK', {
        duration: 5000,
      });
    })
  }
}
