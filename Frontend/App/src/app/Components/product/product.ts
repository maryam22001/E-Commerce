import { Component, OnInit} from '@angular/core';
import { Card } from '../card/card';
import { Iproduct } from '../../interfaces/iproduct';
import { products } from '../../data/products';
import { CustomDirective } from './Custom_dirctive';
import { DiscountPipe } from './Custom_Pipe';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product',
  imports: [Card, CustomDirective, DiscountPipe, CurrencyPipe],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product implements OnInit {
  stringFromCard!:string
  recieve(value:string){
    this.stringFromCard=value
  }
 product:Iproduct []=[]
 ngOnInit():void{
  this.product=products

 }



}
