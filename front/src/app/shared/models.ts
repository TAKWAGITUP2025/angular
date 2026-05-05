// Modele d'un projet
export class ProjetModel {
  _id: string = '';
  nom: string = '';
  description: string = '';
  statut: string = 'en attente';
  dateDebut: string = '';
  dateFin: string = '';
  responsable: string = '';
  avancement: number = 0;
  totalTaches: number = 0;
  tachesTerminees: number = 0;
}

// Modele d'une tache
export class TacheModel {
  _id: string = '';
  titre: string = '';
  description: string = '';
  statut: string = 'a faire';
  priorite: string = 'moyenne';
  projet: any = '';
  dateLimit: string = '';
  assigneA: string = '';
}
