import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @ViewChild('LoginForm') form: NgForm | undefined;

  constructor(private http: HttpClient, private router: Router) { }

  loginSubmitHandler() {
    const form = this.form!;
    if (form.invalid) {
      console.log('This form is invalid!');
      return;
    }
    const formData = form.value;

    this.http.post('http://localhost:5000/api/auth/login', formData, { withCredentials: true }).subscribe({
      next: (response) => {
        console.log('Login successful:', response); //TODO: Remove

        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Login failed:', err); //TODO: Add Error Handling
      },
    });

  }
}
