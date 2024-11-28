import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainPaneComponent } from './main-pane/main-pane.component';
import { NavigationPaneComponent } from './navigation-pane/navigation-pane.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,MainPaneComponent,NavigationPaneComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
