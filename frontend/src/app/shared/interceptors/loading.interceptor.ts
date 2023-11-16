import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { TOGGLE_FAVOURITES_URL } from '../constants/urls';

var pendingRequests = 0;
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url === TOGGLE_FAVOURITES_URL) {
      return next.handle(request);
    }
    this.loadingService.showLoading();
    pendingRequests += 1;
    return next.handle(request).pipe(
      tap({
        next: (event) => {
          if (event.type === HttpEventType.Response) {
            this.handleHideLoading();
          }
        },
        error: (_) => {
          this.handleHideLoading();
        },
      })
    );
  }

  handleHideLoading() {
    pendingRequests -= 1;
    if (pendingRequests === 0) {
      this.loadingService.hideLoading();
    }
  }
}
