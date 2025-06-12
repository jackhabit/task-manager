import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-new-item',
  imports: [RouterLink, FormsModule],
  templateUrl: './new-item.component.html',
  styleUrl: './new-item.component.scss'
})
export class NewItemComponent {
  title = '';

  constructor(private router: Router) {}

  createList() {
    if (this.title.trim()) {
      this.router.navigate(['/'], { state: { newListTitle: this.title } });
    }
  }
}
