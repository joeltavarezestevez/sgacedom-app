import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReclamacionService {
  private baseUrl = `${environment.apiUrl}/reclamaciones`;

  constructor(private http: HttpClient) {}

  /** Listar reclamaciones */
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  /** Detalle de reclamacion */
  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  /** Crear reclamacion */
  create(data: any): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.baseUrl, data);
  }

  /** Actualizar reclamacion */
  update(id: string, data: any): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(`${this.baseUrl}/${id}`,data);
  }
}