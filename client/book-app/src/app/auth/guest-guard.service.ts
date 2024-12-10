import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth-service.service'; 
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GuestGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  
    canActivate(): Observable<boolean> {
      return this.authService.isAuthenticated.pipe(
        map((isAuth) => {
          if (!isAuth) {
            this.router.navigate(['/home']);
            return false;
          }
          return true;
        })
      );
    }
  }
