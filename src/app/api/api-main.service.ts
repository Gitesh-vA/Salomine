import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class apiMain {


  constructor(private http: HttpClient) { }


  public setMainImages(){
    return  this.http.get<any>(`${environment.APIUrl}/main/setMainImages`);
  }

  public getMainImages(isSalonOwner){
    let params = new HttpParams().set("isSalonOwner",isSalonOwner);
    return  this.http.get<any>(`${environment.APIUrl}/main/getMainImages`,{params:params});
  }

  public loadHome()
  {
    return  this.http.get<any>(`${environment.APIUrl}/main/loadHome`);
  }


}