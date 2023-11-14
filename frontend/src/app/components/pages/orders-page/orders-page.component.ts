import {  Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css'],
})
export class OrdersPageComponent implements OnInit{
  orders!: Order[];
  constructor(private orderService: OrderService, private router: Router, private toasterService: ToastrService) {}

  ngOnInit(): void {
    this.orderService.getAllOrdersForCurrentUser().subscribe({
      next: (item) => {
        console.log(item)
        this.orders = item;
      },
      error: (err) => {
        this.toasterService.error('Failed to load the orders. Try again later!', 'Connection failed')
        this.router.navigateByUrl('/cart-page');
      },
    });
  }
}
