import { Component, OnInit } from '@angular/core';
interface Employee {
  name:string;
  value:number;
}
@Component({
  selector: 'app-employee-drop-down',
  templateUrl: './employee-drop-down.component.html',
  styleUrls: ['./employee-drop-down.component.scss']
})


export class EmployeeDropDownComponent implements OnInit {

  public Services:Employee[] = [{name: 'Tamer Khoury', value: 1}, {name: 'Saher Silbak', value: 1}];

  constructor() { }

  ngOnInit() {
  }


}
