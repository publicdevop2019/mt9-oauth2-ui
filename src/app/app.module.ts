import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatOptionModule, MatPaginatorModule, MatProgressSpinnerModule, MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatTableModule, MatToolbarModule, MatSnackBarModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MsgBoxComponent } from './components/msg-box/msg-box.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { AuthorizeComponent } from './pages/authorize/authorize.component';
import { ClientComponent } from './pages/client/client.component';
import { LoginComponent } from './pages/login/login.component';
import { ResourceOwnerComponent } from './pages/resource-owner/resource-owner.component';
import { SecurityProfileComponent } from './pages/security-profile/security-profile.component';
import { SummaryClientComponent } from './pages/summary-client/summary-client.component';
import { SummaryResourceOwnerComponent } from './pages/summary-resource-owner/summary-resource-owner.component';
import { SummarySecurityProfileComponent } from './pages/summary-security-profile/summary-security-profile.component';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { AuthService } from './services/auth.service';
import { ClientService } from './services/client.service';
import { CustomHttpInterceptor } from './services/http.interceptor';
import { HttpProxyService } from './services/http-proxy.service';
import { LoadingInterceptor } from './services/loading.interceptor';
import { ResourceOwnerService } from './services/resource-owner.service';
import { SecurityProfileService } from './services/security-profile.service';
import { SummaryProductComponent } from './modules/mall/pages/summary-product/summary-product.component';
import { SummaryCategoryComponent } from './modules/mall/pages/summary-category/summary-category.component';
import { CategoryComponent } from './modules/mall/pages/category/category.component';
import { ProductComponent } from './modules/mall/pages/product/product.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SummaryOrderComponent } from './modules/mall/pages/summary-order/summary-order.component';
import { OrderComponent } from './modules/mall/pages/order/order.component';
import { FormInfoService, MtFormBuilderModule } from 'mt-form-builder';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CustomLoader } from './clazz/locale/custom-loader';
import { SummaryPostComponent } from './modules/bbs-module/pages/summary-post/summary-post.component';
import { SummaryCommentComponent } from './modules/bbs-module/pages/summary-comment/summary-comment.component';
import { SummaryLikeComponent } from './modules/bbs-module/pages/summary-like/summary-like.component';
import { SummaryDislikeComponent } from './modules/bbs-module/pages/summary-dislike/summary-dislike.component';
import { SummaryNotInterestedComponent } from './modules/bbs-module/pages/summary-not-interested/summary-not-interested.component';
import { SummaryReportComponent } from './modules/bbs-module/pages/summary-report/summary-report.component';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClientComponent,
    ResourceOwnerComponent,
    SummaryClientComponent,
    SummaryResourceOwnerComponent,
    NavBarComponent,
    ProgressSpinnerComponent,
    MsgBoxComponent,
    AuthorizeComponent,
    SummarySecurityProfileComponent,
    SecurityProfileComponent,
    SummaryProductComponent,
    SummaryCategoryComponent,
    CategoryComponent,
    ProductComponent,
    SummaryOrderComponent,
    OrderComponent,
    SummaryPostComponent,
    SummaryCommentComponent,
    SummaryLikeComponent,
    SummaryDislikeComponent,
    SummaryNotInterestedComponent,
    SummaryReportComponent,
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
    MatSnackBarModule,
    LayoutModule,
    MtFormBuilderModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useClass:CustomLoader
      }
  }),
  ],
  entryComponents: [MsgBoxComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    HttpProxyService, ClientService, ResourceOwnerService, AuthService, SecurityProfileService,CustomHttpInterceptor,FormInfoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
