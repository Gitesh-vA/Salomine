import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ModalDirective } from 'ng-uikit-pro-standard';
import { ApiAppoinmtmentsService } from '../api/api-appointments.sevice';
import { ApiNotificationService } from '../api/api-notification.service';
import { ApiOpensalonService } from '../api/api-opensalon.service';
import { AuthenticationService } from '../helpers/auth/authentication.service';
import { StaticObjectsService } from '../helpers/global/static-objects.service';

@Component({
  selector: 'app-notification-template',
  templateUrl: './notification-template.component.html',
  styleUrls: ['./notification-template.component.scss']
})
export class NotificationTemplateComponent implements OnInit {

  constructor(private sanitizer:DomSanitizer,private globalFunc: StaticObjectsService,private apiAppointments: ApiAppoinmtmentsService,private authObj: AuthenticationService,private apiOpenSalon: ApiOpensalonService,  private apiNotification: ApiNotificationService, private router: Router) { }

  model: any;
  isLoading : any;
  host : any;
  selectedId : any;
  belongToUserId : any;
  msgType : any;
  image: any = [];
  selectedName : any;
  selectedPoneNum : any;
  myUserId : any;
  bottomTitle : any;
  bottomBody : any;
  bottomProfilePath40x40 : any;
  AutoAcceptInfoVisible : Boolean = false;
  AutoAcceptMsgVisible : Boolean = false;
  isForUser : Boolean;
  isSalonOwner : Boolean;
  salonId: any;
  payload :any;
  @Input() notificationType = '';
  curMinPassed : any;
  isWaitingList : Boolean;
  

  @ViewChild('bottomModal', { static: false }) private bottomModal: ModalDirective;
  @Output() notifyParent = new EventEmitter<boolean>();


  ngOnInit() {
    this.host =  localStorage.getItem("host");
    this.myUserId = localStorage.getItem('uid');
    this.isLoading = true;
    this.isWaitingList = this.notificationType == 'waitingUsers';
    this.getnotification(this.notificationType);
  }

