import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnChanges{

  authState!: boolean
  cartQuantity=0;
  user!:User;
  constructor(private cartService:CartService,private userService:UserService) {
   }

   ngOnInit(): void {
    this.cartService.getCartObservable().subscribe((newCart) => {
      this.cartQuantity = newCart.totalCount;
    })
    this.userService.userObservable.subscribe((newUser) => {
      this.authState = newUser.token ? true : false
      this.user = newUser;
    })
   }

   ngOnChanges(changes: SimpleChanges): void {
   }

  logout(){
    this.userService.logout();
  }

  get isAuth(){
    return this.user.token;
  }
}
