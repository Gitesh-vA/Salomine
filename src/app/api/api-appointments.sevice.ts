import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class ApiAppoinmtmentsService {
  constructor(private http: HttpClient) { }

  getAppointments(day:string, month:string, year:string, salonId:string,sortBy:string = "",employeeID:String="",fetchSalonOwner:Boolean = false,minutesPassed:any = -1){
    let params = new HttpParams().set("day",day).set("month",month).set("year",year).set("salonId",salonId).set("sortBy",sortBy).set("employeeID",employeeID.toString()).set("fetchSalonOwner",fetchSalonOwner.toString()).set("minutesPassed",minutesPassed);
    return  this.http.get<any>(`${environment.APIUrl}/appointments/getAppointments`, {params:params}); 
  }
  getMyAppointments(status:string,type:Number,minPassed:Number){
    let params = new HttpParams().set("status",status).set("type",type.toString()).set("minPassed",minPassed.toString());
    return  this.http.get<any>(`${environment.APIUrl}/appointments/getMyAppointments`, {params:params}); 
  }
  getAppointmentsById(id:any,getProfilePic:boolean = false,getIsBlocked:boolean = false){
    let params = new HttpParams().set("id",id).set("getProfilePic",getProfilePic.toString()).set("getIsBlocked",getIsBlocked.toString());
    return  this.http.get<any>(`${environment.APIUrl}/appointments/getAppointmentsById`, {params:params}); 
  }

  getLastXAppointment(id:any){
    let params = new HttpParams().set("id",id);
    return  this.http.get<any>(`${environment.APIUrl}/appointments/getLastXAppointment`, {params:params}); 
  }
  cancelAppointment(appointmentID:any,userId:any,salonId:any,name:String,date:String){
    return  this.http.post<any>(`${environment.APIUrl}/appointments/CancelAppointment`, {appointmentID,userId,salonId,name,date}); 
  }

  CancelAppointmentByMinPassed(salonUserId:any,passedTime:any,uid:any,fDate:any,sToken:any,salonName:any = "",atMin:any = "",empid:any="",type:any=1){
    return  this.http.post<any>(`${environment.APIUrl}/appointments/CancelAppointmentByMinPassed`, {salonUserId,passedTime,uid,fDate,sToken,salonName,atMin,empid,type}); 
  }
  removeAppointmentByMinPassed(salonUserId:any,passedTime:any){
    return  this.http.post<any>(`${environment.APIUrl}/appointments/removeAppointmentByMinPassed`, {salonUserId,passedTime}); 
  }

  removeAppointment(appointmentID:any,phoneNum:any = -1){
    return  this.http.post<any>(`${environment.APIUrl}/appointments/removeAppointment`, {appointmentID,phoneNum}); 
  }

  removeAllAppointment(appointmentID:any,phoneNum:any = -1){
    return  this.http.post<any>(`${environment.APIUrl}/appointments/removeAllAppointment`, {appointmentID,phoneNum}); 
  }

  public setAppointment(apt: any,iCM:any = false,cID:any = null){
    return  this.http.post<any>(`${environment.APIUrl}/appointments/setAppointments`, {appointment: apt,isChangeMode:iCM,minPassed:cID});
  }

  public getAvailableDates(from:string ,to:string,salonId:string){
    let params = new HttpParams().set("from",from).set("to",to).set("salonId",salonId);
    return  this.http.get<any>(`${environment.APIUrl}/appointments/getAvailableDates`,{params:params}); 
  }

  public getAvailableDatesById(from:string ,to:string,salonId:string,empIds:string){
    let params = new HttpParams().set("from",from).set("to",to).set("salonId",salonId).set("employeeID",empIds);
    return  this.http.get<any>(`${environment.APIUrl}/appointments/getAvailableDatesById`,{params:params}); 
  }

  public autoCancelAppointment(listID:any,empId:any = "-1"){
    return  this.http.post<any>(`${environment.APIUrl}/appointments/autoCancelAppointment`, {listID:listID,empId:empId});
  }


}
