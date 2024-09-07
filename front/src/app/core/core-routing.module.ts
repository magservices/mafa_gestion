import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashPageComponent} from './core-component/core-main/dash-page/dash-page.component';
import {ElevePageComponent} from './core-component/Views/eleve-page/eleve-page.component';
import {AuthComponent} from './core-component/Views/auth/auth.component';
import {PayementPageComponent} from './core-component/Views/payement-page/payement-page.component';
import {RegisterEleveComponent} from './core-component/Views/register-eleve/register-eleve.component';
import {DashComponent} from "./core-component/Views/dash/dash.component";
import {DetailEleveComponent} from "./core-component/Views/detail-eleve/detail-eleve.component";

const routes: Routes = [
  {path: '', component: AuthComponent},
  {
    path: 'dash',
    component: DashPageComponent,
    children: [
      {path: '', component: DashComponent},
      {path: 'student', component: ElevePageComponent},
      {path: 'pay', component: PayementPageComponent},
      {path: 'register-student', component: RegisterEleveComponent},
      {path: 'detail-student/:id', component: DetailEleveComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}
