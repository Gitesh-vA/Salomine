import { Injectable } from '@angular/core';
import { resolve } from 'dns';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatashareService {

  constructor() { }

// Example in a service or a component
private employedataSubject = new BehaviorSubject<any>([]);

  // Observable string streams
  data$ = this.employedataSubject.asObservable();

updateDataOnSubject(newData: any): void {
  this.employedataSubject.next(newData);
}


}
