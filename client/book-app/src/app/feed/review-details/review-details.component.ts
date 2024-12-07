import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  selector: 'app-review-details',
  imports: [CommonModule],
  templateUrl: './review-details.component.html',
  styleUrls: ['./review-details.component.css']
})
export class ReviewDetailsComponent implements OnInit {
  review: Review | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const reviewId = params['id'];
      // Add endpoint to fetch single review
      this.http.get<Review>(`http://localhost:5000/api/reviews//get-review/${reviewId}`, { withCredentials: true })
        .subscribe({
          next: (review) => {
            this.review = review;
            console.log(this.review)
          },
          error: (err) => {
            console.error('Error fetching review:', err);
          }
        });
    });
  }
}