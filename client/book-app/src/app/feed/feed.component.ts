import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReviewCardComponent } from './review-card/review-card.component';

interface Review {
  book_title: string;
  book_author: string;
  book_photo: string;
  review_content: string;
  creator_id: string;
  id: string;
  creator: {
    username: string;
  }
}

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, ReviewCardComponent],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  reviews: Review[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http
      .get<Review[]>('http://localhost:5000/api/reviews/get-reviews-in-feed', { withCredentials: true })
      .subscribe({
        next: (response) => {
          this.reviews = response;
        },
        error: (err) => {
          console.error('Error fetching reviews:', err);
        },
      });
  }
}