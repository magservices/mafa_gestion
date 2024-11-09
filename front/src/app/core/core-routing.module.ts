import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashPageComponent} from './core-component/core-main/dash-page/dash-page.component';
import {ElevePageComponent} from './core-component/Views/eleve-page/eleve-page.component';
import {AuthComponent} from './core-component/Views/auth/auth.component';
import {PayementPageComponent} from './core-component/Views/payement-page/payement-page.component';
import {RegisterEleveComponent} from './core-component/Views/register-eleve/register-eleve.component';
import {DashComponent} from "./core-component/Views/dash/dash.component";
import {DetailEleveComponent} from "./core-component/Views/detail-eleve/detail-eleve.component";
import { AuthGuard } from './core-component/shared/res/guard/authGuard';
import { UserFormComponent } from './core-component/Views/user-form/user-form.component';
import {LatePaymentComponent} from "./core-component/Views/late-payment/late-payment.component";

const routes: Routes = [
  {path: '', component: AuthComponent},
  {path: 'register-user', component: UserFormComponent},
  {
    path: 'dash',
    component: DashPageComponent, canActivate: [AuthGuard],
    children: [
      {path: '', component: DashComponent},
      {path: 'student', component: ElevePageComponent},
      {path: 'pay', component: PayementPageComponent},
      {path: 'register-student', component: RegisterEleveComponent},
      {path: 'register-student/:id', component: RegisterEleveComponent},
      {path: 'late-payment', component: LatePaymentComponent},
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
