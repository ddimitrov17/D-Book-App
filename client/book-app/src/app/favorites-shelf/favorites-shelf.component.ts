import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
import { ErrorService } from '../error.service';
import { ErrorComponent } from '../error/error.component';

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
  selector: 'app-favorites-shelf',
  imports: [CommonModule,RouterLink,LoadingComponent, ErrorComponent],
  templateUrl: './favorites-shelf.component.html',
  styleUrl: './favorites-shelf.component.css'
})
export class FavoritesShelfComponent implements OnInit {
  books: FormattedBook[] = [];
  bookRows: FormattedBook[][] = [];
  isLoading: boolean = true;

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  ngOnInit() {
    this.http.get<string[]>('http://localhost:5000/api/reviews/get-favorites-shelf', { withCredentials: true })
      .subscribe({
        next: (bookIds) => {
          if (Array.isArray(bookIds) && bookIds.length > 0) {
            this.fetchBooks(bookIds);
          }
        },
        error: (error) => {
          this.errorService.setError(error.error.error);
        },
      });
  }

  fetchBooks(bookIds: string[]) {
    bookIds.forEach((id) => {
      this.http.get<BookVolume>(`https://www.googleapis.com/books/v1/volumes/${id}`)
        .subscribe({
          next: (book) => {
            const formattedBook: FormattedBook = {
              id: book.id,
              title: book.volumeInfo?.title || 'Untitled',
              author: book.volumeInfo?.authors?.join(', ') || 'Unknown Author',
              thumbnail: book.volumeInfo?.imageLinks?.thumbnail || '',
            };
            this.books.push(formattedBook);
            this.updateBookRows(); 
            this.isLoading = false;
          },
          error: (error) => {
            this.errorService.setError(error.error.error);
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
