import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex justify-content-center align-items-center py-5" *ngIf="show">
      <div class="spinner-border text-primary" role="status" [style.width.rem]="size" [style.height.rem]="size">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `
})
export class Spinner {
  @Input() show = true;
  @Input() size = 3;
}
