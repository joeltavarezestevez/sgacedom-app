import { HttpInterceptorFn } from '@angular/common/http';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return from(Preferences.get({ key: 'accessToken' })).pipe(
    switchMap(({ value }) => {
      if (value) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${value}`,
          },
        });
      }
      return next(req);
    })
  );
};
