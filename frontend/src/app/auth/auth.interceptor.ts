import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const user = this.userService.currentUser;
    const isGoogleRequest = request.url.includes('google');

    if (isGoogleRequest) {
      const apiKey = environment.mapApi;
      const separator = request.url.includes('?') ? '&' : '?';
      const modifiedUrl = `${request.url}${separator}key=${apiKey}`;
      request = request.clone({ url: modifiedUrl });
    } else if (user.token && !isGoogleRequest) {
      request = request.clone({
        setHeaders: {
          access_token: user.token,
        },
      });
    }
    return next.handle(request);
  }
}
