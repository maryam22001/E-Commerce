import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discount',
  standalone: true
})
export class DiscountPipe implements PipeTransform {
  transform(value: number, discount: number = 30): number {
    return value - (value * (discount / 100));
  }
}