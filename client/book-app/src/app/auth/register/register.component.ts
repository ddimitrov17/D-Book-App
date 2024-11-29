import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
})
export class RegisterComponent {
  @ViewChild('RegisterForm') form: NgForm | undefined;

  constructor(private http: HttpClient, private router: Router) { }

  registerSubmitHandler() {
    const form = this.form!;
    if (form.invalid) {
      console.log('This form is invalid!');
      return;
    }
    const formData = form.value;

    this.http.post('http://localhost:5000/api/auth/signup', formData, { withCredentials: true }).subscribe({
      next: (response) => {
        console.log('Registration successful:', response); //TODO: Remove
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Registration failed:', err); //TODO: Add Error Handling
      },
    });

  }
}
