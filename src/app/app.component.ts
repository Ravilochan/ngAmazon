import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ngAmazon';
  searchTerm = '';
  isCollapsed = true;

  get token() {
    return localStorage.getItem('token');
  }
  collapse() {
    this.isCollapsed = true;
  }

  closeDropdown(dropdown) {
    dropdown.close();
  }
  logout() {}
  search() {}
}
