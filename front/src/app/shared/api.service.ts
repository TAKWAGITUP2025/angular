import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  // ---------- PROJETS ----------
  getAllProjets(search: string = '', statut: string = '') {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (statut) params = params.set('statut', statut);
    return this.http.get<any[]>(this.baseUrl + '/projets', { params });
  }

  getProjet(id: string) {
    return this.http.get<any>(this.baseUrl + '/projets/' + id);
  }

  postProjet(data: any) {
    return this.http.post<any>(this.baseUrl + '/projets', data);
  }

  updateProjet(id: string, data: any) {
    return this.http.put<any>(this.baseUrl + '/projets/' + id, data);
  }

  deleteProjet(id: string) {
    return this.http.delete<any>(this.baseUrl + '/projets/' + id);
  }

  // ---------- TACHES ----------
  getAllTaches(projetId: string = '', statut: string = '', priorite: string = '') {
    let params = new HttpParams();
    if (projetId) params = params.set('projet', projetId);
    if (statut) params = params.set('statut', statut);
    if (priorite) params = params.set('priorite', priorite);
    return this.http.get<any[]>(this.baseUrl + '/taches', { params });
  }

  postTache(data: any) {
    return this.http.post<any>(this.baseUrl + '/taches', data);
  }

  updateTache(id: string, data: any) {
    return this.http.put<any>(this.baseUrl + '/taches/' + id, data);
  }

  deleteTache(id: string) {
    return this.http.delete<any>(this.baseUrl + '/taches/' + id);
  }
}
