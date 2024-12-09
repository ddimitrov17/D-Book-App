import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';
import { FormsModule, NgForm } from '@angular/forms';

interface Review {
  review_content: string;
  book_title: string; 
  book_photo?: string; 
  book_author?: string; 
  book_id?: string; 
  id: string;
}

interface Book {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    publisher?: string;
    language?: string;
    industryIdentifiers?: { type: string; identifier: string }[];
  };
}

interface State {
  readingListState: boolean;
  favoritesListState: boolean;
}

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class BookDetailsComponent implements OnInit {
  @ViewChild('CreateReviewForm') form: NgForm | undefined;
  book: Book | null = null;
  isModalOpen: boolean = false;
  isInTheReadingList: boolean = false;
  isInTheFavorites: boolean = false;
  placeholderImage: string = ''; // TODO: Add placeholder image

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  createReviewSubmitHandler() {
    const form = this.form!;
    if (form.invalid) {
      console.log('This form is invalid!');
      return;
    }
    const formData = form.value;
    formData.book_title = this.book?.volumeInfo?.title ?? 'Untitled';
    formData.book_photo = this.book?.volumeInfo?.imageLinks?.thumbnail || this.placeholderImage;
    formData.book_author = this.book?.volumeInfo?.authors?.join(', ') || 'Unknown Author';
    formData.book_id = this.book?.id || '';
    console.log(formData);
    
    this.http.post('http://localhost:5000/api/reviews/create-review', formData, { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('Review created:', response);
          this.closeModal();
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Review creation failed:', err);
        },
      });
  }
  
  ngOnInit() {
    this.route.params.pipe(
      switchMap(params => {
        const bookId = params['id'];
        return this.http.get<Book>(`https://www.googleapis.com/books/v1/volumes/${bookId}`).pipe(
          tap(bookResponse => {
            this.book = bookResponse;
          }),
          switchMap(() => {
            if (this.book?.id) {
              return this.http.get<State>(`http://localhost:5000/api/reviews/get-state-of-reading-and-favorites/${this.book.id}`, { withCredentials: true });
            } else {
              throw new Error('Book data is null');
            }
          })
        );
      })
    ).subscribe({
      next: (state: State) => {
        console.log(state)
        this.isInTheReadingList = state.readingListState;
        this.isInTheFavorites = state.favoritesListState;
        console.log(this.isInTheReadingList)
        console.log(this.isInTheFavorites)
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }
  
}