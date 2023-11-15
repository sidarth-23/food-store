import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { FoodService } from 'src/app/services/food.service';
import { UserService } from 'src/app/services/user.service';
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'app-food-page',
  templateUrl: './food-page.component.html',
  styleUrls: ['./food-page.component.css'],
})
export class FoodPageComponent implements OnInit{
  food!: Food;
  btnState!: boolean
  constructor(
    activatedRoute: ActivatedRoute,
    foodService: FoodService,
    private router: Router,
    private cartService: CartService,
    private userService: UserService
  ) {
    activatedRoute.params.subscribe((params) => {
      if (params.id)
        foodService.getFoodById(params.id).subscribe((serverFood) => {
          this.food = serverFood;
        });
    });
  }

  ngOnInit(): void {
    this.btnState = this.userService.currentUser.token ? false : true
  }

  addToCart() {
    this.cartService.addToCart(this.food);
    this.router.navigateByUrl('/');
  }
}
