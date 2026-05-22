import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrestamoService {
  private baseUrl = `${environment.apiUrl}/prestamos`;

  constructor(private http: HttpClient) {}

  /** Listar prestamos */
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  /** Detalle de prestamo */
  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  /** Crear prestamo */
  create(data: any): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.baseUrl, data);
  }

  /** Actualizar prestamo */
  update(id: string, data: any): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(`${this.baseUrl}/${id}`,data);
  }

  /** POST foto */
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('arc_soporte', file);

    return this.http.post(`${this.baseUrl}/file`, formData);
  }  
}