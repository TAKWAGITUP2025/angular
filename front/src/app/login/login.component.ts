import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}

  onLogin(): void {
    if (!this.username || !this.password) {
      Swal.fire('Erreur', 'Saisissez vos identifiants', 'warning');
      return;
    }
    this.loading = true;
    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Bienvenue ' + res.user.username,
          timer: 1200,
          showConfirmButton: false,
        });
        this.router.navigate(['/projets']);
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Echec', err.error?.message || 'Connexion impossible', 'error');
      },
    });
  }
}
