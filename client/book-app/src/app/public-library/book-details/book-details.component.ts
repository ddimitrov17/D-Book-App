import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class BookDetailsComponent implements OnInit {
  book: any; //TODO: Add interface 
  loading = true;
  error: string | null = null;

  isModalOpen = false; 
  openModal() {
    this.isModalOpen = true; 
  }
  closeModal() {
    this.isModalOpen = false; 
  }

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      switchMap(params => {
        const bookId = params['id'];
        return this.http.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
      })
    ).subscribe({
      next: (response: any) => {
        this.book = response;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load book details';
        this.loading = false;
        console.error('Error fetching book details:', error);
      }
    });
  }
  placeholderImage = '';
}
