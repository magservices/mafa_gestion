import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashPageComponent } from './core-component/Views/dash-page/dash-page.component';
import { ElevePageComponent } from './core-component/Views/eleve-page/eleve-page.component';
import { AuthComponent } from './core-component/Views/auth/auth.component';
import { PayementPageComponent } from './core-component/Views/payement-page/payement-page.component';
import { RegisterEleveComponent } from './core-component/Views/register-eleve/register-eleve.component';

const routes: Routes = [
  {path: '', component: AuthComponent},
  {
    path: 'dash',
    component: DashPageComponent,
    children: [
        {path: '', component: ElevePageComponent},
        {path: 'pay', component: PayementPageComponent},
        {path: 'register-eleve', component: RegisterEleveComponent},
        {path: 'detail-eleve/:id', component: ElevePageComponent},
        {path: 'pay-eleve/:id', component: ElevePageComponent},
        {path: 'add-pay', component: ElevePageComponent},
        ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
