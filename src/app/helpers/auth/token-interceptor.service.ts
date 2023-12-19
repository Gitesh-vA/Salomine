import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { AuthenticationService } from './authentication.service';
import { StaticObjectsService } from '../global/static-objects.service';
import { ApiUserService } from 'src/app/api/api-user.service';




@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private auth: AuthenticationService,private apiUser: ApiUserService,private globalFunc: StaticObjectsService) { }

  private refreshTokenInProgress = false;
  // Refresh Token Subject tracks the current token, or is null if no token is currently
  // available (e.g. refresh pending).
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.auth.getAccessToken();
    let tokenizedReq = req;
  

    if (token !== null) {
      let auth = 'Bearer ' + token;

      tokenizedReq = req.clone({
        setHeaders: {
          Authorization: auth
        }
      });
    }

    return next.handle(tokenizedReq).catch(error => {
      if (error.status !== 401) {
        return Observable.throw(error);
      }

      if (this.refreshTokenInProgress) {
        // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
        // – which means the new token is ready and we can retry the request again
        return this.refreshTokenSubject
          .filter(result => result !== null)
          .take(1)
          .switchMap(() => next.handle(this.addAuthenticationToken(req)));
      } else {
        this.refreshTokenInProgress = true;

        // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
        this.refreshTokenSubject.next(null);

        // Call auth.refreshAccessToken(this is an Observable that will be returned)
        return this.auth.refreshAccessToken()
          .switchMap((token: any) => {
            //When the call to refreshToken completes we reset the refreshTokenInProgress to false
            // for the next time the token needs to be refreshed
            this.refreshTokenInProgress = false;
            this.refreshTokenSubject.next(token);

            return next.handle(this.addAuthenticationToken(req));
          })
          .catch((err: any) => {
            this.refreshTokenInProgress = false;

            this.apiUser.userReport("IOS:refresh token access error , navigate user to logout").subscribe(
              res=>{
        
              });

            this.globalFunc.logout();
            return Observable.throw(error);
          });
      }

    });
  }


  addAuthenticationToken(request): HttpRequest<any> {
    // Get access token from Local Storage
    const accessToken = this.auth.getAccessToken();

    // If access token is null this means that user is not logged in
    // And we return the original request
    if (!accessToken) {
      return request;
    }

    // We clone the request, because the original request is immutable
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.getAccessToken()}`
      }
    });
  }


}
