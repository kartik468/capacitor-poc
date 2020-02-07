import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MessagingService } from '../messaging.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  constructor(public auth: AuthService, private msgService: MessagingService) { }

  formUser = {
    email: 'testuser1@test.com',
    password: 'testuser1'
  };

  ngOnInit() {
  }

  onSignInButtonClick() {
    this.auth.signIn(this.formUser).then(() => {
      this.formUser = {
        email: '',
        password: ''
      };
    });
  }

  onSubscribeClick() {
    this.msgService.getPermission();
    this.msgService.receiveMessages();
  }

  onPushMessageClick() {
    this.msgService.sendPushMessage('first title', 'first message');
  }

}
