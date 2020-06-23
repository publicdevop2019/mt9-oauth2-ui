import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatOptionModule, MatPaginatorModule, MatProgressSpinnerModule, MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatTableModule, MatToolbarModule, MatSnackBarModule, MatTreeModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MsgBoxComponent } from './components/msg-box/msg-box.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { AuthorizeComponent } from './pages/authorize/authorize.component';
import { LoginComponent } from './pages/login/login.component';
import { ResourceOwnerComponent } from './pages/resource-owner/resource-owner.component';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { AuthService } from './services/auth.service';
import { ClientService } from './services/client.service';
import { CustomHttpInterceptor } from './services/http.interceptor';
import { HttpProxyService } from './services/http-proxy.service';
import { LoadingInterceptor } from './services/loading.interceptor';
import { ResourceOwnerService } from './services/resource-owner.service';
import { SecurityProfileService } from './services/security-profile.service';
import { SummaryProductComponent } from './modules/mall/pages/summary-product/summary-product.component';
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
import { ClientComponent } from './modules/my-apps/pages/client/client.component';
import { SummaryClientComponent } from './modules/my-apps/pages/summary-client/summary-client.component';
import { SummaryResourceOwnerComponent } from './modules/my-users/pages/summary-resource-owner/summary-resource-owner.component';
import { SummarySecurityProfileComponent } from './modules/my-apps/pages/summary-security-profile/summary-security-profile.component';
import { SecurityProfileComponent } from './modules/my-apps/pages/security-profile/security-profile.component';
import { CatalogComponent } from './modules/mall/pages/catalog/catalog.component';
import { SummaryCatalogComponent } from './modules/mall/pages/summary-catalog/summary-catalog.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { SummaryAttributeComponent } from './modules/mall/pages/summary-attribute/summary-attribute.component';
import { AttributeComponent } from './modules/mall/pages/attribute/attribute.component';
import { CatalogTreeComponent } from './modules/mall/components/catalog-tree/catalog-tree.component';
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
    SummaryCatalogComponent,
    CatalogComponent,
    ProductComponent,
    SummaryOrderComponent,
    OrderComponent,
    SummaryPostComponent,
    SummaryCommentComponent,
    SummaryLikeComponent,
    SummaryDislikeComponent,
    SummaryNotInterestedComponent,
    SummaryReportComponent,
    BackButtonComponent,
    SummaryAttributeComponent,
    AttributeComponent,
    CatalogTreeComponent,
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
    MatTreeModule,
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
