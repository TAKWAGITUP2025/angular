import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './shared/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'Gestion de Projets et Tâches';

  constructor(public auth: AuthService, private router: Router) {}

  logout(): void {
    Swal.fire({
      title: 'Déconnexion ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
    }).then((res) => {
      if (res.isConfirmed) {
        this.auth.logout();
        this.router.navigate(['/login']);
      }
    });
  }
}
