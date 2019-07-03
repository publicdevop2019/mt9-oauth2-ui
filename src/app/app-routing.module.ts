import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { ErrorComponent } from './page/error/error.component';
import { ClientComponent } from './page/client/client.component';
import { ResourceOwnerComponent } from './page/resource-owner/resource-owner.component';
import { SummaryClientComponent } from './page/summary-client/summary-client.component';
import { SummaryResourceOwnerComponent } from './page/summary-resource-owner/summary-resource-owner.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AuthService } from './service/auth.service';
import { AuthorizeComponent } from './page/authorize/authorize.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'authorize', component: AuthorizeComponent,canActivate: [AuthService]},
  {
    path: 'dashboard', component: NavBarComponent,canActivateChild: [AuthService],
    children: [
      { path: '', redirectTo: 'clients', pathMatch: 'full' },
      { path: 'client/:id', component: ClientComponent },
      { path: 'client', component: ClientComponent },
      { path: 'clients', component: SummaryClientComponent },
      { path: 'resource-owner', component: ResourceOwnerComponent },
      { path: 'resource-owner/:id', component: ResourceOwnerComponent },
      { path: 'resource-owners', component: SummaryResourceOwnerComponent},
      { path: '**', component: SummaryClientComponent }
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
