import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {environment} from "../../environments/environment";



@Injectable({
  providedIn: 'root'
})
export class ApiEmployeesPhotosService {
  constructor(private http: HttpClient) { }



  
  public setEmployeeProfile(empid:any,image:File,File40x40:File,File100x100:File){
    const postData = new FormData();
    postData.append("image",image);
    postData.append("image",File40x40);
    postData.append("image",File100x100);
    postData.append("empid",empid);
    return  this.http.post<any>(`${environment.APIUrl}/employeesphotos/setEmployeeProfile`,postData);
  }

}
