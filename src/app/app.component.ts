import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Application Home';

  constructor(public auth: AuthService) {}

  // onSignInButtonClick() {
  //   this.auth.signIn();
  // }

  onSignOutButtonClick() {
    this.auth.signOut();
  }
}
