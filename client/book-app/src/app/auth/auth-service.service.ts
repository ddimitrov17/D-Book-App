import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationStart } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.checkAuthStatus();
      }
    });
  }

  checkAuthStatus() {
    this.http.get('http://localhost:5000/api/auth/validate', { withCredentials: true })
      .subscribe({
        next: () => {
          this.isAuthenticatedSubject.next(true);
        },
        error: () => {
          this.isAuthenticatedSubject.next(false);
        }
      });
  }  

  getAuthStatus(): Promise<boolean> {
    return new Promise((resolve) => {
      this.http.get('http://localhost:5000/api/auth/validate', { withCredentials: true })
        .subscribe({
          next: () => {
            this.isAuthenticatedSubject.next(true);
            resolve(true);
          },
          error: () => {
            this.isAuthenticatedSubject.next(false);
            resolve(false);
          }
        });
    });
  }
  

  logout() {
    return this.http.get('http://localhost:5000/api/auth/logout', { withCredentials: true })
      .subscribe({
        next: () => {
          this.isAuthenticatedSubject.next(false);
          this.router.navigate(['/']);
        },
        error: (err) => console.error('Logout failed:', err)
      });
  }
}