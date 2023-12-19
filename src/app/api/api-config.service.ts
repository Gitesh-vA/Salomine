import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  constructor(private http: HttpClient) { }

    
  getDeepLink(inviteTo:any,Lang:any,Name:any){
    let params = new HttpParams().set("inviteTo",inviteTo).set("Name",Name).set("Lang",Lang);
    return  this.http.get<any>(`${environment.APIUrl}/config/getDeepLink`, { params:params });
  }

  getEmail(){
    return  this.http.get<any>(`${environment.APIUrl}/config/getEmailCompany`);
  }

  
  getServiceNumber(){
    return  this.http.get<any>(`${environment.APIUrl}/config/getServiceNumber`);
  }

  getConfiguration(){
    return  this.http.get<any>(`${environment.APIUrl}/config/getConfiguration`);
  }


}