import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from '../shared/api.service';
import { ProjetModel } from '../shared/models';

@Component({
  selector: 'app-projet-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './projet-dashboard.component.html',
  styleUrl: './projet-dashboard.component.css',
})
export class ProjetDashboardComponent implements OnInit {
  formValue!: FormGroup;
  projetModelObj: ProjetModel = new ProjetModel();
  projetsData: any[] = [];
  searchTerm: string = '';
  filtreStatut: string = '';
  showAdd: boolean = true;
  showUpdate: boolean = false;
  selectedId: string = '';

  statutOptions = ['en attente', 'en cours', 'termine'];

  constructor(private fb: FormBuilder, private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.formValue = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      statut: ['en attente'],
      dateDebut: [''],
      dateFin: [''],
      responsable: [''],
    });
    this.getAllProjets();
  }

  getAllProjets(): void {
    this.api.getAllProjets(this.searchTerm, this.filtreStatut).subscribe((res) => {
      this.projetsData = res;
      this.cdr.detectChanges();
    });
  }

  onSearch(): void {
    this.getAllProjets();
  }

  resetFiltre(): void {
    this.searchTerm = '';
    this.filtreStatut = '';
    this.getAllProjets();
  }

  clickAddProjet(): void {
    this.formValue.reset({ statut: 'en attente' });
    this.showAdd = true;
    this.showUpdate = false;
  }

  postProjetDetails(): void {
    if (this.formValue.invalid) {
      Swal.fire('Champs manquants', 'Le nom du projet est obligatoire', 'warning');
      return;
    }
    this.api.postProjet(this.formValue.value).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Projet créé', timer: 1000, showConfirmButton: false });
        this.formValue.reset({ statut: 'en attente' });
        this.closeModal();
        this.getAllProjets();
      },
      error: (err) => Swal.fire('Erreur', err.error?.message || 'Echec', 'error'),
    });
  }

  onEdit(row: any): void {
    this.showAdd = false;
    this.showUpdate = true;
    this.selectedId = row._id;
    this.formValue.patchValue({
      nom: row.nom,
      description: row.description || '',
      statut: row.statut,
      dateDebut: row.dateDebut ? row.dateDebut.substring(0, 10) : '',
      dateFin: row.dateFin ? row.dateFin.substring(0, 10) : '',
      responsable: row.responsable || '',
    });
  }

  updateProjet(): void {
    this.api.updateProjet(this.selectedId, this.formValue.value).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Projet modifié', timer: 1000, showConfirmButton: false });
        this.formValue.reset({ statut: 'en attente' });
        this.closeModal();
        this.getAllProjets();
      },
      error: (err) => Swal.fire('Erreur', err.error?.message || 'Echec', 'error'),
    });
  }

  deleteProjet(row: any): void {
    Swal.fire({
      title: 'Supprimer "' + row.nom + '" ?',
      text: 'Toutes les tâches associées seront également supprimées',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
    }).then((res) => {
      if (!res.isConfirmed) return;
      this.api.deleteProjet(row._id).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Projet supprimé', timer: 1000, showConfirmButton: false });
          this.getAllProjets();
        },
        error: (err) => Swal.fire('Erreur', err.error?.message || 'Echec', 'error'),
      });
    });
  }

  closeModal(): void {
    const modal = (window as any).bootstrap?.Modal.getInstance(
      document.getElementById('projetModal')
    );
    if (modal) modal.hide();
  }

  getStatutBadge(statut: string): string {
    const map: any = {
      'en attente': 'bg-secondary',
      'en cours': 'bg-primary',
      'termine': 'bg-success',
    };
    return map[statut] || 'bg-secondary';
  }

  getAvancementColor(pct: number): string {
    if (pct < 30) return 'bg-danger';
    if (pct < 70) return 'bg-warning';
    return 'bg-success';
  }
}
