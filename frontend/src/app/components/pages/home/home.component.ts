import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FoodService } from 'src/app/services/food.service';
import { UserService } from 'src/app/services/user.service';
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit{
  favouriteShown: boolean = false
  foods: Food[] = [];
  favourites!: string[]
  currentUser! : string

  constructor(
    private foodService: FoodService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {
    let foodsObservable: Observable<Food[]>;
    this.activatedRoute.params.subscribe((params) => {
      if (params.searchTerm) {
        foodsObservable = this.foodService.getAllFoodsBySearchTerm(
          params.searchTerm
        );
      } else if (params.tag) {
        foodsObservable = this.foodService.getAllFoodsByTag(params.tag);
      } else if (activatedRoute.snapshot.url.toString().includes('favorites')) {
        foodsObservable = this.foodService.getAllFoodsById(this.userService.currentUser.favorites)
      }
       else {
        foodsObservable = foodService.getAll();
      }

      foodsObservable.subscribe((serverFoods) => {
        this.foods = serverFoods;
      });
    });
  }

  ngOnInit(): void {
    this.favouriteShown = this.userService.currentUser.token ? true : false
    this.favourites = this.userService.currentUser.favorites
    this.currentUser = this.userService.currentUser.id
  }

  isFavorite(foodId: string): boolean {
    return this.favourites?.includes(foodId) || false;
  }

  onClickFavourite(id: string, event: Event) {
    event.stopPropagation()
    const userId = this.userService.currentUser.id
    this.userService.toggleFavourites(id,userId).subscribe(
      (updatedUser) => {
        this.favourites = updatedUser.favorites;
        if (this.activatedRoute.snapshot.url.toString().includes('favorites')) {
          this.foods = this.foods.filter(item => this.favourites.includes(item.id))
        }
      },
      (error) => {
        console.error('Failed to toggle favorite:', error);
      }
    );
  }
}