import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class PerfilService {
  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /** GET perfil */
  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  /** PUT perfil (datos generales) */
  updateProfile(data: any): Observable<any> {
    console.log('Actualizando perfil...');
    console.log(data);
    console.log(this.baseUrl);
    return this.http.put(this.baseUrl, data);
  }

  /** POST foto */
  uploadPhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('foto_perfil', file);

    return this.http.post(`${this.baseUrl}/photo`, formData);
  }

  changePassword(payload: { currentPassword: string; newPassword: string; confirmPassword: string; }) {
    return this.http.put(`${this.baseUrl}/password`, payload);
  }

}
