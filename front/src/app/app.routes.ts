import {Routes} from '@angular/router';
import {Error404PageComponent} from './core/core-component/layout/error404.page/error404.page.component';

export const routes: Routes = [
  {
    path: "",
    loadChildren: () => import('./core/core.module').then(m =>
      m.CoreModule),

  },
  {
    path: "admin",
    loadChildren: () => import('./admin/admin.module').then(m =>
      m.AdminModule),
  },
  {path: '**', component: Error404PageComponent},
];
