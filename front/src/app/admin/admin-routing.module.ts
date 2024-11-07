import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./admin-component/views/dashboard/dashboard.component";
import {DashMainComponent} from "./admin-component/admin-main/dash-main/dash-main.component";
import {SchoolManagementComponent} from "./admin-component/views/school-management/school-management.component";
import {SchoolDetailComponent} from "./admin-component/views/school-detail/school-detail.component";


const routes: Routes = [
  {path: '', component: DashMainComponent, children:
      [
        {path: '', component: DashboardComponent},
        {path: 'school', component: SchoolManagementComponent},
        {path: 'detail-school/:id', component: SchoolDetailComponent},
      ]
  },
];






@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule {}
