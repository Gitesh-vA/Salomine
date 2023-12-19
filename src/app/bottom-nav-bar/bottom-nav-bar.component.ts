import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiNotificationService } from '../api/api-notification.service';
import { AuthenticationService } from '../helpers/auth/authentication.service';

@Component({
  selector: 'app-bottom-nav-bar',
  templateUrl: './bottom-nav-bar.component.html',
  styleUrls: ['./bottom-nav-bar.component.scss']
})
export class BottomNavBarComponent implements OnInit {

  public activeTab: string = "";
  public isAdmin: any ;
  @Input()
  public smallProfileImg : any ;
  public newNotificationCount = 0;
  


  @Output() showNavbar = new EventEmitter<string>();

  @Input() notificationNumber = ''; 
  
  constructor( private router: Router,private route:ActivatedRoute,private apiNotification: ApiNotificationService,private authObj: AuthenticationService) {

    route.params.subscribe(params => {
      
      let activeTab = params.activeTab;
      let uid= this.route.snapshot.paramMap.get('id') == null ? "-1" : this.route.snapshot.paramMap.get('id');
      let isOwner = this.authObj.isSalonOwner(uid);


      if(this.router.url == "/home" || this.router.url == "/defualtPage")
      {
        activeTab = "home";
      }
      else if(this.router.url.indexOf("salon-panel") != -1 && isOwner)
      {
        activeTab = "mysalon";
      }
      else if(this.router.url.indexOf("calendar") != -1)
      {
        activeTab = "calendar";
      }
      else if(this.router.url.indexOf("notification") != -1 )
      {
        activeTab = "notification";
      }
      else if(this.router.url.indexOf("myAppointment") != -1)
      {
        activeTab = "myAppointment";
      }


      this.changeActiveTab(activeTab);
   });
   }

  ngOnInit() {
    this.isAdmin = this.authObj.isAdmin();
    this.smallProfileImg = localStorage.getItem('pathImg40x40');
    if(this.activeTab != "notification")
    {
    this.getNotificationNumber();
    }
    else
    {
      this.newNotificationCount = 0;
    }


  }

  public async getNotificationNumber()
  {
    //2 = user
    //1 = salon 
    let isBelongTo = this.isAdmin  ? 1 : 2;

    this.apiNotification.getNewNotificationCount(isBelongTo).subscribe(
      res => {
        this.newNotificationCount = res.notificationCount;
      },
      err => { }
    );
  }


  public changeActiveTab(activeTab): void {
    if(activeTab)
    {
      this.activeTab = activeTab;

    }
  }


  

  navigateToCalendar() {

    let calendarParams = JSON.parse(localStorage.getItem("calendarParams"));

    if (calendarParams && calendarParams.minWH) {
      this.router.navigate(["/calendar", { minH: calendarParams.minWH, maxH: calendarParams.maxWH, mST: calendarParams.minST, from: 'home', activeTab: 'calendar' }]);
    }
  }

  showNavBar()
  {
    this.showNavbar.emit();
  }

  getRecently()
  {
    this.router.navigate(["/home", { activeTab: 'Recent' }, {outlets: {popup: null}}]);
  }
  
  getNotification()
  {
    this.router.navigate(["/UserNotifications", { activeTab: 'notification' }, {outlets: {popup: null}}]);
  }

  getFavorites()
  {
    this.router.navigate(["/home", { activeTab: 'Favorite' }, {outlets: {popup: null}}]);
  }

  getHome()
  {
    this.router.navigate(["/home", { activeTab: 'home' }, {outlets: {popup: null}}]);
  }

  getMyAppointment()
  {
    this.router.navigate(["/my-appointment", { activeTab: 'myAppointment' }, {outlets: {popup: null}}]);
  }

}
