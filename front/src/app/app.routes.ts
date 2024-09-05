import { Routes } from '@angular/router';
import { Error404PageComponent } from './core/core-component/layout/error404.page/error404.page.component';
import { AuthComponent } from './core/core-component/Views/auth/auth.component';
import { DashPageComponent } from './core/core-component/Views/dash-page/dash-page.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {
        path: "",
        loadChildren: () => import('./core/core.module').then(m =>
          m.CoreModule)
      },
      {path: '**', component: Error404PageComponent}
];
