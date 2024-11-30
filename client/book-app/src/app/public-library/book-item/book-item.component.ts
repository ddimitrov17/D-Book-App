import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

interface VolumeInfo {
  title: string;
  authors?: string[];
  description?: string;
  imageLinks?: {
    thumbnail?: string;
  };
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
}

interface Book {
  id: string;
  volumeInfo: VolumeInfo;
}

@Component({
  selector: 'app-book-item',
  templateUrl: './book-item.component.html',
  styleUrls: ['./book-item.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class BookItemComponent {
  @Input() book!: Book;

  placeholderImage = '';
}