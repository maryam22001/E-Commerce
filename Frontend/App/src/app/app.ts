import { Component, signal } from '@angular/core';
import { Card } from './Components/card/card';
import { Product } from './Components/product/product';
@Component({
  selector: 'app-root',
  imports: [ Product],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('App');
}
