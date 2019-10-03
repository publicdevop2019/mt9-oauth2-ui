import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, Form } from '@angular/forms';
import { HttpProxyService } from 'src/app/service/http-proxy.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MsgBoxComponent } from 'src/app/msg-box/msg-box.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  nextUrl: string = '/dashboard';
  loginOrRegForm = new FormGroup({
    state: new FormControl('', [
      Validators.required
    ]),
    email: new FormControl('', [
      Validators.required
    ]),
    pwd: new FormControl('', [
      Validators.required
    ]),
    confirmPwd: new FormControl('', [
      Validators.required
    ]),
  });
  hide = true;
  hide2 = true;
  constructor(public httpProxy: HttpProxyService, private route: Router, public dialog: MatDialog, private router: ActivatedRoute, ) {
    this.httpProxy.netImpl.authenticatedEmail = undefined;
    this.httpProxy.netImpl.currentUserAuthInfo = undefined;
    this.httpProxy.netImpl.authorizeParty = undefined;
    this.router.queryParamMap.subscribe(queryMaps => {
      if (queryMaps.get('state') === 'authorize:external') {
        /** get  authorize party info */
        this.nextUrl = '/authorize';
        this.httpProxy.netImpl.authorizeParty = {
          response_type: queryMaps.get('response_type'),
          client_id: queryMaps.get('client_id'),
          state: queryMaps.getAll('state')[1],
          redirect_uri: queryMaps.get('redirect_uri'),
        }
      }
    })
  }

  ngOnInit() {
  }
  getErrorMessage() {
    return this.loginOrRegForm.get('email').hasError('required') ? 'You must enter a value' :
      this.loginOrRegForm.get('email').hasError('email') ? 'Not a valid email' :
        '';
  }
  login() {
    this.httpProxy.netImpl.login(this.loginOrRegForm).subscribe(next => {
      this.httpProxy.netImpl.authenticatedEmail = this.loginOrRegForm.get('email').value;
      this.httpProxy.netImpl.currentUserAuthInfo = next;
      this.route.navigate([this.nextUrl]);
    })
  }
  register() {
    this.httpProxy.netImpl.register(this.loginOrRegForm).subscribe(next => {
      this.loginOrRegForm.get('state').setValue(false);
      this.openDialog('register success, please login');
    })
  }
  openDialog(msg: string): void {
    this.dialog.open(MsgBoxComponent, {
      width: '250px',
      data: msg
    });
  }
  toGitHub() {
    window.open(environment.home, '_blank')
  }
}
