import { Component } from '@angular/core';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    NgOptimizedImage, ReactiveFormsModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  loginForm: FormGroup;
  loading = false;  // Variable pour suivre l'état du chargement


  constructor(private fb: FormBuilder, private userService: UserService,private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    const token = localStorage.getItem('USER-TOKEN-MAFA');
    if (token) {
      this.router.navigateByUrl("/dash");
    }
  }


  onSubmit() {
    this.loading = true;  // Variable pour suivre l'état du chargement
    if (this.loginForm.valid) {
      const data = { username: this.loginForm.value.email, password: this.loginForm.value.password };
      this.userService.login(data).subscribe(
        (token : string)=>{
          this.loading = false;  // Variable pour suivre l'état du chargement
          localStorage.setItem('USER-TOKEN-MAFA', token);
          this.router.navigateByUrl("/dash");
        },
        (error) => {
          this.loading = false;  // Variable pour suivre l'état du chargement
          alert("Le mot de passe ou l'adresse e-mail que vous avez saisis est incorrect.");

        }
      );

    }
  }
}
