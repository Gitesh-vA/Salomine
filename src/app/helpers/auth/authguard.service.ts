import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from "./authentication.service";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (environment.login) {
      const currentUser = this.authenticationService.currentUserValue;
      if (currentUser) {
        // authorised so return true
        // this.router.navigate(['/home'], { queryParams: { returnUrl: state.url }});
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
