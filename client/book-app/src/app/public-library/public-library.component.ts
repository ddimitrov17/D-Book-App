import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BookItemComponent } from './book-item/book-item.component';

interface BookVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
  };
} 

interface GoogleBooksResponse {
  items: BookVolume[];
}

@Component({
  selector: 'app-public-library',
  imports: [FormsModule,CommonModule,BookItemComponent],
  templateUrl: './public-library.component.html',
  styleUrl: './public-library.component.css'
})
export class PublicLibraryComponent {
  @ViewChild('BookSearchForm') form: NgForm | undefined;
  books: BookVolume[] = [];

  constructor(private http: HttpClient) { }

  searchSubmitHandler() {
    const form = this.form!;
    if (form.invalid) {
      return;
    }

    const formData = form.value;

    this.http
      .get<GoogleBooksResponse>(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(formData.searchTerm)}`)
      .subscribe({
        next: (response) => {
          this.books = response.items || [];  
        },

        error: (err) => {
          console.error('Error fetching books:', err);
          this.books = [];
        },
      });
  }
}