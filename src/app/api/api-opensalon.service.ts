import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiOpensalonService {

  constructor(private http: HttpClient) { }

  public register(opensalon: any){
    return  this.http.post<any>(`${environment.APIUrl}/opensalon/register`, {opensalon: opensalon});
  }
  public setRating(score: Number, opensalonId: String){
    return  this.http.post<any>(`${environment.APIUrl}/opensalon/setrating`, {score, opensalonId });
  }

  public updateToProfessional(processId:any,processToken:any,url:any,name:any,phoneNumber:any,plan_num:any,status:any,status_num:any,url_id:any,subscribePeriod,price:any = 3){
    return  this.http.post<any>(`${environment.APIUrl}/opensalon/updateToProfessional`, {processId,processToken,url,name,phoneNumber,plan_num,status,status_num,url_id,price,subscribePeriod});
  }

  public getNumOfEmpsAllowedtoAdd(){
    return  this.http.get<any>(`${environment.APIUrl}/opensalon/getNumOfEmpsAllowedtoAdd`);
  }


  
  public removeComment(id: any, salonUserID: String){
    return  this.http.post<any>(`${environment.APIUrl}/opensalon/removeComment`, {id, salonUserID });
  }

  public addComment(comment: String, opensalonId: String,minPassed,lang,phoneNumber,isOwner){
    return  this.http.post<any>(`${environment.APIUrl}/opensalon/addcomment`, {comment, opensalonId, minPassed,lang,phoneNumber,isOwner});
  }

  public getComment(opensalonId: string,isFromInterval:string){
    let params = new HttpParams().set("salonId",opensalonId).set('isFromInterval',isFromInterval)
    return  this.http.get<any>(`${environment.APIUrl}/opensalon/getComment`, { params:params });
  }
  public getSalonPanel(salonUserID: string,myUserId: string = "-1"){
    let params = new HttpParams().set("opensalonId",salonUserID).set("myUserId",myUserId).set("version",">=2.4.8");
    return  this.http.get<any>(`${environment.APIUrl}/opensalon/getsalonpanel`, {params:params});
  }
  public getSalonByTypeID(typeID : string, lat : string , lon : string,locationIsActive : Boolean){
    let params = new HttpParams().set("typeID",typeID).set("lat",lat).set("lon",lon).set("locationIsActive",String(locationIsActive));
    return  this.http.get<any>(`${environment.APIUrl}/opensalon/getSalonByTypeID`, { params:params });
  }
  public getSalonByTypeIDEx(typeID : string, lat : string , lon : string,locationIsActive : Boolean,pageNumber : Number,isAdmin : Boolean = false){
    let params = new HttpParams().set("typeID",typeID).set("lat",lat).set("lon",lon).set("locationIsActive",String(locationIsActive)).set("pageNumber",String(pageNumber)).set("isAdmin",String(isAdmin));
    return  this.http.get<any>(`${environment.APIUrl}/opensalon/getSalonByTypeIDEx`, { params:params });
  }
  public getAllSalonPanel(){
    return  this.http.get<any>(`${environment.APIUrl}/opensalon/getAllSalonPanel`);
  }

  public getSalonPanelPublic(salonUserID: string){
    let params = new HttpParams().set("opensalonId",salonUserID).set("version",">=2.4.8");
    return  this.http.get<any>(`${environment.APIUrl}/opensalon/getSalonPanelPublic`, {params:params});
  }
  public getAllData(){
    return  this.http.get<any>(`${environment.APIUrl}/opensalon/getAllData`);
  }
  public getSubCategory(typeID: any,lang:any){
    let params = new HttpParams().set("typeID",typeID).set("lang",lang);
    return  this.http.get<any>(`${environment.APIUrl}/opensalon/getsubcategories`, {params:params});
  }
  public getSalonServecies(id:any){
    let params = new HttpParams().set("salonId",id)
    return  this.http.get<any>(`${environment.APIUrl}/opensalon/getSalonServecies`,{params:params});
  }

  public getSalonEmployees(id:any){
    let params = new HttpParams().set("salonId",id)
    return  this.http.get<any>(`${environment.APIUrl}/opensalon/getSalonEmployees`,{params:params});
  }

  public getSalonImagesPath(){
    return  this.http.get<any>(`${environment.APIUrl}/opensalon/getSalonImagesPath`);
  }

  public getClosestSalons(lat:any, lon:any, distance:any = 50000 , limit:any = 10){
    let params = new HttpParams().set("distance",distance).set("limit",limit).set("lat",lat).set("lon",lon);
    return  this.http.get<any>(`${environment.APIUrl}/opensalon/getClosestSalons`,{params:params});
  }

  public salonSearch(searchFor:any,limit:any = 10){
    let params = new HttpParams().set("searchFor",searchFor)
    return  this.http.get<any>(`${environment.APIUrl}/opensalon/salonSearch`,{params:params});
  }

  public setblockedUsers(id:any,number:any){
    let params = new HttpParams().set("id",id).set("number",number);
    return  this.http.get<any>(`${environment.APIUrl}/opensalon/setBlockedUsers`,{params:params});
  }

  public getblockedUsers(id:any){
    let params = new HttpParams().set("id",id);
    return  this.http.get<any>(`${environment.APIUrl}/opensalon/getBlockedUsers`,{params:params});
  }

  public removeblockedUsers(id:any,number:any){
    let params = new HttpParams().set("id",id).set("number",number);
    return  this.http.get<any>(`${environment.APIUrl}/opensalon/removeBlockedUsers`,{params:params});
  }

  public setVisibility(Visibility: any,userid : string = ''){
    return  this.http.post<any>(`${environment.APIUrl}/opensalon/setVisibility`, {visibility:Visibility,userid:userid});
  }

  
  public setPaymentStatus(isPaymentEnabled: any,userid : string = ''){
    return  this.http.post<any>(`${environment.APIUrl}/opensalon/setPaymentStatus`, {isPaymentEnabled:isPaymentEnabled,userid:userid});
  }

  

  public addUserToSalon(uid: any){
    return  this.http.post<any>(`${environment.APIUrl}/opensalon/addUserToSalon`, {uid:uid});
  }


  public setEmployeeProfile(empid:any,image:File,File40x40:File,File100x100:File){
    const postData = new FormData();
    postData.append("empid",empid);
    postData.append("image",image);
    postData.append("image",File40x40);
    postData.append("image",File100x100);
    return  this.http.post<any>(`${environment.APIUrl}/opensalon/setEmployeeProfile`,postData);
  }


  public getSalonUsersAndWaitingAppointment(minPassed:Number){
    let params = new HttpParams().set("minPassed",minPassed.toString());
    return  this.http.get<any>(`${environment.APIUrl}/opensalon/getSalonUsersAndWaitingAppointment`, {params:params}); 
  }


  public removeUserFromSalon(userPhoneNum : any){
    return  this.http.post<any>(`${environment.APIUrl}/opensalon/removeUserFromSalon`,{userPhoneNum:userPhoneNum});
  }

  public setPreferences(preferences : String){
    return  this.http.post<any>(`${environment.APIUrl}/opensalon/setPreferences`,{preferences});
  }

  public getPreferences(){
    return  this.http.get<any>(`${environment.APIUrl}/opensalon/getPreferences`);
  }




}
