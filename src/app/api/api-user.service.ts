import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiUserService {

  constructor(private http: HttpClient) { }

  updateProfile(profile: any){
    return  this.http.post<any>(`${environment.APIUrl}/users/updateprofile`, {profile: profile});
  }

  updateLang(lang: any){
    return  this.http.post<any>(`${environment.APIUrl}/users/setLang`, {lang: lang});
  }


  toggleFavorites(opensalonId: String, fav: boolean = false){
    return  this.http.post<any>(`${environment.APIUrl}/users/togglefavorites`, {opensalonId: opensalonId});
  }

  setOrRemoveFavorite(salonId: String,userid: String, isfav: boolean = false){
    return  this.http.post<any>(`${environment.APIUrl}/users/setOrRemoveFavorite`, {salonId,userid,isfav});
  }

  getprofile(){
    return  this.http.get<any>(`${environment.APIUrl}/users/getProfile`);
  }

  updateVersion(version: String){
    return  this.http.post<any>(`${environment.APIUrl}/users/updateVersion`, {version});
  }
  
  getFavorites(){
    return  this.http.get<any>(`${environment.APIUrl}/users/getFavorites`);
  }

  getRecently(){
    return  this.http.get<any>(`${environment.APIUrl}/users/getRecently`);
  }


  getUser(userId:any){
    let params = new HttpParams().set("userId",userId)
    return  this.http.get<any>(`${environment.APIUrl}/users/getUser`, {params:params});
  }


  public setProfile(image:File,File40x40:File,File100x100:File){
    const postData = new FormData();
    postData.append("image",image);
    postData.append("image",File40x40);
    postData.append("image",File100x100);
    return  this.http.post<any>(`${environment.APIUrl}/users/setProfile`,postData);
  }

  getProfileImg(){
    return  this.http.get<any>(`${environment.APIUrl}/users/getProfileImg`);
  }

  
  deleteAccount(){
    return  this.http.get<any>(`${environment.APIUrl}/users/deleteAccount`);
  }


  sendCodeVertification(userPhoneNumber: String){
    return  this.http.post<any>(`${environment.APIUrl}/users/sendCodeVertification`, {userPhoneNumber});
  }


  vertificateCode(userPhoneNumber: String,code:String,numberOfAttempt:number){
    return  this.http.post<any>(`${environment.APIUrl}/users/vertificateCode`, {userPhoneNumber,code:code,numberOfAttempt:numberOfAttempt});
  }


  userReport(msg : String){
    return  this.http.post<any>(`${environment.APIUrl}/users/userReport`,{msg});
  }


}
