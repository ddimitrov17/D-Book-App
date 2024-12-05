import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class BookDetailsComponent implements OnInit {
  @ViewChild('CreateReviewForm') form: NgForm | undefined;
  book: any;
  loading = true;
  error: string | null = null;
  isModalOpen = false;
  placeholderImage = ''; //TODO: Add placeholder image

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

    formData.book_title = this.book.volumeInfo?.title;
    formData.book_photo = this.book.volumeInfo?.imageLinks?.thumbnail || this.placeholderImage;
    formData.book_author = this.book.volumeInfo?.authors?.join(', ') || 'Unknown Author';
    console.log(formData)
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

  addToReadingListHandler() {
    
  }

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
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }
}