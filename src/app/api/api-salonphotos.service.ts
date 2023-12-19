import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class apiSalonPhotos {


  constructor(private http: HttpClient) { }


  public getSalonPhotos(salonId : string){
    let params = new HttpParams().set("salonId",salonId)
    return  this.http.get<any>(`${environment.APIUrl}/salonphotos/getSalonPhotos`,{params:params});
  }

  public setSalonPhotos(image:File,thumb:File,picIdToEdit:any = -1){
    const postData = new FormData();
    postData.append("image",image);
    postData.append("image",thumb);
    postData.append("picIdToEdit",picIdToEdit);
    return  this.http.post<any>(`${environment.APIUrl}/salonphotos/setSalonPhotos`,postData);
  }
  
  public removePic(imgID : string){
    return  this.http.post<any>(`${environment.APIUrl}/salonphotos/removeImage`, { imgID });
  }

}