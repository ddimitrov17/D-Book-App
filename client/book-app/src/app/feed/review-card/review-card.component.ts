import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


interface Review {
  id: string;
  book_title: string;
  book_author: string;
  book_photo: string;
  review_content: string;
  creator_id: string;
  book_id: string | null;
  liked_by: string | null;
  creator: {
    username: string;
  };
}

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.css'
})
export class ReviewCardComponent implements OnInit {
  @Input() review!: Review;

  isLiked: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  showDetails() {
    this.router.navigate(['/review-details', this.review.id]);
  }

  ngOnInit() {
    this.http
      .get<string[]>('http://localhost:5000/api/reviews/get-user-likes', { withCredentials: true })
      .subscribe({
        next: (response) => {
          // console.log('Likes fetched:', response);
          this.isLiked = response.includes(this.review.id);
        },
        error: (err) => {
          console.error('Error fetching likes:', err);
        },
      });
  }

  toggleLikeButton() {
    this.isLiked = !this.isLiked;
    this.http
      .post('http://localhost:5000/api/reviews/like-review', { review_id: this.review?.id }, { withCredentials: true })
      .subscribe({
        next: (response) => {
          // console.log('Likes updated:', response);        
        },
        error: (err) => {
          console.error('Error updating likes:', err);
          this.isLiked = !this.isLiked;
        },
      });
  }
}