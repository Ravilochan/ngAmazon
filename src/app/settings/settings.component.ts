import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  btnDisabled = false;
  currentSettings: any;
  constructor(private data: DataService, private rest: RestApiService) {}

  async ngOnInit() {
    try {
      if (!this.data.user) {
        await this.data.getProfile();
      }
      this.currentSettings = Object.assign(
        {
          newPwd: '',
          pwdConfirm: '',
        },
        this.data.user
      );
    } catch (error) {
      this.data.error(error);
    }
  }

  validate(settings) {
    if (settings['name']) {
      if (settings['email']) {
        if (settings['newPwd']) {
          if (settings['pwdConfirm']) {
            if (settings['newPwd'] === settings['pwdConfirm']) {
              return true;
            } else {
              this.data.error('Passwords do NOT match');
            }
          } else {
            this.data.error('Please Enter confirmation password');
          }
        } else {
          if (!settings['pwdConfirm']) {
            return true;
          } else {
            this.data.error('Please Enter New Password');
          }
        }
      } else {
        this.data.error('Please Enter your Email');
      }
    } else {
      this.data.error('Please Enter your Name');
    }
  }

  async update() {
    this.btnDisabled = true;
    try {
      if (this.validate(this.currentSettings)) {
        const data = await this.rest.post(
          'http://localhost:9000/api/accounts/profile',
          {
            name: this.currentSettings['name'],
            email: this.currentSettings['email'],
            password: this.currentSettings['newPwd'],
            isSeller: this.currentSettings['isSeller'],
          }
        );
        data['success']
          ? (this.data.getProfile(), this.data.success(data['success']))
          : this.data.error(data['message']);
      }
    } catch (error) {
      this.data.error(error['messsage']);
    }
    this.btnDisabled = false;
  }
}
