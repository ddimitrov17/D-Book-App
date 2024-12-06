import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';


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
  imports: [CommonModule],
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
        next: (response: any[]) => {
          this.reviews = response;
          console.log(this.reviews) //TODO: REMOVE
        },
        error: (err: any) => {
          console.error('Error fetching reviews:', err);
        },
      });
  }
}