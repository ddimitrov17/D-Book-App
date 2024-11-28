import { Component } from '@angular/core';
import { MainPaneComponent } from '../main-pane/main-pane.component';
import { NavigationPaneComponent } from '../navigation-pane/navigation-pane.component';

@Component({
  selector: 'app-home',
  imports: [MainPaneComponent,NavigationPaneComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