   stringToHTML = function (str) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body;
  };

  updateDateByTimeZone() {
    let utcZeroTime;
    for (let i = 0; this.model && i < this.model.length; i++) {
      utcZeroTime = this.model[i].createdAt;
      this.model[i].createdAt = moment(utcZeroTime).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format("DD/MM/YYYY HH:mm");
    }
  }

  AcceptUser(notificationID : any,msgType : Number,salonId : Number,payload : any)
  {


    var payload = JSON.parse(payload);
    var minPassed = payload.minPassed;
    this.isLoading = true;

    let imagePath = localStorage.getItem("pathImg");
    let pathImg40x40 = localStorage.getItem("pathImg40x40");
    let host =  localStorage.getItem("host");
    imagePath = imagePath.replace(host,'');
    pathImg40x40 = pathImg40x40.replace(host,'');

    this.apiNotification.updateNotificationStatus(notificationID,msgType,salonId,minPassed,imagePath,pathImg40x40)
    .subscribe(
      res => {
        if(res.msesage == "success")
        {
          if(this.isWaitingList)
          {
            this.model =  this.model.filter(function( obj ) {
              return obj._id != notificationID;
            });
          }
          else
          {
            let index =  this.model.findIndex(function( obj ) {
              return obj._id == notificationID;
            });

            this.model[index].messageType = this.model[index].messageType == 6 ? 8 : 9;
          }
         this.isLoading = false;
        }
      })
  }



  DeclineUser(notificationID : any,msgType : Number,salonId : Number,payload : any)
  {


    var payload = JSON.parse(payload);
    var minPassed = payload.minPassed;
    this.isLoading = true;

    let imagePath = localStorage.getItem("pathImg");
    let pathImg40x40 = localStorage.getItem("pathImg40x40");
    let host =  localStorage.getItem("host");
    imagePath = imagePath.replace(host,'');
    pathImg40x40 = pathImg40x40.replace(host,'');
    this.apiNotification.updateNotificationStatus(notificationID,msgType,salonId,minPassed,imagePath,pathImg40x40)
    .subscribe(
      res => {
        if(res.msesage == "success")
        {
          let index =  this.model.findIndex(function( obj ) {
            return obj._id == notificationID;
          });
          this.model[index].messageType = this.model[index].messageType == 6 ? 10 : 11;
         this.isLoading = false;
        }
      })
  }


  AutoAccept()
  {
  
    this.isLoading = true;

    this.apiOpenSalon.addUserToSalon(this.belongToUserId)
    .subscribe(
      res => {
        debugger;
        if(res)
        {
          this.notifyParent.emit(true);
          //todo need to do it in one call
         /*var data = this.model.filter(x=>x.belongToUserId== this.belongToUserId && (x.messageType == 6 || x.messageType == 7));
          
          for(let i=0;i < data.length;i++)
          {
            this.isLoading = true;
            let mType = data[i].messageType == 6 ? 8 : 9;
            let sid = data[i].salonUserId;
            let pload =  data[i].payload;
            let id =  data[i]._id;
            this.AcceptUser(id,mType,sid,pload);
          }*/


          let newArr = [];
          for(let i=0;i<this.model.length;i++)
          {
            if(!(this.model[i].belongToUserId == this.belongToUserId && (this.model[i].messageType == 6 || this.model[i].messageType == 7)))
            {
              newArr.push(this.model[i]);
            }
          }

          this.model = newArr;

          this.AutoAcceptInfoVisible = true;
          this.openBottomModal2();

          this.isLoading = false;

        }
      })
  }

  removeAllNotification()
  {
    debugger;
    this.bottomModal.hide();
    this.isLoading = true;
    this.isSalonOwner  = this.authObj.isAdmin();
    let version = '2.8.12';
    this.apiNotification.removeAllNotification(this.isSalonOwner,version)
    .subscribe(
      res => {
        if(res.data)
        {
          debugger;
          this.model = res.data;
          this.isLoading = false;
        }
      })
  }
  removeNotification()
  {
    this.bottomModal.hide();
    var _id = this.selectedId;
 
   this.apiNotification.removeNotification(this.selectedId)
    .subscribe(
      res => {
        if(res.data)
        {
          this.model =  this.model.filter(function( obj ) {
            return obj._id !== _id;
          });
          this.isLoading = false;
        }
      })
  }

  public cancelAppointment() {
    debugger;
    var _id = this.selectedId;
    let model = this.model.find(x=>x._id == _id);

    if(!model) return;
    
    let payload = JSON.parse(model.payload);
    let sid = model.salonUserId;
    let uid = model.belongToUserId;
    let sName = model.salonName;
    let minPassed = model.minPassed;
    let empid = payload.empid;
    let fDate = payload.day + "/" + payload.month + "/" + payload.year + "  " + payload.fromTime;
    let atMin = payload.atTime;

 
    this.apiAppointments.CancelAppointmentByMinPassed(sid,minPassed,uid,fDate,'',sName,atMin,empid)
      .subscribe(
        res => {
              this.model =  this.model.filter(function( obj ) {
                return obj._id !== _id;
              });

              this.bottomModal.hide();
        })


      
  }

  
  naviagteTo(payload,msgType,salonId)
  { 
    debugger;
    if(msgType == 20 || msgType == 21 || msgType == 22 || msgType == 24 || msgType == 27) //confirmedMessage , waitingConfirmMessage
    {
        if(msgType == 21 || msgType == 20 )
        {
          let Data = JSON.parse(payload);
          let day = Data.day;
          let month = Data.month;
          let year = Data.year;
          let time = Data.fromTime;
          let dateStr = month+"-"+day+"-"+year + " " + time;
          var dateTime = moment(dateStr);
          var currentDateTime = moment();
          if(dateTime.isBefore(currentDateTime))
          {
            this.navigateToMyAppointment("OLD");
          }
          else
          {
            this.navigateToMyAppointment("New");
          }
        }
        else if(msgType == 24 || msgType == 27)
        {
          this.navigateToMyAppointment("Canceled");
        }
        else
        {
          this.navigateToMyAppointment();
        }
    }

    else if(msgType == 23 || msgType == 25 || msgType == 26) //dayOffMsg
    {
      this.router.navigate(["/salon-panel", { id: salonId }]);
    }

    else if(msgType == 6 || msgType == 7)
    {
      this.router.navigate(["/salonUsers", { tab: "waitingAppointments" }]);
    }
    else if(msgType == 4)
    {
      this.router.navigate(["/salon-panel", { navigateTo: 'Comments' }]);
    }
    else
    {
      var obj = JSON.parse(payload);
      let d = obj.day;
      let m = obj.month;
      let y = obj.year;
      if(d != undefined && m != undefined && y!= undefined)
      {
         this.router.navigate(["/calendar", { day: d, month: m, year: y }]);
      }
      //msgType=> canceled appointment 
      else if(msgType == 2)
      {
        this.navigateToMyAppointment("Canceled");
      }
    }
  }

  navigateTosalon(salonId : any)
  {
    this.router.navigate(["/salon-panel", { id: salonId}]);
  }


  navigateToSalonUsers()
  {
    this.router.navigate(["/salonUsers"]);
  }

  navigateToMyAppointment(activeTab : any = "new")
  {
    this.router.navigate(["/my-appointment", { activeTab: 'myAppointment',activeTopTab:activeTab}]);  
  }



  openBottomModal(id,userid,title,body,profilePath40x40,msgType,sid,pload,AutoAcceptInfoVisible=false,AutoAcceptMsgVisible = false)
  {
    this.bottomTitle = title;
    this.bottomBody = body;
    this.bottomProfilePath40x40 = profilePath40x40;
    this.selectedId = id;
    this.belongToUserId = userid;
    this.msgType = msgType;
    this.salonId = sid;
    this.payload = pload;
    this.AutoAcceptInfoVisible = false;
    this.AutoAcceptMsgVisible = false
    this.bottomModal.show();
  }

  openBottomModal2(AutoAcceptMsgVisible = true)
  {
    this.AutoAcceptInfoVisible = false;
    this.AutoAcceptMsgVisible = AutoAcceptMsgVisible
    this.bottomModal.show();
  }

  displayAutoAcceptInfo(AutoAcceptInfoVisible : any)
  {
    this.AutoAcceptInfoVisible = AutoAcceptInfoVisible;
  }

  displayAutoAcceptMsg(AutoAcceptMsgVisible : any)
  {
    this.AutoAcceptMsgVisible = AutoAcceptMsgVisible;
  }



  getnotification(notificationType)
  {
  
    debugger;
    if(this.model &&  this.model.length > 0) 
    {
      this.isLoading = false; 
      return;
    } 

    this.isSalonOwner  = this.authObj.isAdmin();
    this.isForUser = notificationType == 'user';
    this.curMinPassed = this.globalFunc.getMinPassedUntilNow();


    this.apiNotification.getNotification(this.isSalonOwner,this.isForUser,this.isWaitingList,this.curMinPassed )
      .subscribe(
        res => {
          if(res.data)
          {
            debugger;
            this.model = res.data;   
            for(let i=0;i<this.model.length;i++)
            {
              this.model[i].profilePath40x40 +=  "?" + new Date().getTime();
              let utcZeroTime = this.model[i].createdAt;
              this.model[i].createdAt = moment(utcZeroTime).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format("DD/MM/YYYY HH:mm");    
            }
            this.isLoading = false;
          }
        })
  }

  setnotification()
  {
    this.apiNotification.setNotification()
      .subscribe(
        res => {
        })
  }

  
loadImage(path: string,un:any,phoneNum:any) {
   this.image = [];
   this.selectedName = un;
   this.selectedPoneNum = phoneNum;
   let defaultpath = 'assets/images/defaultProfilePic.png' ;
   if(!path || !this.globalFunc.isImageUrl(path))
   {
    path = defaultpath ;
   }
   path +=  "?" + new Date().getTime();

   this.image.push({ img: path, thumb: path, description: "" });
}

}