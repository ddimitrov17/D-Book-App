import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';

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
  imports: [CommonModule,LoadingComponent],
  templateUrl: './personal-profile.component.html',
  styleUrls: ['./personal-profile.component.css']
})
export class PersonalProfileComponent implements OnInit {
  user: User | null = null;
  reviews: Review[] = [];
  isLoading:boolean =true;
  numberOfReviews: number = 0;
  readingListCount: number = 0;
  favoritesCount: number = 0;

  constructor(private http: HttpClient,private router: Router) {}

  ngOnInit() {
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
        .get<any>(`http://localhost:5000/api/reviews/get-reviews-of-user`, { withCredentials: true })
        .subscribe({
          next: (response) => {
            // console.log(response)
            this.reviews = response.reviews;
            this.numberOfReviews = response.reviews.length;
            this.readingListCount = response.numbers[0];
            this.favoritesCount = response.numbers[1];
            // console.log('User reviews:', this.reviews);
            this.isLoading=false;
          },
          error: (err) => {
            console.error('Error fetching reviews:', err);
          },
        });
    }
  }

  showDetails(reviewId: string) {
    this.router.navigate(['/review-details', reviewId]);
  }
}