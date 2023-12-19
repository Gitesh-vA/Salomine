import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {environment} from "../../environments/environment";



@Injectable({
  providedIn: 'root'
})
export class ApiPaymentService {
  constructor(private http: HttpClient) { }

  getPayments(){
    return  this.http.get<any>(`${environment.APIUrl}/payment/getPayments`);
  }

  setPayment(){
    return  this.http.get<any>(`${environment.APIUrl}/payment/setPayment`);
  }

}
