import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MDBModalRef, ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { ApiAppoinmtmentsService } from '../api/api-appointments.sevice';
import { ApiNotificationService } from '../api/api-notification.service';
import { ApiOpensalonService } from '../api/api-opensalon.service';
import { StaticObjectsService } from '../helpers/global/static-objects.service';

@Component({
  selector: 'app-info-dynamic-modal',
  templateUrl: './info-dynamic-modal.component.html',
  styleUrls: ['./info-dynamic-modal.component.scss']
})
export class InfoDynamicModalComponent implements OnInit {

  public content: any;
  public host : any;
  public blockedStatus : any;
  public UID : any;
  public curOp : any;
  public displayBtnClicked : boolean = false;
  public isLoading : boolean = false;
  public screenHeight : any;
  @ViewChild('blockUserModal', { static: false }) private blockModal: ModalDirective;
  @ViewChild('unblockUserModal', { static: false }) private unblockModal: ModalDirective;
  @ViewChild('autoAcceptInfoModal', { static: false }) autoAcceptInfoModal: ModalDirective;

  constructor(public modalRef: MDBModalRef,private apiNotification: ApiNotificationService, private globalFunc: StaticObjectsService,  private toastrService: ToastService, private apiAppointments: ApiAppoinmtmentsService,private apiOpenSalon: ApiOpensalonService,private translate: TranslateService) { }

  ngOnInit() {
    this.isLoading = false;
    this.host = localStorage.getItem("host");
    this.blockedStatus ="";
    this.UID = localStorage.getItem("uid");
    this.curOp = this.globalFunc.getMobileOperatingSystem();
    this.screenHeight = parseInt(localStorage.getItem("screenH")) - 50;
    this.screenHeight = this.screenHeight + 'px'
    if(this.content.isBlocked == true)
    {  

        this.blockedStatus = this.translate.instant('BlockUser.unblockUser');
    }
    else
    {

      if(this.content.isOldAppointment)
      {
        this.blockedStatus = this.translate.instant('BlockUser.blockUser');
      }
      else
      {
        this.blockedStatus = this.translate.instant('BlockUser.blockAndCancelAppointment');
      }

    }
  }

  public displayInfo()
  {
    this.displayBtnClicked = true;
    this.autoAcceptInfoModal.show();
  }

  public autoAcceptAppointment()
  {
    if( this.displayBtnClicked)
    {
      this.displayBtnClicked = false;
      return;
    }
    this.isLoading  = true;
    let uid = this.content.uid;
    this.apiOpenSalon.addUserToSalon(uid)
    .subscribe(
      res => {
        if(res)
        {
          this.isLoading  = false;
          //this.acceptAppointment();
          const options = { positionClass: 'md-toast-top-center', opacity: 0.9, toastClass: 'mt-1 text-center' };
          this.toastrService.success("",this.translate.instant('Common.Done'), options);
  
          this.modalRef.content.isAfterEditAppointment = true;
          this.modalRef.hide();
        }
      })
  }



  public acceptAppointment()
  {
    this.isLoading  = true;
  let salonId = this.content.salonID;
  let minPassed = this.content.minPassed;
  let msgType = 8;
  let imagePath = localStorage.getItem("pathImg");
  let pathImg40x40 = localStorage.getItem("pathImg40x40");
  let host =  localStorage.getItem("host");
  imagePath = imagePath.replace(host,'');
  pathImg40x40 = pathImg40x40.replace(pathImg40x40,'');

  this.apiNotification.updateNotificationStatus(null,msgType,salonId,minPassed,imagePath,pathImg40x40)
  .subscribe(
    res => {
      if(res.msesage == "success")
      {
        const options = { positionClass: 'md-toast-top-center', opacity: 0.9, toastClass: 'mt-1 text-center' };
        this.toastrService.success("",this.translate.instant('Common.Done'), options);

        this.modalRef.content.isAfterEditAppointment = true;
        this.modalRef.hide();
      }
    })
  }




  public showblockModal()
  {
    if(this.content.isBlocked == true)
    {  
      this.unblockModal.show();
    }
    else
    {
      this.blockModal.show();  
    }
  }

  public blockUser()
  {
      
    this.apiOpenSalon.setblockedUsers(this.UID,this.content.phoneNum).subscribe(
      res => {

        const options = { positionClass: 'md-toast-bottom-center', opacity: 0.9, toastClass: 'mt-1 text-center' };
        this.toastrService.success("", this.translate.instant('BlockUser.blockSuccessfully') + " " + this.content.phoneNum , options);

        this.modalRef.content.isAfterEditAppointment = true;
        this.modalRef.hide();
      },
      err => { }
    );
  }


  public unblockUser()
  {

    this.apiOpenSalon.removeblockedUsers(this.UID,this.content.phoneNum).subscribe(
      res => {
        const options = { positionClass: 'md-toast-bottom-center', opacity: 0.9, toastClass: 'mt-1 text-center' };
        this.toastrService.success("", this.translate.instant('BlockUser.cancelBlockSuccessfully') + " " + this.content.phoneNum , options);
        this.modalRef.hide();
      },
      err => { }
    );
  }

  
  public closeModal()
  {
    this.modalRef.hide();
  }


  public cancelAppointment() {
    this.apiAppointments.CancelAppointmentByMinPassed(this.content.salonID, this.content.minPassed,this.content.uid,this.content.fDate,this.content.sToken,this.content.salonName,this.content.atMin,this.content.empid,this.content.Type)
      .subscribe(
        res => {
          this.modalRef.content.isAfterEditAppointment = true;
          this.modalRef.hide();
        })
  }
  

  public removeAppointment() {
    this.apiAppointments.removeAppointmentByMinPassed(this.content.salonID, this.content.minPassed)
      .subscribe(
        res => {
          this.modalRef.content.isAfterEditAppointment = true;
          this.modalRef.hide();
        })
  }
 
  sendSMS() {
    let smsTo = "sms:" + this.content.phoneNum;

    var userAgent = navigator.userAgent || navigator.vendor;

    if (/android/i.test(userAgent)) {
      window.open(smsTo, '_self');
    }

    else if (/iPad|iPhone|iPod/.test(userAgent)) {
      window.open(smsTo, '_self');
    }


  }



}
