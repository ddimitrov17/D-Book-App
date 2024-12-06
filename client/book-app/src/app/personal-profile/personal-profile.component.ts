import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface User {
  username: string;
  full_name: string;
  email: string;
  id: string;
}

@Component({
  selector: 'app-personal-profile',
  imports: [CommonModule],
  templateUrl: './personal-profile.component.html',
  styleUrls: ['./personal-profile.component.css']
})
export class PersonalProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<User>('http://localhost:5000/api/auth/validate', { withCredentials: true })
      .subscribe({
        next: (response) => {
          this.user = response;
          // console.log(this.user.full_name)
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
        },
      });
  }
}