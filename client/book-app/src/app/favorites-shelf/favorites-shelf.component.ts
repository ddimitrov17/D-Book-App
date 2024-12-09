import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites-shelf',
  imports: [CommonModule,RouterLink],
  templateUrl: './favorites-shelf.component.html',
  styleUrl: './favorites-shelf.component.css'
})
export class FavoritesShelfComponent implements OnInit {
  books: any[] = []; //TODO: Add INTERFACE
  bookRows: any[][] = []; //TODO: Add INTERFACE

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<string[]>('http://localhost:5000/api/reviews/get-favorites-shelf', { withCredentials: true })
      .subscribe({
        next: (bookIds) => {
          if (Array.isArray(bookIds) && bookIds.length > 0) {
            this.fetchBooks(bookIds);
          }
        },
        error: (err) => {
          console.error('Error fetching favorites shelf:', err);
        },
      });
  }

  fetchBooks(bookIds: string[]) {
    bookIds.forEach((id) => {
      this.http.get<any>(`https://www.googleapis.com/books/v1/volumes/${id}`)
        .subscribe({
          next: (book) => {
            const formattedBook = {
              id: book.id,
              title: book.volumeInfo?.title || 'Untitled',
              author: book.volumeInfo?.authors?.join(', ') || 'Unknown Author',
              thumbnail: book.volumeInfo?.imageLinks?.thumbnail || '',
            };
            this.books.push(formattedBook);
            this.updateBookRows(); 
          },
          error: (err) => {
            console.error(`Error fetching book with ID ${id}:`, err);
          },
        });
    });
  }

  updateBookRows() {
    this.bookRows = [];
    for (let i = 0; i < this.books.length; i += 5) {
      this.bookRows.push(this.books.slice(i, i + 5));
    }
  }
}
