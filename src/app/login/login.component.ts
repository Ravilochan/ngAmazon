import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  btnDisabled = false;
  constructor(
    private router: Router,
    private data: DataService,
    private rest: RestApiService
  ) {}

  ngOnInit(): void {}

  validate() {
    if (this.email) {
      if (this.password) {
        return true;
      } else {
        this.data.error('Password is NOT entered');
      }
    } else {
      this.data.error('Email is NOT entered');
    }
  }

  async login() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        const data = await this.rest.post(
          'http://localhost:9000/api/accounts/login',
          {
            email: this.email,
            password: this.password,
          }
        );
        if (data['success']) {
          localStorage.setItem('token', data['token']);
          await this.data.getProfile();
          this.router.navigate(['/']);
        } else {
          this.data.error(data['message']);
        }
      } else {
        console.log('Else Part');
        this.data.error(this.data['message']);
      }
    } catch (error) {
      this.data.error(error[error]);
    }
    this.btnDisabled = false;
  }
}
