import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-projet-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './projet-detail.component.html',
  styleUrl: './projet-detail.component.css',
})
export class ProjetDetailComponent implements OnInit {
  projet: any = null;
  taches: any[] = [];
  filtreStatut: string = '';
  filtrePriorite: string = '';

  tacheForm!: FormGroup;
  showAdd: boolean = true;
  showUpdate: boolean = false;
  selectedTacheId: string = '';

  colonnes = [
    { statut: 'a faire', label: 'À faire', icon: 'bi-hourglass', color: 'secondary' },
    { statut: 'en cours', label: 'En cours', icon: 'bi-play-circle', color: 'primary' },
    { statut: 'termine', label: 'Terminé', icon: 'bi-check-circle', color: 'success' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.tacheForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      statut: ['a faire'],
      priorite: ['moyenne'],
      dateLimit: [''],
      assigneA: [''],
    });
    this.loadProjet();
  }

  loadProjet(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.getProjet(id).subscribe({
      next: (res) => {
        console.log('API Response:', res);
        this.projet = res.projet;
        this.taches = res.taches || [];
        console.log('Projet:', this.projet);
        console.log('Taches:', this.taches);
      },
      error: (err) => {
        console.error('API Error:', err);
        Swal.fire('Erreur', 'Projet introuvable', 'error');
        this.router.navigate(['/projets']);
      },
    });
  }

  getTachesByStatut(statut: string): any[] {
    if (!this.taches) return [];
    let result = this.taches.filter((t) => t.statut === statut);
    if (this.filtrePriorite) result = result.filter((t) => t.priorite === this.filtrePriorite);
    return result;
  }

  clickAddTache(): void {
    this.tacheForm.reset({ statut: 'a faire', priorite: 'moyenne' });
    this.showAdd = true;
    this.showUpdate = false;
  }

  postTache(): void {
    if (this.tacheForm.invalid) {
      Swal.fire('Champs manquants', 'Le titre est obligatoire', 'warning');
      return;
    }
    const data = { ...this.tacheForm.value, projet: this.projet._id };
    this.api.postTache(data).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Tâche créée', timer: 900, showConfirmButton: false });
        this.tacheForm.reset({ statut: 'a faire', priorite: 'moyenne' });
        this.closeModal();
        this.loadProjet();
      },
      error: (err) => Swal.fire('Erreur', err.error?.message || 'Echec', 'error'),
    });
  }

  onEditTache(t: any): void {
    this.showAdd = false;
    this.showUpdate = true;
    this.selectedTacheId = t._id;
    this.tacheForm.patchValue({
      titre: t.titre,
      description: t.description || '',
      statut: t.statut,
      priorite: t.priorite,
      dateLimit: t.dateLimit ? t.dateLimit.substring(0, 10) : '',
      assigneA: t.assigneA || '',
    });
  }

  updateTache(): void {
    this.api.updateTache(this.selectedTacheId, this.tacheForm.value).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Tâche modifiée', timer: 900, showConfirmButton: false });
        this.tacheForm.reset({ statut: 'a faire', priorite: 'moyenne' });
        this.closeModal();
        this.loadProjet();
      },
      error: (err) => Swal.fire('Erreur', err.error?.message || 'Echec', 'error'),
    });
  }

  changeStatut(tache: any, statut: string): void {
    this.api.updateTache(tache._id, { statut }).subscribe({
      next: () => this.loadProjet(),
      error: () => Swal.fire('Erreur', 'Impossible de changer le statut', 'error'),
    });
  }

  deleteTache(t: any): void {
    Swal.fire({
      title: 'Supprimer "' + t.titre + '" ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
    }).then((res) => {
      if (!res.isConfirmed) return;
      this.api.deleteTache(t._id).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Tâche supprimée', timer: 900, showConfirmButton: false });
          this.loadProjet();
        },
        error: () => Swal.fire('Erreur', 'Echec suppression', 'error'),
      });
    });
  }

  closeModal(): void {
    const modal = (window as any).bootstrap?.Modal.getInstance(
      document.getElementById('tacheModal')
    );
    if (modal) modal.hide();
  }

  getPrioriteBadge(p: string): string {
    const map: any = { basse: 'bg-info', moyenne: 'bg-warning', haute: 'bg-danger' };
    return map[p] || 'bg-secondary';
  }

  getStatutBadge(statut: string): string {
    const map: any = {
      'en attente': 'bg-secondary',
      'en cours': 'bg-primary',
      'termine': 'bg-success',
    };
    return map[statut] || 'bg-secondary';
  }
}
