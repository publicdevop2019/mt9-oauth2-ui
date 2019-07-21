import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './page/login/login.component';
import { ClientComponent } from './page/client/client.component';
import { ResourceOwnerComponent } from './page/resource-owner/resource-owner.component';
import { ErrorComponent } from './page/error/error.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatExpansionModule, MatCardModule, MatPaginatorModule, MatTableModule, MatToolbarModule, MatSidenavModule, MatNavList, MatListModule, MatProgressSpinnerModule, MatSlideToggleModule, MatDialogModule, MatChipsModule } from '@angular/material';
import { SummaryClientComponent } from './page/summary-client/summary-client.component';
import { SummaryResourceOwnerComponent } from './page/summary-resource-owner/summary-resource-owner.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HttpProxyService } from './service/http-proxy.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ResourceOwnerService } from './service/resource-owner.service';
import { ClientService } from './service/client.service';
import { AuthService } from './service/auth.service';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { MsgBoxComponent } from './msg-box/msg-box.component';
import { ErrorInterceptor } from './service/error.interceptor';
import { LoadingInterceptor } from './service/loading.interceptor';
import { AuthorizeComponent } from './page/authorize/authorize.component';
import { SummarySecurityProfileComponent } from './page/summary-security-profile/summary-security-profile.component';
import { SecurityProfileComponent } from './page/security-profile/security-profile.component';
import { SecurityProfileService } from './service/security-profile.service';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClientComponent,
    ResourceOwnerComponent,
    ErrorComponent,
    SummaryClientComponent,
    SummaryResourceOwnerComponent,
    NavBarComponent,
    ProgressSpinnerComponent,
    MsgBoxComponent,
    AuthorizeComponent,
    SummarySecurityProfileComponent,
    SecurityProfileComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatChipsModule
  ],
  entryComponents: [MsgBoxComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    HttpProxyService, ClientService, ResourceOwnerService, AuthService, SecurityProfileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
