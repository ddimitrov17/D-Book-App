import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReviewCardComponent } from './review-card/review-card.component';
import { LoadingComponent } from '../loading/loading.component';
import { ErrorService } from '../error.service';
import { ErrorComponent } from '../error/error.component';

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
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, ReviewCardComponent,LoadingComponent, ErrorComponent],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  reviews: Review[] = [];
  isLoading: boolean = true;

  constructor(private http: HttpClient, public errorService: ErrorService) { }

  ngOnInit() {
    this.http
      .get<Review[]>('http://localhost:5000/api/reviews/get-reviews-in-feed', { withCredentials: true })
      .subscribe({
        next: (response) => {
          this.reviews = response;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorService.setError(error.error.error);
        },
      });
  }
}