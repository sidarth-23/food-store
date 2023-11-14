import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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
} from '../shared/constants/urls';
import { IUserUpdate } from '../shared/interfaces/IUserUpdate';

const USER_KEY = 'User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: User = this.GetUserFromLocalStorage()
  private userSubject = new BehaviorSubject<User>(
    this.user
  );
  public userObservable: Observable<User>;

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.userObservable = this.userSubject.asObservable();
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
          this.toastrService.success('User updated successfully. Relogin to see the updated changes');
        },
        error: (err) => {
          this.toastrService.error(err.error, 'Update Failed');
        },
      })
    );
  }

  logout() {
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }

  private setUserAndNotify(userUpdates: Partial<User>) {
    const currentUser = { ...this.userSubject.value };
    const updatedUser = { ...currentUser, ...userUpdates };
    this.setUserToLocalStorage(updatedUser);
    this.userSubject.next(updatedUser);
  }

  private setUserToLocalStorage(user: User) {
    this.user = user
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private GetUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) as User : new User();
  }
}
