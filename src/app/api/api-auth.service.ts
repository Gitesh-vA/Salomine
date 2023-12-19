import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class ApiAuthService {
  constructor(private http: HttpClient) { }

  authPhone(phone: string,fName: string,isAMember:Boolean = false,lang:string = "en",downloadBy:string="",curVersion:string="",isResend:Boolean = false){
    return  this.http.get<any>(`${environment.APIUrl}/users/authphone?fName=${fName}&phone=${phone}&isAMember=${isAMember}&lang=${lang}&downloadBy=${downloadBy}&curVersion=${curVersion}&isResend=${isResend}`);
  }

  refreshToken(refreshToken: string){
    return  this.http.post<any>(`${environment.APIUrl}/users/refreshtoken`, {refreshToken});
  }


}
