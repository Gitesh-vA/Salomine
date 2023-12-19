import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DatashareService } from '../services/datashare.service';
import { Employee } from '../models/open-salon/employee';
import { log } from 'console';
import { FormArray } from '@angular/forms';
import { ModalDirective } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-salon-delete',
  templateUrl: './salon-delete.component.html',
  styleUrls: ['./salon-delete.component.scss']
})
export class SalonDeleteComponent implements OnInit {

  @Input() headerName = 'Employees';
  public thereAnyChanged = false;
  @Input() backButtonPoint = '/update-salon?form=home'; 
  isLoading = true;
  public Employees: Employee[] = [];
  removingId:any
  @ViewChild('confirmationModal', { static: false }) confirmationModal: ModalDirective;
  
  constructor(private dataSubject:DatashareService) { 

    this.dataSubject.data$.subscribe(data => {
      this.Employees = data
    });
    
    console.log(this.Employees,'Employ structures')
    if(this.Employees.length > 0) {
      this.isLoading = false;
    }
  }

  ngOnInit(): void {
  }
  
  deleteEmployee(emp_index)
  {
    this.removingId = emp_index
  }
  

  removeData() {
    this.Employees.splice(this.removingId,1);
    this.dataSubject.updateDataOnSubject(this.Employees);
    this.confirmationModal.hide()
     
  }

}
