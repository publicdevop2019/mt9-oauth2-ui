import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { AuthService } from './services/auth.service';
import { AuthorizeComponent } from './pages/authorize/authorize.component';
import { SummaryProductComponent } from './modules/mall/pages/summary-product/summary-product.component';
import { ProductComponent } from './modules/mall/pages/product/product.component';
import { SummaryOrderComponent } from './modules/mall/pages/summary-order/summary-order.component';
import { OrderComponent } from './modules/mall/pages/order/order.component';
import { ClientComponent } from './modules/my-apps/pages/client/client.component';
import { SummaryClientComponent } from './modules/my-apps/pages/summary-client/summary-client.component';
import { SummaryResourceOwnerComponent } from './modules/my-users/pages/summary-resource-owner/summary-resource-owner.component';
import { SummarySecurityProfileComponent } from './modules/my-apps/pages/summary-security-profile/summary-security-profile.component';
import { SecurityProfileComponent } from './modules/my-apps/pages/security-profile/security-profile.component';
import { CatalogComponent } from './modules/mall/pages/catalog/catalog.component';
import { SummaryCatalogComponent } from './modules/mall/pages/summary-catalog/summary-catalog.component';
import { AttributeComponent } from './modules/mall/pages/attribute/attribute.component';
import { SummaryAttributeComponent } from './modules/mall/pages/summary-attribute/summary-attribute.component';
import { SummaryPostComponent } from './modules/bbs/pages/summary-post/summary-post.component';
import { SummaryCommentComponent } from './modules/bbs/pages/summary-comment/summary-comment.component';
import { SummaryReportComponent } from './modules/bbs/pages/summary-report/summary-report.component';
import { SummaryLikeComponent } from './modules/bbs/pages/summary-like/summary-like.component';
import { SummaryDislikeComponent } from './modules/bbs/pages/summary-dislike/summary-dislike.component';
import { SummaryNotInterestedComponent } from './modules/bbs/pages/summary-not-interested/summary-not-interested.component';
import { UpdatePwdComponent } from './pages/update-pwd/update-pwd.component';
import { SummaryFilterComponent } from './modules/mall/pages/summary-filter/summary-filter.component';
import { SettingComponent } from './pages/setting/setting.component';
import { OperationHistoryComponent } from './pages/operation-history/operation-history.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'authorize', component: AuthorizeComponent, canActivate: [AuthService] },
  {
    path: 'dashboard', component: NavBarComponent, canActivateChild: [AuthService],
    children: [
      { path: '', redirectTo: 'security-profiles', pathMatch: 'full' },
      { path: 'clients', component: SummaryClientComponent },
      { path: 'updatePwd', component: UpdatePwdComponent },
      { path: 'resource-owners', component: SummaryResourceOwnerComponent },
      { path: 'orders', component: SummaryOrderComponent },
      { path: 'orders/:id', component: OrderComponent },
      { path: 'security-profiles', component: SummarySecurityProfileComponent },
      { path: 'products', component: SummaryProductComponent },
      { path: 'catalogs', component: SummaryCatalogComponent },
      { path: 'filters', component: SummaryFilterComponent },
      { path: 'attributes', component: SummaryAttributeComponent },
      { path: 'posts', component: SummaryPostComponent },
      { path: 'comments', component: SummaryCommentComponent },
      { path: 'reports', component: SummaryReportComponent },
      { path: 'likess', component: SummaryLikeComponent },
      { path: 'dislikes', component: SummaryDislikeComponent },
      { path: 'notInterested', component: SummaryNotInterestedComponent },
      { path: 'settings', component: SettingComponent},
      { path: 'operation-history', component: OperationHistoryComponent},
      { path: '**', component: SummarySecurityProfileComponent }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
