import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {environment} from "../../environments/environment";



@Injectable({
  providedIn: 'root'
})
export class ApiDaysOffService {
  constructor(private http: HttpClient) { }

  setdaysOff(dayOffData:any){
    return  this.http.post<any>(`${environment.APIUrl}/daysoff/setDayOff`, {dayOffData });
  }

  isThereAnyAppointment(dayOffData:any,empId:any = "-1"){
    let params = new HttpParams().set("dayOffData",JSON.stringify(dayOffData)).set("empId",empId)
    return  this.http.get<any>(`${environment.APIUrl}/daysoff/isThereAnyAppointment`, {params});
  }


  getDaysOff(){
    return  this.http.get<any>(`${environment.APIUrl}/daysoff/getDayOff`);
  }

  getDaysOff_allemployees(){
    return  this.http.get<any>(`${environment.APIUrl}/daysoff/getDayOff_allEmployees`);
  }




}
