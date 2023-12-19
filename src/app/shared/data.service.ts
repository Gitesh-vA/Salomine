import { Injectable } from "@angular/core";

@Injectable({
   providedIn: 'root'
 })
export class DataService {

   data: string;

   set setData(value: string) {
      this.data = value;
   }

   get getData(): string {
       return this.data;
   }

   constructor() {}

}