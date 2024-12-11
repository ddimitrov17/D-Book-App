import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationStart } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<{ id: string; username: string } | null>(null);

  isAuthenticated = this.isAuthenticatedSubject.asObservable();
  currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.checkAuthStatus();
      }
    });
  }

  checkAuthStatus() {
    this.http.get<{ id: string; username: string }>('http://localhost:5000/api/auth/validate', { withCredentials: true })
      .subscribe({
        next: (user) => {
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(user); 
        },
        error: () => {
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(null);
        },
      });
  }

  getAuthStatus(): Promise<boolean> {
    return new Promise((resolve) => {
      this.http.get<{ id: string; username: string }>('http://localhost:5000/api/auth/validate', { withCredentials: true })
        .subscribe({
          next: (user) => {
            this.isAuthenticatedSubject.next(true);
            this.currentUserSubject.next(user);
            resolve(true);
          },
          error: () => {
            this.isAuthenticatedSubject.next(false);
            this.currentUserSubject.next(null);
            resolve(false);
          },
        });
    });
  }

  logout() {
    return this.http.get('http://localhost:5000/api/auth/logout', { withCredentials: true })
      .subscribe({
        next: () => {
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(null);
          this.router.navigate(['/']);
        },
        error: (err) => console.error('Logout failed:', err),
      });
  }

  getCurrentUser(): Promise<{ id: string; username: string } | null> {
    return new Promise((resolve) => {
      this.http.get<{ id: string; username: string }>('http://localhost:5000/api/auth/validate', { withCredentials: true })
        .subscribe({
          next: (user) => resolve(user),
          error: () => resolve(null),
        });
    });
  }
}
