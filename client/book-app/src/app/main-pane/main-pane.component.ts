import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReviewCardComponent } from '../feed/review-card/review-card.component';
import { LoadingComponent } from '../loading/loading.component';

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
  selector: 'app-main-pane',
  imports: [CommonModule, ReviewCardComponent, LoadingComponent],
  templateUrl: './main-pane.component.html',
  styleUrl: './main-pane.component.css'
})
export class MainPaneComponent implements OnInit {
  topReviews: Review[] = [];
  n: number = 5;
  isLoading: boolean = true;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchTopLikedReviews();
  }

  private fetchTopLikedReviews() {
    this.http.post<Review[]>('http://localhost:5000/api/reviews/get-most-liked', { n: this.n }, { 
      withCredentials: true 
    }).subscribe({
      next: (reviews) => {
        this.topReviews = reviews;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching top liked reviews:', err);
        this.isLoading = false;
      },
    });
  }
}