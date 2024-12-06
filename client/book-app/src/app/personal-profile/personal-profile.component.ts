import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface User {
  username: string;
  full_name: string;
  email: string;
  id: string;
}

interface Review {
  book_title: string;
  book_author: string;
  book_photo: string;
  review_content: string;
  creator_id: string;
  id: string;
}

@Component({
  selector: 'app-personal-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personal-profile.component.html',
  styleUrls: ['./personal-profile.component.css']
})
export class PersonalProfileComponent implements OnInit {
  user: User | null = null;
  reviews: Review[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Fetch user data
    this.http
      .get<User>('http://localhost:5000/api/auth/validate', { withCredentials: true })
      .subscribe({
        next: (response) => {
          this.user = response;
          this.fetchUserReviews();
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
        },
      });
  }

  private fetchUserReviews() {
    if (this.user) {
      this.http
        .get<Review[]>(`http://localhost:5000/api/reviews/get-reviews-of-user`, { withCredentials: true })
        .subscribe({
          next: (reviews) => {
            this.reviews = reviews;
            console.log('User reviews:', this.reviews);
          },
          error: (err) => {
            console.error('Error fetching reviews:', err);
          },
        });
    }
  }
}