import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, switchMap, tap, throwError } from 'rxjs';
import { User } from '../shared/models/User';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { IUserRegister } from '../shared/interfaces/IuserRegister';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import {
  USER_LOGIN_URL,
  USER_REGISTER_URL,
  USER_GET_URL,
  USER_UPDATE_URL,
  USER_UPDATE_PASS,
  TOGGLE_FAVOURITES_URL,
} from '../shared/constants/urls';
import { IUserUpdate } from '../shared/interfaces/IUserUpdate';
import { ActivatedRoute } from '@angular/router';

const USER_KEY = 'User';

interface PassChange {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(new User());
  public userObservable: Observable<User>;

  constructor(private http: HttpClient, private toastrService: ToastrService, private activatedRoute: ActivatedRoute) {
    this.userObservable = this.userSubject.asObservable();

    const initialUser = this.GetUserFromLocalStorage();
    if (initialUser.token) {
      this.userSubject.next(initialUser);
    }
  }

  public get currentUser(): User {
    return this.userSubject.value;
  }

  login(userLogin: IUserLogin): Observable<User> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          this.setUserAndNotify(user);
          this.toastrService.success('Welcome to Foodmine', 'Login Successful');
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Login Failed');
        },
      })
    );
  }

  register(userRegister: IUserRegister): Observable<User> {
    return this.http.post<User>(USER_REGISTER_URL, userRegister).pipe(
      tap({
        next: (user) => {
          this.setUserAndNotify(user);
          this.toastrService.success(
            `Welcome to Foodmine ${user.name}`,
            'Register Successful'
          );
        },
        error: (err) => {
          this.toastrService.error(err.error, 'Register Failed');
        },
      })
    );
  }

  getUser(): Observable<User> {
    return this.http.get<User>(USER_GET_URL);
  }

  updateUser(userUpdate: IUserUpdate): Observable<any> {
    return this.http.post<any>(USER_UPDATE_URL, userUpdate).pipe(
      tap({
        next: (updatedUser) => {
          this.setUserAndNotify(updatedUser);
          this.toastrService.success(
            'User updated successfully. Relogin to see the updated changes'
          );
        },
        error: (err) => {
          this.toastrService.error(err.error, 'Update Failed');
        },
      })
    );
  }

  updatePass(userLogin: PassChange): Observable<any> {
    return this.http.post<any>(USER_UPDATE_PASS, userLogin).pipe(
      tap({
        next: (updatedUser) => {
          this.setUserAndNotify(updatedUser);
          this.toastrService.success(
            'User updated successfully. Relogin to see the updated changes'
          );
        },
        error: (err) => {
          this.toastrService.error(err.error, 'Update Failed');
        },
      })
    );
  }

  toggleFavourites(foodId: string, userId: string): Observable<User> {
    return this.http.post<User>(TOGGLE_FAVOURITES_URL, { foodId, userId }).pipe(
      tap({
        next: (item) => {
          const updatedUser = this.GetUserFromLocalStorage();
          if (updatedUser.favorites.length > item.favorites.length) {
            this.toastrService.warning('Favorite item deleted :(');
          } else {
            this.toastrService.success('Favorite item added :)');
          }
          updatedUser.favorites = item.favorites
          this.setUserAndNotify(updatedUser);
        },
        error: (error) => {
          this.toastrService.error(
            error.error,
            'Failed to update favorite status'
          );
        },
      })
    );
  }

  logout() {
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }

  private setUserAndNotify(updatedUser: User) {
    this.setUserToLocalStorage(updatedUser);
    if (updatedUser.token) {
      this.userSubject.next(updatedUser);
    }
  }

  private setUserToLocalStorage(user: User) {
    const currentUsers = { ...this.userSubject.value };
    const updatedUser = { ...currentUsers, ...user };
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    this.userSubject.next(updatedUser);
  }

  private GetUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY);
    const user = userJson ? (JSON.parse(userJson) as User) : new User();
    this.userSubject.next(user);
    return user;
  }
}
