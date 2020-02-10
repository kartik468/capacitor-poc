import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { UpdateService } from './update.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'Application Home 2';

    constructor(private update: UpdateService, public auth: AuthService, private router: Router) {}

    // onSignInButtonClick() {
    //   this.auth.signIn();
    // }

    onSignOutButtonClick() {
        this.auth.signOut();
        this.router.navigate(['/login']);
    }
}
