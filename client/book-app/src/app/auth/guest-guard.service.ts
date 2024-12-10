import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const isAuth = await this.authService.getAuthStatus();
    if (isAuth) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}
