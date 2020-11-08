import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, Form, FormGroupDirective, NgForm } from '@angular/forms';
import { HttpProxyService } from 'src/app/services/http-proxy.service';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MsgBoxComponent } from 'src/app/components/msg-box/msg-box.component';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import * as UUID from 'uuid/v1';
import { IPendingResourceOwner } from 'src/app/clazz/validation/aggregate/user/interfaze-user';
import { ValidatorHelper } from 'src/app/clazz/validateHelper';
import { EndpointValidator } from 'src/app/clazz/validation/aggregate/endpoint/validator-endpoint';
import { UserValidator } from 'src/app/clazz/validation/aggregate/user/validator-user';
import { ErrorStateMatcher } from '@angular/material/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  nextUrl: string = '/dashboard';
  forgetPwd: boolean = false;
  emailErrorMsg: string = undefined;
  activationCodeErrorMsg: string = undefined;
  passwordErrorMsg: string = undefined;
  confirmgPasswordErrorMsg: string = undefined;
  changeId = UUID();
  // emailMatcher=new MyErrorStateMatcher(this.errorMsgs)
  loginOrRegForm = new FormGroup({
    isRegister: new FormControl('', []),
    email: new FormControl('', []),
    pwd: new FormControl('', []),
    confirmPwd: new FormControl('', []),
    activationCode: new FormControl('', []),
    token: new FormControl('', []),
  });
  hide = true;
  hide2 = true;
  private validateHelper = new ValidatorHelper();
  private validator = new UserValidator()
  constructor(public httpProxy: HttpProxyService, private route: Router, public dialog: MatDialog, private router: ActivatedRoute, public translate: TranslateService) {
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
    this.httpProxy.login(this.loginOrRegForm).subscribe(next => {
      this.httpProxy.currentUserAuthInfo = next;
      this.route.navigate([this.nextUrl], { queryParams: this.router.snapshot.queryParams });
    })
  }
  register() {
    let error = this.validator.validateCreateUser(this.getRegPayload(this.loginOrRegForm));
    if(this.loginOrRegForm.get('confirmPwd').value!==this.loginOrRegForm.get('pwd').value){
      this.confirmgPasswordErrorMsg = 'PWD_NOT_SAME';
      this.loginOrRegForm.get('confirmPwd').setErrors({wrongValue:true});
    }
    if (error.length > 0) {
      if(error.some(e=>e.key==='email')){
        this.emailErrorMsg = error.find(e=>e.key==='email').message;
        this.loginOrRegForm.get('email').setErrors({wrongValue:true});
      }
      if(error.some(e=>e.key==='activationCode')){
        this.activationCodeErrorMsg = error.find(e=>e.key==='activationCode').message;
        this.loginOrRegForm.get('activationCode').setErrors({wrongValue:true});
      }
      if(error.some(e=>e.key==='password')){
        this.passwordErrorMsg = error.find(e=>e.key==='password').message;
        this.loginOrRegForm.get('pwd').setErrors({wrongValue:true});
      }

      this.loginOrRegForm.valueChanges.subscribe(()=>{
        let error = this.validator.validateCreateUser(this.getRegPayload(this.loginOrRegForm));
        if(error.some(e=>e.key==='email')){
          this.emailErrorMsg = error.find(e=>e.key==='email').message;
          this.loginOrRegForm.get('email').setErrors({wrongValue:true});
        }else{
          this.emailErrorMsg = undefined;
        }
        if(error.some(e=>e.key==='activationCode')){
          this.activationCodeErrorMsg = error.find(e=>e.key==='activationCode').message;
          this.loginOrRegForm.get('activationCode').setErrors({wrongValue:true});
        }else{
          this.activationCodeErrorMsg = undefined;
        }
        if(error.some(e=>e.key==='password')){
          this.passwordErrorMsg = error.find(e=>e.key==='password').message;
          this.loginOrRegForm.get('pwd').setErrors({wrongValue:true});
        }else{
          this.passwordErrorMsg = undefined;
        }
        if(this.loginOrRegForm.get('confirmPwd').value!==this.loginOrRegForm.get('pwd').value){
          this.confirmgPasswordErrorMsg = 'PWD_NOT_SAME';
          this.loginOrRegForm.get('confirmPwd').setErrors({wrongValue:true});
        }else{
          this.confirmgPasswordErrorMsg = undefined;
        }
      })
    } else {
      this.httpProxy.register(this.getRegPayload(this.loginOrRegForm), this.changeId).subscribe(next => {
        this.loginOrRegForm.get('isRegister').setValue(false);
        this.openDialog('register success, please login');
      })
    }

  }
  getCode() {
    let error = this.validator.validateCreatePending(this.getActivatePayload(this.loginOrRegForm));
    if (error.length > 0) {
      this.emailErrorMsg = error[0].message;
      this.loginOrRegForm.get('email').setErrors({wrongValue:true});
      this.loginOrRegForm.get('email').valueChanges.subscribe(()=>{
        let error = this.validator.validateCreatePending(this.getActivatePayload(this.loginOrRegForm));
        if (error.length > 0) {
          this.emailErrorMsg = error[0].message;
          this.loginOrRegForm.get('email').setErrors({wrongValue:true});
        } else {
          this.emailErrorMsg = undefined;
        }
      })
    } else {
      this.httpProxy.currentUserAuthInfo = undefined;
      this.httpProxy.activate(this.getActivatePayload(this.loginOrRegForm), this.changeId).subscribe(next => {
        this.openDialog('code send success, please check your email');
      })
    }
  }
  getToken() {
    this.httpProxy.currentUserAuthInfo = undefined;
    this.httpProxy.forgetPwd(this.loginOrRegForm).subscribe(next => {
      this.openDialog('token send success, please check your email');
    })
  }
  changePassword() {
    this.httpProxy.resetPwd(this.loginOrRegForm).subscribe(next => {
      this.loginOrRegForm.get('isRegister').setValue(false);
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
  private getActivatePayload(fg: FormGroup): IPendingResourceOwner {
    return {
      email: fg.get('email').value,
    };
  }
  private getRegPayload(fg: FormGroup): IPendingResourceOwner {
    return {
        email: fg.get('email').value,
        password: fg.get('pwd').value,
        activationCode: fg.get('activationCode').value,
    };
}
  public toggleLang() {
    if (this.translate.currentLang === 'enUS') {
      this.translate.use('zhHans')
      this.translate.get('DOCUMENT_TITLE').subscribe(
        next => {
          document.title = next
          document.documentElement.lang = 'zh-Hans'
        }
      )
    }
    else {
      this.translate.use('enUS')
      this.translate.get('DOCUMENT_TITLE').subscribe(
        next => {
          document.title = next
          document.documentElement.lang = 'en'
        }
      )
    }
  }
}
/** Error when invalid control is dirty, touched, or submitted. */
// export class MyErrorStateMatcher implements ErrorStateMatcher {
// private _errorMsg:  Map<string,string>;
// constructor(errorMsg:  Map<string,string>) {
//   this._errorMsg = errorMsg;
// }
// isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//   return this._errorMsg.get(control);
// }
// }
