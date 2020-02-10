import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class UpdateService {
    constructor(private swUpdate: SwUpdate, private snackbar: MatSnackBar) {
        if (!this.swUpdate.isEnabled) {
            console.log('Service worker is not currently enabled 🙁');
        }
        this.swUpdate.available.subscribe(evt => {
            const snack = this.snackbar.open('Update Available', 'Reload', {
                duration: 30000
            });

            snack.onAction().subscribe(() => {
                window.location.reload();
            });

            // snack.setTimeout(() => {
            //   snack.dismiss();
            // }, 6000);
        });
    }
}
