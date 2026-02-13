import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      console.error('HTTP Error:', error);

      // Aquí puedes normalizar mensajes
      let message = 'Error inesperado';

      if (error.error?.message) {
        message = error.error.message;
      }

      // IMPORTANTE: throwError, no of()
      return throwError(() => ({
        ...error,
        userMessage: message
      }));
    })
  );
};

