/*import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RepartosService {

  private repartos = [
    {
      id: 1,
      fecha: '2025-08-01',
      descripcion: 'Reparto segundo semestre 2025',
      liquidacion: 'liquidacion_9958010724094503.pdf',
      descuento: 'descuento-2025S2.pdf',
      adicional: 'adicional-2025S2.pdf',
      comentarios: 'Incluye pagos por obras registradas hasta junio de 2025.'
    }
  ];

  getAll() {
    return this.repartos;
  }

  getById(id: number) {
    return this.repartos.find(r => r.id === id);
  }
}
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RepartosService {
  private baseUrl = `${environment.apiUrl}/repartos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}
