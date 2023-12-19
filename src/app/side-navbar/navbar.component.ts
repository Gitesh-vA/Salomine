import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../helpers/auth/authentication.service';
import { StaticObjectsService } from '../helpers/global/static-objects.service';
import { ApiOpensalonService } from '../api/api-opensalon.service';
import { ModalDirective } from 'ng-uikit-pro-standard';
import { ModalComponent } from '../modal/modal.component';
import { ApiConfigService } from '../api/api-config.service';
import { ApiUserService } from '../api/api-user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public profileImg : any;
  public isAdmin: boolean;
  public salonName:any;
  public smallProfileImg;
  public iso:any;
  public curOp:any;
  public isVisible : boolean;
  public curVer : any;
  public tempVisible : boolean = false;
  public isHavingStore : boolean = false;
  public isLoading : boolean = false
  public myAppointmentIsVisible : boolean = false;
  @ViewChild('invisibleModal', { static: false }) invisibleModal: ModalDirective;
  @Input('isHasList') isHasList: string;
  @Input('isSalonOwner') isSalonOwner: string;
  @Input('isSalonView') isSalonView: string;
  @Input('isSalonVisible') isSalonVisible: string;
  @Input('currentPage') currentPage: string;
  
  
  @Output() displayVisibilityModal = new EventEmitter<string>();

  @Output() shareDeepLink = new EventEmitter<string>();

  @Output() displayDeleteAccountModal = new EventEmitter<string>();
  
  


  constructor(private router: Router,private apiUser: ApiUserService, private apiConfig: ApiConfigService,private staticObj: StaticObjectsService,private OpensalonService: ApiOpensalonService, private authObj: AuthenticationService,private translate: TranslateService) { }

  ngOnInit() {
    this.isSalonView = this.isSalonOwner;
    this.profileImg = localStorage.getItem('profileimg100x100') + "?" + new Date().getTime();
    this.smallProfileImg = localStorage.getItem('pathImg40x40') + "?" + new Date().getTime();
    this.isAdmin = this.authObj.isAdmin();
    this.myAppointmentIsVisible = this.isAdmin ? this.currentPage == 'home' : true;
    let jsonStr = localStorage.getItem("currentUser");
    let obj = JSON.parse(jsonStr);
    this.iso = obj.user.iso === '61cda11b1ba0fde73c5863c4';
    this.curOp = this.staticObj.getMobileOperatingSystem();
    this.isVisible =  this.isSalonVisible == 'true';
    this.curVer = localStorage.getItem("version");
    this.curVer = this.curVer  ? (this.curVer + 'v')  : '';
    let isHaveStore = localStorage.getItem('isHaveStore');
    this.isHavingStore = isHaveStore ? isHaveStore.toLocaleLowerCase() == "true" : false; 
    this.isLoading = false;

    setTimeout(() => {
      this.tempVisible = true;
    }, 200);

 
    if(this.isAdmin)
    {
      this.translate.get('Home.sideBar.MySalon').subscribe(()=>{
        this.salonName = localStorage.getItem("salonName");
        this.salonName = this.salonName  ? this.salonName : this.translate.instant('Home.sideBar.MySalon');
       })
    }


  }
  
  changeVisiblity()
  {
      this.displayVisibilityModal.emit();
  }

  navigateToSalon()
  {
    this.router.routeReuseStrategy.shouldReuseRoute =  () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(["/salon-panel"]);
  }

  getProfleUrl() {
    return  `url('${this.profileImg})`;
  }

  logout() {
    let curLoc = localStorage.getItem("myLocation");
    let Lang = localStorage.getItem("Lang");
    let fName = localStorage.getItem("fName");
    let version = localStorage.getItem("version");

    localStorage.clear();

    if (curLoc) {
      localStorage.setItem("myLocation", curLoc);
    }

    if(Lang)
    {
    localStorage.setItem("Lang", Lang);
    }

    if(version)
    {
      localStorage.setItem("version", version);
    }
    
    localStorage.setItem("fName", fName);

    this.router.navigate(['/login']);
  }

  navigateToCRM()
  {
    this.router.navigate(["/crm"]);
  }

  navigateToCalendar() {

    let calendarParams = JSON.parse(localStorage.getItem("calendarParams"));

    if (calendarParams && calendarParams.minWH) {
      this.router.navigate(["/calendar", { minH: calendarParams.minWH, maxH: calendarParams.maxWH, mST: calendarParams.minST, from: 'home' }]);
    }
  }

  navigateToMyAppointment()
  {
    this.router.navigate(["/my-appointment", { activeTab: 'myAppointment' }]);
  }


  inviteFriend() {
    this.shareWith();    
  }

  shareWith()
  {
    this.isLoading = true;

    try
    {
      let uid =  localStorage.getItem("uid");
      let lang =  this.staticObj.getUserLang();
      let Name = '';

      if(this.isAdmin)
      {
        Name = 'salonpage';
      }

      this.apiConfig.getDeepLink(uid,lang,Name)
      .subscribe(
        res => {  
          this.isLoading = false;
          window["plugins"].socialsharing.share(res.title, null, null, res.deepLink);
        },
        err => { }
      );
    }
    catch(ex)
    {
      this.isLoading = false;
    }
    
  }

  sendMail() {
    this.isLoading = true;
    try
    {
    this.apiConfig.getEmail()
    .subscribe(
      res => {  
        window.location.href = 'mailto:' + res.email;
        this.isLoading = false;
      },
      err => { }
    );
    }
    catch(ex)
    {
      this.isLoading = false;
    }
  }

  Settings()
  {
    this.router.navigate(['/Settings']);
  }


  deleteAccont(){
    this.isLoading = true;
    try
    {
    this.apiUser.deleteAccount()
    .subscribe(
      res => {  
        localStorage.clear();
        this.router.navigate(['/login']);
        this.isLoading = false;
      },
      err => { }
    );
    }
    catch(ex)
    {
      this.isLoading = false;
    }
  }



}
