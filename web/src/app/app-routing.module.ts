import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ShowComponent } from './auth/show/show.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  // {
  //   path: 'auth/show',
  //   component: ShowComponent // Route to the AuthShowComponent
  // },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard] // Protect the home route
  },
  {
    path: 'server',
    loadChildren: () => import('./server/server.module').then(m => m.ServerModule),
    canActivate: [AuthGuard] // Protect the home route
  },
  {
    path: '',
    redirectTo: '/auth/landingPage',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/auth/landingPage'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
