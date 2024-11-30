import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

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
  volumeInfo: VolumeInfo;
}

@Component({
  selector: 'app-book-item',
  templateUrl: './book-item.component.html',
  styleUrls: ['./book-item.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class BookItemComponent {
  @Input() book!: Book;
  
  placeholderImage = '';
}