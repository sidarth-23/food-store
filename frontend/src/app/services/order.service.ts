import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../shared/models/Order';
import {
  ORDER_ALL_FOR_CURRENT_USER_URL,
  ORDER_CREATE_URL,
  ORDER_NEW_FOR_CURRENT_USER_URL,
} from '../shared/constants/urls';
import { Observable } from 'rxjs';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient, private cartService: CartService) {}

  create(order: Order) {
    this.cartService.clearCart()
    return this.http.post<Order>(ORDER_CREATE_URL, order);
  }

  getNewOrderForCurrentUser(): Observable<Order> {
    return this.http.get<Order>(ORDER_NEW_FOR_CURRENT_USER_URL);
  }

  getAllOrdersForCurrentUser(): Observable<Order[]> {
    return this.http.get<Order[]>(ORDER_ALL_FOR_CURRENT_USER_URL)
  }
}
