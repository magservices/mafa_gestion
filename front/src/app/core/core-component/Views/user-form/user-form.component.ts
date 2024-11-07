import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../shared/model/User';
import {Router} from '@angular/router';
import {establishment} from "../../../../../environments/environment";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  userForm!: FormGroup;
  user: User = new User();
  loading = false;  // Variable pour suivre l'état du chargement

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private router: Router) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      tel: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.loading = true;  // Active l'indicateur de chargement
      this.user.nom = this.userForm.value.nom;
      this.user.prenom = this.userForm.value.prenom;
      this.user.tel = this.userForm.value.tel;
      this.user.email = this.userForm.value.email;
      this.user.password = this.userForm.value.password;
      this.user.login_establishment = establishment.login;
      if (!this.user.roles) {
        this.user.roles = [];
      }
      this.user.roles.push(this.userForm.value.role);

      this.userService.createUser(this.user).subscribe(
        (user: User) => {
          this.loading = false;  // Désactive l'indicateur de chargement après traitement
          window.location.reload()
          this.activeModal.close()
        }
      );
    }
  }
}
