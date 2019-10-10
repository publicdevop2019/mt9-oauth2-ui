import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, Form } from '@angular/forms';
import { HttpProxyService } from 'src/app/service/http-proxy.service';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
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
  constructor(public httpProxy: HttpProxyService, private route: Router, public dialog: MatDialog, private router: ActivatedRoute) {
    this.httpProxy.netImpl.authenticatedEmail = undefined;
    this.httpProxy.netImpl.currentUserAuthInfo = undefined;
    this.httpProxy.expireRefresh = false;
    this.router.queryParamMap.subscribe(queryMaps => {
      if (queryMaps.get('redirect_uri') !== null) {
        /** get  authorize party info */
        this.nextUrl = '/authorize';
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
      this.route.navigate([this.nextUrl], { queryParams: this.router.snapshot.queryParams });
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
