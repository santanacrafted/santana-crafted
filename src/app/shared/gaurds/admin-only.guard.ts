import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Auth, authState, getIdTokenResult } from '@angular/fire/auth';
import { Observable, of, from } from 'rxjs';
import { switchMap, map, take, catchError } from 'rxjs/operators';

export const AdminOnlyGuard: CanActivateFn = (): Observable<
  boolean | UrlTree
> => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    take(1),
    switchMap((user) => {
      if (!user) {
        return of(router.createUrlTree(['/admin/login']));
      }

      return from(getIdTokenResult(user)).pipe(
        map((tokenResult) => {
          const roles = tokenResult?.claims['roles'] || [];
          if (Array.isArray(roles) && roles.includes('admin')) {
            return true;
          }
          return router.createUrlTree(['/admin/not-authorized']);
        }),
        catchError(() => of(router.createUrlTree(['/admin/login'])))
      );
    })
  );
};
