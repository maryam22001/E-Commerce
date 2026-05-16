import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-manager.html'
})
export class OrderManager implements OnInit {
  orders: any[] = [];

  ngOnInit(): void {
    this.orders = JSON.parse(localStorage.getItem('orders') || '[]').reverse();
  }

  updateStatus(orderId: string, status: string): void {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const idx = orders.findIndex((o: any) => o.id === orderId);
    if (idx > -1) {
      orders[idx].status = status;
      localStorage.setItem('orders', JSON.stringify(orders));
      this.orders = orders.slice().reverse();
    }
  }

  statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
}
