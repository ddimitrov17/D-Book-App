import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

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
    publisher?: string;
  };
} //TODO EDIT 

interface GoogleBooksResponse {
  kind: string;
  totalItems: number;
  items: BookVolume[];
}

@Component({
  selector: 'app-public-library',
  imports: [FormsModule],
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
      console.log('This form is invalid!');
      return;
    }

    const formData = form.value;

    this.http
      .get<GoogleBooksResponse>(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(formData.searchTerm)}`)
      .subscribe({
        next: (response) => {
          this.books = response.items || [];  
          console.log(this.books)
        },
        error: (err) => {
          console.error('Error fetching books:', err);
          this.books = [];
        },
      });
  }
}