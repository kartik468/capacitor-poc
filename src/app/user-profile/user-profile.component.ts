import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { MessagingService } from '../messaging.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  constructor(public auth: AuthService, public msgService: MessagingService) {}


  ngOnInit() {
    // this.subscribe();
  }

  subscribe() {
    this.msgService.getPermission();
    this.msgService.receiveMessages();
  }

  onPushMessageClick() {
    // this.msgService.sendPushMessage('first title', 'first message');
  }
}
