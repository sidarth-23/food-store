import { Injectable } from '@angular/core';
import { Cart } from '../shared/models/Cart';
import { BehaviorSubject, Observable } from 'rxjs';
import { Food } from '../shared/models/Food';
import { CartItem } from '../shared/models/CartItem';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Cart = this.getCartFromLocalStorage();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);

  constructor(private toastrService: ToastrService) {}

  addToCart(food: Food): void {
    let cartItem = this.cart.item.findIndex((item) => item.food.id === food.id);
    if (cartItem !== -1) {
      this.cart.item[cartItem].quantity += 1
      this.toastrService.success('Quantity added successfully', 'Item Added')
      return;
    } else {
      this.cart.item.push(new CartItem(food));
      this.toastrService.success('Item successfully added to cart', 'Item Added')
    }
    this.setCartToLocalStorage();
  }

  removeFromCart(foodId: string): void {
    this.cart.item = this.cart.item.filter((item) => item.food.id != foodId);
    this.toastrService.warning('Item deleted from cart', 'Item Removed')
    this.setCartToLocalStorage();
  }

  changeQuantity(foodId: string, quantity: number) {
    let cartItem = this.cart.item.find((item) => item.food.id === foodId);
    if (!cartItem) return;

    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.food.price;
    this.setCartToLocalStorage();
  }

  clearCart() {
    this.cart = new Cart();
    this.setCartToLocalStorage();
  }

  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  getCart(): Cart {
    return this.cartSubject.value;
  }

  private setCartToLocalStorage(): void {
    this.cart.totalPrice = this.cart.item.reduce(
      (prev, cur) => prev + cur.price,
      0
    );

    this.cart.totalCount = this.cart.item.reduce(
      (prev, cur) => prev + cur.quantity,
      0
    );
    const cartJson = JSON.stringify(this.cart);
    localStorage.setItem('Cart', cartJson);
    this.cartSubject.next(this.cart);
  }

  private getCartFromLocalStorage(): Cart {
    const cartJson = localStorage.getItem('Cart');
    return cartJson ? JSON.parse(cartJson) : new Cart();
  }
}
