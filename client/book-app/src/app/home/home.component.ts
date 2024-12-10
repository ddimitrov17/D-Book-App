import { Component } from '@angular/core';
import { NavigationPaneComponent } from '../navigation-pane/navigation-pane.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [NavigationPaneComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
}