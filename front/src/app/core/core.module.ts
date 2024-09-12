import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RegisterEleveComponent} from "./core-component/Views/register-eleve/register-eleve.component";
import { UserFormComponent } from './core-component/Views/user-form/user-form.component';



@NgModule({
  declarations: [
    RegisterEleveComponent,
    UserFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreRoutingModule,
  ],
})
export class CoreModule { }
