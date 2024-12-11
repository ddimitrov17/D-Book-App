import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../../error.service';
import { ErrorComponent } from '../../error/error.component';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule,ErrorComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  @ViewChild('RegisterForm') form: NgForm | undefined;
  submitted: boolean = false;

  constructor(private http: HttpClient, private router: Router, private errorService: ErrorService) {}

  registerSubmitHandler() {
    this.submitted = true;
    const form = this.form!;
    
    if (form.invalid || this.isPasswordsMismatch() || this.isInvalidEmail() || this.isInvalidUsername()) {
      this.errorService.setError('Form is invalid!');
      return;
    }

    const formData = form.value;
    this.http.post('http://localhost:5000/api/auth/signup', formData, {
      withCredentials: true,
    }).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.errorService.setError(error.error.error);
      },
    });
  }

  isPasswordsMismatch(): boolean {
    const password = this.form?.value.password;
    const repeatPassword = this.form?.value.repeat_password;
    return Boolean(password && repeatPassword && password !== repeatPassword);
  }

  isInvalidEmail(): boolean {
    const email = this.form?.value.email;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return Boolean(email && !emailPattern.test(email));
  }

  isInvalidUsername(): boolean {
    const username = this.form?.value.username;
    return Boolean(username && !/^[a-zA-Z0-9_]+$/.test(username));
  }
}