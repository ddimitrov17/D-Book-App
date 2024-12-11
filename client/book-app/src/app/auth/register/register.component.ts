import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
})
export class RegisterComponent {
  @ViewChild('RegisterForm') form: NgForm | undefined;
  submitted: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  registerSubmitHandler() {
    this.submitted = true;
    const form = this.form!;
    
    if (form.invalid || this.isPasswordsMismatch() || this.isInvalidEmail() || this.isInvalidUsername()) {
      return; // TODO: Handle 
    }

    const formData = form.value;
    this.http.post('http://localhost:5000/api/auth/signup', formData, {
      withCredentials: true,
    }).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
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