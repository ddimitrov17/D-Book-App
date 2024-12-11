import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth-service.service';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './review-details.component.html',
  styleUrl: './review-details.component.css'
})
export class ReviewDetailsComponent implements OnInit {
  review: Review | null = null;
  isEditModalOpen = false;
  isDeleteModalOpen = false;
  editedReviewContent = '';
  isAuthor: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
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
      this.fetchReview(reviewId);
    });
  }

  fetchReview(reviewId: string) {
    this.http.get<Review>(`http://localhost:5000/api/reviews/get-review/${reviewId}`, { withCredentials: true })
      .subscribe({
        next: (review) => {
          this.review = review;

          this.authService.getCurrentUser().then((user) => {
            if (user) {
              this.isAuthor = user.id === this.review?.creator_id;
            }
          }).catch((err) => {
            console.error('Error fetching current user:', err);
          });
        },
        error: (err) => {
          console.error('Error fetching review:', err);
        }
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

  deleteReview() {
    if (this.review) {
      this.http.delete(`http://localhost:5000/api/reviews/delete-review/${this.review.id}`, { withCredentials: true })
        .subscribe({
          next: () => {
            this.isDeleteModalOpen = false;
            this.router.navigate(['/home']);
          },
          error: (err) => {
            console.error('Error deleting review:', err);
          }
        });
    }
  }
}
