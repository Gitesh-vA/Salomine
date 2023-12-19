import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {environment} from "../../environments/environment";



@Injectable({
  providedIn: 'root'
})
export class ApiStoreService {
  constructor(private http: HttpClient) { }

  setStore(storeData:any){
    return  this.http.post<any>(`${environment.APIUrl}/store/setStore`, {storeData: storeData});
  }

  //get all stores (include inactive)
  getStores(){
    return  this.http.get<any>(`${environment.APIUrl}/store/getStores`);
  }

  //get all stores that active
  getActiveStore(uID : any){
    let params = new HttpParams().set("userId",uID)
    return  this.http.get<any>(`${environment.APIUrl}/store/getActiveStore`, {params:params});
  }

  deleteImage(imageID : any){
    return  this.http.post<any>(`${environment.APIUrl}/store/removeImage`, {imageID:imageID}); 
  }


  deleteStore(){
    return  this.http.get<any>(`${environment.APIUrl}/store/deleteStore`);  
  }

  isHavingStore(){
    return  this.http.get<any>(`${environment.APIUrl}/store/isHavingStore`); 
  }


 

  public setStorePhotos(image:File,thumb:File,templateID:any,imageIdToUpdate:any,orderID:any){
    const postData = new FormData();
    postData.append("image",image);
    postData.append("image",thumb);
    postData.append("templateID",templateID);
    postData.append("imageIdToUpdate",imageIdToUpdate);
    postData.append("orderID",orderID);
    return  this.http.post<any>(`${environment.APIUrl}/store/setStorePhoto`,postData);
  }
  


}
