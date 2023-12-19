import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from "./authentication.service";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
      ) { }
    
      canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (environment.login) {
          const currentUser = this.authenticationService.currentUserValue;
          if (currentUser) {
            if(this.authenticationService.isAdmin())
            {
                this.router.navigate(['/salon-panel'], { queryParams: { returnUrl: state.url } });
            }
            // authorised so return true
            return true;
          }
    
    
    
          // not logged in so redirect to login page with the return url
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
    
    
        } else {
          return true
        }
    
    
      }
    }
    