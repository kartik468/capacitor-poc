import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { MessagingService } from '../messaging.service';
import { SpinnerUiService } from '../spinner-ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formUser = {
    email: 'testuser1@test.com',
    password: 'testuser1'
  };

  constructor(
    public auth: AuthService,
    public msgService: MessagingService,
    private router: Router,
    private uiService: SpinnerUiService
  ) {}

  ngOnInit() {}

  onSignInButtonClick() {
    this.msgService.openSnackBar('signing in', '');
    this.uiService.showSpinner();
    this.auth.signIn(this.formUser).then(() => {
      this.uiService.stopSpinner();
      // this.formUser = {
      //   email: '',
      //   password: ''
      // };
      this.router.navigate(['/user-profile']);
    });
  }
}
