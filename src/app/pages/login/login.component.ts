import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, Form } from '@angular/forms';
import { HttpProxyService } from 'src/app/services/http-proxy.service';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MsgBoxComponent } from 'src/app/components/msg-box/msg-box.component';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  nextUrl: string = '/dashboard';
  forgetPwd: boolean = false;
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
    activationCode: new FormControl('', [
      Validators.required
    ]),
    token: new FormControl('', [
      Validators.required
    ]),
  });
  hide = true;
  hide2 = true;
  constructor(public httpProxy: HttpProxyService, private route: Router, public dialog: MatDialog, private router: ActivatedRoute, public translate: TranslateService) {
    this.httpProxy.netImpl.currentUserAuthInfo = undefined;
    this.httpProxy.refreshInprogress = false;
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
  getCode() {
    this.httpProxy.netImpl.activate(this.loginOrRegForm).subscribe(next => {
      this.openDialog('code send success, please check your email');
    })

  }
  getToken() {
    this.httpProxy.netImpl.forgetPwd(this.loginOrRegForm).subscribe(next => {
      this.openDialog('token send success, please check your email');
    })
  }
  changePassword() {
    this.httpProxy.netImpl.resetPwd(this.loginOrRegForm).subscribe(next => {
      this.loginOrRegForm.get('state').setValue(false);
      this.forgetPwd = false;
      this.openDialog('password update success, please login');
    })
  }
  openDialog(msg: string): void {
    this.dialog.open(MsgBoxComponent, {
      width: '250px',
      data: msg
    });
  }
  public toggleLang() {
    if (this.translate.currentLang === 'enUS') {
      this.translate.use('zhHans')
    }
    else {
      this.translate.use('enUS')
    }
  }
}
