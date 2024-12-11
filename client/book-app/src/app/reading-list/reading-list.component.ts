import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';

interface BookVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
  };
}

interface FormattedBook {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
}

@Component({
  selector: 'app-reading-list',
  imports: [CommonModule,RouterLink,LoadingComponent],
  templateUrl: './reading-list.component.html',
  styleUrl: './reading-list.component.css',
})
export class ReadingListComponent implements OnInit {
  books: FormattedBook[] = []; 
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<string[]>('http://localhost:5000/api/reviews/get-reading-list', { withCredentials: true })
      .subscribe({
        next: (bookIds) => {
          if (Array.isArray(bookIds) && bookIds.length > 0) {
            this.fetchBooks(bookIds);
          } else {
            this.isLoading=false;
          }
        },
        error: (err) => {
          console.error('Error fetching reading list:', err);
        },
      });
  }

  fetchBooks(bookIds: string[]) {
    bookIds.forEach((id) => {
      this.http.get<BookVolume>(`https://www.googleapis.com/books/v1/volumes/${id}`)
        .subscribe({
          next: (book) => {
            const formattedBook = {
              id: book.id,
              title: book.volumeInfo?.title || 'Untitled',
              author: book.volumeInfo?.authors?.join(', ') || 'Unknown Author',
              thumbnail: book.volumeInfo?.imageLinks?.thumbnail || '',
            };
            this.books.push(formattedBook);
            this.isLoading=false;
          },
          error: (err) => {
            console.error(`Error fetching book with ID ${id}:`, err);
          },
        });
    });
  }
}
