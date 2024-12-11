import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../../error.service';
import { ErrorComponent } from '../../error/error.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ErrorComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @ViewChild('LoginForm') form: NgForm | undefined;
  submitted: boolean = false;

  constructor(private http: HttpClient, private router: Router, private errorService: ErrorService) { }

  loginSubmitHandler() {
    this.submitted = true;
    const form = this.form!;
    if (form.invalid || this.isInvalidUsername()) {
      return;
    }
    const formData = form.value;

    this.http.post('http://localhost:5000/api/auth/login', formData, { withCredentials: true }).subscribe({
      next: (response) => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.errorService.setError(error.error.error);
      },
    });
  }

  isInvalidUsername(): boolean {
    const username = this.form?.value.username;
    return Boolean(username && !/^[a-zA-Z0-9_]+$/.test(username));
  }
}