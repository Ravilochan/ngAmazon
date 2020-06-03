import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss'],
})
export class PhoneComponent implements OnInit {
  btnDisabled = false;
  currentPhone: any;
  constructor(private data: DataService, private rest: RestApiService) {}

  async ngOnInit() {
    try {
      const data = await this.rest.get(
        'http://localhost:9000/api/accounts/address'
      );
      if (!data['phone']) {
        this.data.warning(
          'You have not Entered your Phone Number . Please Enter Your Phone Number'
        );
      }
      this.currentPhone = data['phone'];
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  async updatePhone() {
    this.btnDisabled = true;
    try {
      const res = await this.rest.post(
        'http://localhost:9000/api/accounts/address',
        { phone: this.currentPhone }
      );
      res['success']
        ? (this.data.success(res['message']), await this.data.getProfile())
        : this.data.error(res['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }
}
