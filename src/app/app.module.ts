import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatOptionModule, MatPaginatorModule, MatProgressSpinnerModule, MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatTableModule, MatToolbarModule, MatSnackBarModule, MatTreeModule, MatHorizontalStepper, MatStepperModule, MatBottomSheetModule, MatSortModule, MatRadioModule, MatChipsModule, MatAutocompleteModule, MatMenuModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MsgBoxComponent } from './components/msg-box/msg-box.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { AuthorizeComponent } from './pages/authorize/authorize.component';
import { LoginComponent } from './pages/login/login.component';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { AuthService } from './services/auth.service';
import { ClientService } from './services/client.service';
import { CustomHttpInterceptor } from './services/http.interceptor';
import { HttpProxyService } from './services/http-proxy.service';
import { LoadingInterceptor } from './services/loading.interceptor';
import { ResourceOwnerService } from './services/resource-owner.service';
import { EndpointService } from './services/endpoint.service';
import { SummaryProductComponent } from './modules/mall/pages/summary-product/summary-product.component';
import { ProductComponent } from './modules/mall/pages/product/product.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SummaryOrderComponent } from './modules/mall/pages/summary-order/summary-order.component';
import { OrderComponent } from './modules/mall/pages/order/order.component';
import { FormInfoService, MtFormBuilderModule } from 'mt-form-builder';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CustomLoader } from './clazz/locale/custom-loader';
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
import { DeviceService } from './services/device.service';
import { SummaryPostComponent } from './modules/bbs/pages/summary-post/summary-post.component';
import { SummaryCommentComponent } from './modules/bbs/pages/summary-comment/summary-comment.component';
import { SummaryLikeComponent } from './modules/bbs/pages/summary-like/summary-like.component';
import { SummaryDislikeComponent } from './modules/bbs/pages/summary-dislike/summary-dislike.component';
import { SummaryNotInterestedComponent } from './modules/bbs/pages/summary-not-interested/summary-not-interested.component';
import { SummaryReportComponent } from './modules/bbs/pages/summary-report/summary-report.component';
import { UpdatePwdComponent } from './pages/update-pwd/update-pwd.component';
import { ResourceOwnerComponent } from './modules/my-users/pages/resource-owner/resource-owner.component';
import { DeleteConfirmHttpInterceptor } from './services/delete-confirm.interceptor';
import { DeleteConfirmDialogComponent } from './components/delete-confirm-dialog/delete-confirm-dialog.component';
import { OfflineInterceptor } from './services/offline.interceptor';
import { SummaryFilterComponent } from './modules/mall/pages/summary-filter/summary-filter.component';
import { FilterComponent } from './modules/mall/pages/filter/filter.component';
import { UpdateProdStatusDialogComponent } from './components/update-prod-status-dialog/update-prod-status-dialog.component';
import { SettingComponent } from './pages/setting/setting.component';
import { EditableFieldComponent } from './components/editable-field/editable-field.component';
import { CopyFieldComponent } from './components/copy-field/copy-field.component';
import { LazyImageComponent } from './components/lazy-image/lazy-image.component';
import { SearchComponent } from './components/search/search.component';
import 'mt-wc-product';
import { PreviewOutletComponent } from './components/preview-outlet/preview-outlet.component'
import { zhHans } from './clazz/locale/zh-Hans';
import { enUS } from './clazz/locale/en-US';
import { EditableListComponent } from './components/editable-list/editable-list.component';

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
    UpdatePwdComponent,
    DeleteConfirmDialogComponent,
    SummaryFilterComponent,
    FilterComponent,
    UpdateProdStatusDialogComponent,
    SettingComponent,
    EditableFieldComponent,
    CopyFieldComponent,
    LazyImageComponent,
    SearchComponent,
    PreviewOutletComponent,
    EditableListComponent
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
    MatRadioModule,
    MatExpansionModule,
    MatCardModule,
    MatPaginatorModule,
    MatMenuModule,
    MatTableModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTreeModule,
    MatStepperModule,
    MatBottomSheetModule,
    LayoutModule,
    MatChipsModule,
    MatSortModule,
    MatAutocompleteModule,
    MtFormBuilderModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomLoader
      }
    }),
  ],
  entryComponents: [MsgBoxComponent, CatalogComponent, AttributeComponent, ProductComponent, ClientComponent, SecurityProfileComponent, ResourceOwnerComponent, DeleteConfirmDialogComponent, FilterComponent, UpdateProdStatusDialogComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DeleteConfirmHttpInterceptor,
      multi: true
    },
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OfflineInterceptor,
      multi: true
    },
    HttpProxyService, ClientService, ResourceOwnerService, AuthService, EndpointService, CustomHttpInterceptor, FormInfoService, DeviceService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private translate: TranslateService, private fis: FormInfoService) {
    let lang = this.translate.currentLang
    if (lang === 'zhHans')
      this.fis.i18nLabel = zhHans
    if (lang === 'enUS')
      this.fis.i18nLabel = enUS
    this.translate.onLangChange.subscribe((e) => {
      if (e.lang === 'zhHans')
        this.fis.i18nLabel = zhHans
      if (e.lang === 'enUS')
        this.fis.i18nLabel = enUS
    })
  }
}
