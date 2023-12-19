import { Component, OnInit } from '@angular/core';
import { MDBModalRef } from 'ng-uikit-pro-standard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-dynamic-modal',
  templateUrl: './success-dynamic-modal.component.html',
  styleUrls: ['./success-dynamic-modal.component.scss']
})
export class SuccessDynamicModalComponent implements OnInit {

  constructor(public modalRef: MDBModalRef, private router: Router) { }
  public content: any;
  ngOnInit() {

  }

  navigator() {
    if (this.content.type == 0) {
      this.navigateToAppointment();
    }
    else if (this.content.type == 1) {
      this.navigateToCalendar();
    }
  }

  navigateToAppointment() {
    this.router.navigate(["/my-appointment"]);
  }

  navigateToCalendar() {
    this.router.navigate(["/calendar", { minH: this.content.minH, maxH: this.content.maxH, mST: this.content.mST }]);
  }


}
