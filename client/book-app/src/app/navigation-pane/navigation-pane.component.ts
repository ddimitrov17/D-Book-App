import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth-service.service';

@Component({
  selector: 'app-navigation-pane',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navigation-pane.component.html',
  styleUrl: './navigation-pane.component.css'
})
export class NavigationPaneComponent {
  constructor(public AuthService: AuthService) {}
}