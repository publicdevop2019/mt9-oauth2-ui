import { Component, OnInit } from '@angular/core';
import { HttpProxyService } from 'src/app/service/http-proxy.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.css']
})
export class AuthorizeComponent implements OnInit {

  constructor(public httpProxy: HttpProxyService, private router: Router) {
    /** if client is eligible for auto approve */
    this.httpProxy.netImpl.autoApprove(this.httpProxy.netImpl.authorizeParty.client_id).subscribe(next => {
      if (next)
        this.authorize();
    })
  }

  ngOnInit() {
  }
  authorize() {
    this.httpProxy.netImpl.authorize(this.httpProxy.netImpl.authorizeParty).subscribe(next => {
      window.open(this.httpProxy.netImpl.authorizeParty.redirect_uri + '?code=' + next.authorize_code, '_blank');
      this.router.navigate(['/dashboard']);
    })
  }
  decline() {
    /** clear authorize party info */
    this.httpProxy.netImpl.authorizeParty = undefined;
    this.router.navigate(['/dashboard']);
  }
}
