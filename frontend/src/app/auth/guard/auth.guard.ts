import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export function authGuard(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree {
  const router: Router = inject(Router);
  const userService: UserService = inject(UserService);

  if (userService.currentUser?.token) return true;

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
}
