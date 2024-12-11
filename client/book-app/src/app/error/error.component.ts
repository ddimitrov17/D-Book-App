import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../error.service'; 

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  errorMessage: string | null = null;

  constructor(private errorService: ErrorService) {}

  ngOnInit() {
    this.errorService.error.subscribe((message: string | null) => {
      this.errorMessage = message;
      if (message) {
        setTimeout(() => this.clearError(), 5000);
      }
    });
  }

  clearError() {
    this.errorService.clearError();
  }
}