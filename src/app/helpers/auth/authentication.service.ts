import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiAuthService } from "../../api/api-auth.service";
import { User } from "../../models/User";
import { environment } from "../../../environments/environment.prod";
import { Subscription } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Address } from 'ngx-google-places-autocomplete/objects/address';


@Injectable({
  providedIn: 'root'
})
//TODO: if currentuser == null it should logout
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient,
    private apiAuth: ApiAuthService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  authPhone(phone: string, fName: string, isAMember: Boolean = false,lang:string,downloadBy : any,curVersion : any,isResend: Boolean = false) {
    return this.apiAuth.authPhone(phone, fName, isAMember,lang,downloadBy,curVersion,isResend);
  }


  login(username: string, code: string, curTime: string,notification : any,deviceInfo : any) {
    return this.http.post<any>(`${environment.APIUrl}/users/authenticate`, { username, code, curTime , notification,deviceInfo })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));

          this.currentUserSubject.next(user);
        }

        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }


  refreshAccessToken(): Observable<Subscription> {
    let token = this.apiAuth.refreshToken(this.getRefreshToken())
      .subscribe((res) => {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser === null) {
          return null
        }
        currentUser.refreshToken = res.refreshToken;
        currentUser.token = res.token
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return res.token;
      });
    return Observable.of(token).delay(2000);
  }

  getRefreshToken() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser === null) {
      return null
    }
    return currentUser.refreshToken;
  }


  getAccessToken() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser === null) {
      return null
    }
    return currentUser.token;
  }

  
  public isLogin() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser === null || currentUser.token === null) {
      //this.logout();
      return false;
    }

    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(currentUser.token);
    let role = decodedToken.role;
    if(role)
    {
      return true;
    }
    else
    {
      return false;
    }

  }



  public isAdmin() {

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser === null || currentUser.token === null) {
      //this.logout();
      return null;
    }

    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(currentUser.token);

    let isUserAdmin = decodedToken.role === 'admin';
    //isUserAdmin = true;
    return isUserAdmin;
  }

  public isSalonOwner(salonId: string): boolean {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser === null || currentUser.token === null) {
      return false;
    }
    else if ((salonId == "-1" && this.isAdmin()) || currentUser.user.id == salonId) {
      return true;
    }

  }

}
