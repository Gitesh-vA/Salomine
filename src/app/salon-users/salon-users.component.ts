import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ModalDirective } from 'ng-uikit-pro-standard';
import { ApiOpensalonService } from '../api/api-opensalon.service';
import { StaticObjectsService } from '../helpers/global/static-objects.service';

@Component({
  selector: 'app-salon-users',
  templateUrl: './salon-users.component.html',
  styleUrls: ['./salon-users.component.scss']
})
export class SalonUsersComponent implements OnInit {
  public activeTab: string = "salonUsers";
  isLoading: Boolean = true;
   notificationType = "waitingUsers";

  public salonData : any = null;
  public waitingAppointmentsData : any;
  public host :any;
  public userNumber : any;
  public thereAnyChangeOccured  = false;
  

  @ViewChild('bottomModal', { static: false }) private bottomModal: ModalDirective;

  constructor(private apiOpenSalon: ApiOpensalonService,private route: ActivatedRoute,private globalFunc: StaticObjectsService) { }

  ngOnInit() {
    this.host = localStorage.getItem("host");
    let tab = this.route.snapshot.paramMap.get('tab');
    if(tab)
    {
      this.activeTab = tab;
    }

    this.getSalonUserAndWaitingList();
  }

  public userName = '';

  msgFromParent($event: any) {
    this.thereAnyChangeOccured = $event;

  }


  removeUserFromSalon()
  {
    this.isLoading = true;
    let userPhoneNum = this.userNumber;
    this.salonData = this.salonData.filter(function(a){return a.number != userPhoneNum})

    this.apiOpenSalon.removeUserFromSalon(userPhoneNum).subscribe(
      res => { 
        if(res.Status &&  res.Status.nModified > 0)
        {
          this.salonData = this.salonData.filter(function(a){return a.number != userPhoneNum})
          this.bottomModal.hide();
          this.isLoading = false;
        }

      },
      err=> {}
    );
  }

  getSalonUserAndWaitingList()
  {
    this.isLoading = true;
    debugger;

    let currentMoment = moment();
    let d = currentMoment.format('D');
    let m = currentMoment.format('M');
    let y = currentMoment.format('YYYY');
    let h = currentMoment.format('H');
    let min = currentMoment.format('m');
    let passedMin = this.globalFunc.calculcateMinPassed(parseInt(y), parseInt(m) - 1, parseInt(d), parseInt(h), parseInt(min));


    this.apiOpenSalon.getSalonUsersAndWaitingAppointment(passedMin).subscribe(
      res => { 
        debugger;
        if(res.salonData && res.salonData.salonUsers && res.salonData.salonUsers.length > 0)
        {
         this.salonData = res.salonData.salonUsers;
          for(let i=0;this.salonData && i<this.salonData.length ;i++)
          {
            this.salonData[i].profilePath40x40 =this.salonData[i].profile40x40 + "?" + new Date().getTime();
          }
        }
        this.waitingAppointmentsData = res.waitingAppointments;
  
        for(let i=0;this.waitingAppointmentsData && i< this.waitingAppointmentsData.length;i++)
        {
          this.waitingAppointmentsData[i].profilePath40x40 +=  "?" + new Date().getTime();
          
          let utcZeroTime = this.waitingAppointmentsData[i].createdAt;

          this.waitingAppointmentsData[i].createdAt = moment(utcZeroTime).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format("DD/MM/YYYY HH:mm");
        }
        this.isLoading = false;
      },
      err => { }
    );
  }

  public changeActiveTab(activeTab): void {
    this.activeTab = activeTab;

    if(this.thereAnyChangeOccured)
    {
      this.getSalonUserAndWaitingList();
      this.thereAnyChangeOccured = false;
    }

  }

  public openBottomModal(userNumber)
  {
    this.userNumber = userNumber;
    this.bottomModal.show();
  }


}
