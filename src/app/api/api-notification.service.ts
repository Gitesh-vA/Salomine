import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {environment} from "../../environments/environment";



@Injectable({
  providedIn: 'root'
})
export class ApiNotificationService {
  constructor(private http: HttpClient) { }

  setNotification(){
    return  this.http.get<any>(`${environment.APIUrl}/notification/setNotification`);
  }

  getNotification(isSalonOwner,isUser,isWaitingUsers,minPassed = ''){
    let params = new HttpParams().set("isSalonOwner",isSalonOwner).set("isUser",isUser).set("isWaitingUsers",isWaitingUsers).set("minPassed",minPassed);
    return  this.http.get<any>(`${environment.APIUrl}/notification/getNotification`,{params});
  }

  getNewNotificationCount(belongTo){
    let params = new HttpParams().set("belongTo",belongTo);
    return  this.http.get<any>(`${environment.APIUrl}/notification/getNewNotificationCount`,{params});
  }

  removeNotification(id : any)
  {
    let params = new HttpParams().set("id",id);
    return  this.http.get<any>(`${environment.APIUrl}/notification/removeNotification`, {params});
  }

  removeAllNotification(isSalonOwner,version)
  {
    let params = new HttpParams().set("isSalonOwner",isSalonOwner).set("fromVersion",version);
    return  this.http.get<any>(`${environment.APIUrl}/notification/removeAllNotification`, {params});
  }


  updateNotificationStatus(notificationID:any,notificationType:any,salonId : any,minPassed : any,salonImgPath : any,salonImgPath40x40 : any){
    return  this.http.post<any>(`${environment.APIUrl}/notification/updateNotificationStatus` , {notificationID,notificationType,salonId,minPassed,salonImgPath,salonImgPath40x40});
  }

  updateNotificationsStatus(jsonData : any){
    return  this.http.post<any>(`${environment.APIUrl}/notification/updateNotificationsStatus` , {jsonData});
  }


  sendNotificationByAdmin(body : string,title : string,sendTo:string){
  
    return  this.http.post<any>(`${environment.APIUrl}/notification/sendNotificationByAdmin` , {body,title,sendTo});
  }



  

}
