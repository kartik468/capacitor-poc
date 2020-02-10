import { Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatSpinner } from '@angular/material/progress-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerUiService {
  private spinnerTopRef = this.cdkSpinnerCreate();

  constructor(private overlay: Overlay) {}

  private cdkSpinnerCreate() {
    return this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically()
    });
  }

  showSpinner() {
    console.log('attach');
    this.spinnerTopRef.attach(new ComponentPortal(MatSpinner));
  }

  stopSpinner() {
    console.log('dispose');
    this.spinnerTopRef.detach();
  }
}
