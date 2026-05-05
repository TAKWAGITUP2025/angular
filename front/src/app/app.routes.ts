import { Routes } from '@angular/router';
import { authGuard } from './shared/auth.guard';
import { LoginComponent } from './login/login.component';
import { ProjetDashboardComponent } from './projet-dashboard/projet-dashboard.component';
import { ProjetDetailComponent } from './projet-detail/projet-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'projets', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'projets', component: ProjetDashboardComponent, canActivate: [authGuard] },
  { path: 'projets/:id', component: ProjetDetailComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'projets' },
];
