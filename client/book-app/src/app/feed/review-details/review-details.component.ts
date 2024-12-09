import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Review {
  book_title: string;
  book_author: string;
  book_photo: string;
  review_content: string;
  creator_id: string;
  id: string;
  creator: {
    username: string;
  };
}

@Component({
  selector: 'app-review-details',
  imports: [CommonModule,FormsModule],
  templateUrl: './review-details.component.html',
  styleUrls: ['./review-details.component.css']
})
export class ReviewDetailsComponent implements OnInit {
  review: Review | null = null;
  isEditModalOpen = false;
  isDeleteModalOpen = false;
  editedReviewContent = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  openEditModal() {
    if (this.review) {
      this.editedReviewContent = this.review.review_content; 
    }
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  openDeleteModal() {
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const reviewId = params['id'];
      this.http.get<Review>(`http://localhost:5000/api/reviews/get-review/${reviewId}`, { withCredentials: true })
        .subscribe({
          next: (review) => {
            this.review = review;
          },
          error: (err) => {
            console.error('Error fetching review:', err);
          }
        });
    });
  }

  editReview() {
    if (this.review) {
      const updatedReview = { review_content: this.editedReviewContent }; 
      this.http.put(`http://localhost:5000/api/reviews/update-review/${this.review.id}`, updatedReview, { withCredentials: true })
        .subscribe({
          next: () => {
            this.review!.review_content = this.editedReviewContent; 
            this.isEditModalOpen = false;
          },
          error: (err) => {
            console.error('Error updating review:', err);
          }
        });
    }
  }
}

