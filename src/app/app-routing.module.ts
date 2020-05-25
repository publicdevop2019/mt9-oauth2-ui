import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ClientComponent } from './pages/client/client.component';
import { ResourceOwnerComponent } from './pages/resource-owner/resource-owner.component';
import { SummaryClientComponent } from './pages/summary-client/summary-client.component';
import { SummaryResourceOwnerComponent } from './pages/summary-resource-owner/summary-resource-owner.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { AuthService } from './services/auth.service';
import { AuthorizeComponent } from './pages/authorize/authorize.component';
import { SummarySecurityProfileComponent } from './pages/summary-security-profile/summary-security-profile.component';
import { SecurityProfileComponent } from './pages/security-profile/security-profile.component';
import { SummaryProductComponent } from './modules/mall/pages/summary-product/summary-product.component';
import { ProductComponent } from './modules/mall/pages/product/product.component';
import { SummaryCategoryComponent } from './modules/mall/pages/summary-category/summary-category.component';
import { CategoryComponent } from './modules/mall/pages/category/category.component';
import { SummaryOrderComponent } from './modules/mall/pages/summary-order/summary-order.component';
import { OrderComponent } from './modules/mall/pages/order/order.component';
import { SummaryPostComponent } from './modules/bbs-module/pages/summary-post/summary-post.component';
import { SummaryCommentComponent } from './modules/bbs-module/pages/summary-comment/summary-comment.component';
import { SummaryReportComponent } from './modules/bbs-module/pages/summary-report/summary-report.component';
import { SummaryLikeComponent } from './modules/bbs-module/pages/summary-like/summary-like.component';
import { SummaryDislikeComponent } from './modules/bbs-module/pages/summary-dislike/summary-dislike.component';
import { SummaryNotInterestedComponent } from './modules/bbs-module/pages/summary-not-interested/summary-not-interested.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'authorize', component: AuthorizeComponent, canActivate: [AuthService] },
  {
    path: 'dashboard', component: NavBarComponent, canActivateChild: [AuthService],
    children: [
      { path: '', redirectTo: 'security-profiles', pathMatch: 'full' },
      { path: 'client/:id', component: ClientComponent },
      { path: 'client', component: ClientComponent },
      { path: 'clients', component: SummaryClientComponent },
      { path: 'resource-owner', component: ResourceOwnerComponent },
      { path: 'resource-owner/:id', component: ResourceOwnerComponent },
      { path: 'resource-owners', component: SummaryResourceOwnerComponent },
      { path: 'orders', component: SummaryOrderComponent },
      { path: 'orders/:id', component: OrderComponent },
      { path: 'security-profiles', component: SummarySecurityProfileComponent },
      { path: 'security-profile', component: SecurityProfileComponent },
      { path: 'security-profile/:id', component: SecurityProfileComponent },
      { path: 'products', component: SummaryProductComponent },
      { path: 'product', component: ProductComponent },
      { path: 'products/:id', component: ProductComponent },
      { path: 'categories', component: SummaryCategoryComponent },
      { path: 'categories/:id', component: CategoryComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'posts', component: SummaryPostComponent },
      { path: 'comments', component: SummaryCommentComponent },
      { path: 'reports', component: SummaryReportComponent },
      { path: 'likess', component: SummaryLikeComponent },
      { path: 'dislikes', component: SummaryDislikeComponent },
      { path: 'notInterested', component: SummaryNotInterestedComponent },
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
