import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RegisterEleveComponent} from "./core-component/Views/register-eleve/register-eleve.component";
import {HttpClientModule} from "@angular/common/http";



@NgModule({
  declarations: [
    RegisterEleveComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreRoutingModule,
  ],
})
export class CoreModule { }
