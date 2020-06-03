import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  name = '';
  email = '';
  password = '';
  password1 = '';
  isSeller = false;
  btnDisabled = false;
  constructor(
    private router: Router,
    private data: DataService,
    private rest: RestApiService
  ) {}

  ngOnInit(): void {}
  get token() {
    return localStorage.getItem('token');
  }
  validate() {
    if (this.name) {
      if (this.email) {
        if (this.password) {
          if (this.password1) {
            if (this.password === this.password1) {
              return true;
            } else {
              this.data.error('Passwords do NOT match');
            }
          } else {
            this.data.error('Confirmation Password is NOT entered');
          }
        } else {
          this.data.error('Password is NOT Entered');
        }
      } else {
        this.data.error('Email is NOT entered');
      }
    } else {
      this.data.error('Name is NOT entered');
    }
  }

  async register() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        const data = await this.rest.post(
          'http://localhost:9000/api/accounts/signup',
          {
            name: this.name,
            email: this.email,
            password: this.password,
            isSeller: this.isSeller,
          }
        );
        if (data['success']) {
          localStorage.setItem('token', data['token']);
          this.router
            .navigate(['profile/address'])
            .then(() => {
              this.data.success(
                'Registration Successful ! Please enter Your Shipping Address'
              );
            })
            .catch((error) => this.data.error(error));
          await this.data.getProfile();
        } else {
          this.data.error(data['message']);
        }
      }
    } catch (error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }
}
