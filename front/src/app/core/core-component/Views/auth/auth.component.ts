import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import {UserService} from '../../shared/services/user.service';
import {Router} from '@angular/router';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PayEleveComponent} from "../pay-eleve/pay-eleve.component";
import {AlertComponent} from "../../basic-component/alert/alert.component";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    NgOptimizedImage, ReactiveFormsModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {
  loginForm!: FormGroup;
  private modalService = inject(NgbModal);
  loading = false;  // Variable pour suivre l'état du chargement
  errorMessage!: string;


  constructor(private fb: FormBuilder,
              private userService: UserService,
              private router: Router) {

  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', Validators.required]
    });

    const token = localStorage.getItem('USER-TOKEN-MAFA');
    if (token) {
      this.router.navigateByUrl("/dash");
    }
  }

  forgetPassword() {
    const modalRef = this.modalService.open(AlertComponent,
      {size: "lg", animation: true, centered: true});
    modalRef.componentInstance.componentName = "forget password";
  }


  onSubmit() {
    this.loading = true;  // Variable pour suivre l'état du chargement
    if (this.loginForm.valid) {
      const data = {
        username: this.loginForm.value.login,
        password: this.loginForm.value.password
      };


      this.userService.login(data).subscribe(
        (token: string) => {
          console.log(data)
          this.loading = false;  // Variable pour suivre l'état du chargement
          localStorage.setItem('USER-TOKEN-MAFA', token);
          this.router.navigateByUrl("/dash");
        },
        (error) => {
          this.loading = false;  // Variable pour suivre l'état du chargement
          this.errorMessage = "Le mot de passe ou l'adresse e-mail que vous avez saisis est incorrect.";

        }
      );

    }
  }
}
