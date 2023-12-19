import { Component, OnInit, ElementRef, ViewChild, AfterContentChecked, ChangeDetectorRef, OnDestroy, HostListener } from '@angular/core';
import { WOW } from 'wowjs/dist/wow.min';
import { CarouselComponent, MDBModalService, MDBModalRef, ModalDirective, ToastService, SidenavComponent, ImageModalComponent } from 'ng-uikit-pro-standard';
import { ApiOpensalonService } from "../api/api-opensalon.service"
import { ActivatedRoute, Router } from '@angular/router';
import { SalonModel } from '../models/open-salon/salon-model';
import { ServerList } from '../models/open-salon/server-list';
import { WorkTime } from '../models/open-salon/work-time';
import { AuthenticationService } from '../helpers/auth/authentication.service';
import { apiSalonPhotos } from '../api/api-salonphotos.service';
import { StaticObjectsService } from '../helpers/global/static-objects.service';
import { ApiUserService } from '../api/api-user.service';
import { ApiConfigService } from '../api/api-config.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NotificationComponent } from '../notification/notification.component';
import * as moment from 'moment';
import 'moment-timezone';
import { TranslateService } from '@ngx-translate/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { ApiStoreService } from '../api/api-store.service';
import { Category } from '../models/Home/category';
import {SBItemComponent} from 'ng-uikit-pro-standard'
import { Observable } from 'rxjs';
import { DataService } from '../shared/data.service';
import { CropperImageComponent } from '../cropper-image/cropper-image.component';
import heic2any from 'heic2any';
import { ImageHandler } from '../helpers/global/ImageHandler';
//import { NgNavigatorShareService } from 'ng-navigator-share';


declare var android: any;
declare var socialsharing : any;
declare var FirebasePlugin;
declare var cordova: any;
declare var window: any;


interface SalonPanel {
  sModel: SalonModel;
  comment: string[];
  rating: number;
  isFavorite: boolean;

}

@Component({
  selector: 'app-salon-panel',
  templateUrl: './salon-panel.component.html',
  styleUrls: ['./salon-panel.component.scss']
})
export class SalonPanelComponent implements OnInit, OnDestroy, AfterContentChecked {
  //private ngNavigatorShareService: NgNavigatorShareService;
  @ViewChild('commentEl', { static: false }) comment: ElementRef;
  @ViewChild('chatSection', { static: false }) chatSection: ElementRef;
  @ViewChild('storeEl', { static: false }) storeElement: ElementRef;
  @ViewChild('exceededAppoitnemt', { static: false }) private exceededAppoitnemt: ModalDirective;
  @ViewChild('SBItemComponent', { static: false }) private SBItemComponent: SBItemComponent;
  @ViewChild('sidenav', { static: true }) sidenav: SidenavComponent;
  @ViewChild('invisibleModal', { static: false }) invisibleModal: ModalDirective;
  @ViewChild('removeCommentModal', { static: false }) private removeCommentModal: ModalDirective;
  @ViewChild('profileModal', { static: false }) private profileModal: ModalDirective;
  @ViewChild('newFeatureReportModal', { static: false }) private newFeatureReportModal: ModalDirective;
  @ViewChild('carouselRef', { static: false }) private carouselRef: CarouselComponent;
  scrolltop: number = null;
  scrolltop2: number = null;
  isExceededMinAppointment: Boolean = false;
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number;
  isFav: boolean;
  userID: string;
  model: any;
  salonPanelData: SalonPanel;
  cat: ServerList[];
  wTimes: WorkTime[];
  isAdmin: Boolean;
  isOwner: Boolean;
  isLoading = true;
  commmentIsLoading  = false;
  minWorkHour: number;
  maxWorkHour: number;
  minimumServerTime: number;
  comments: any;
  txtBox: string;
  myName: string;
  images: any = [];
  imagesPath: any;
  commentsIsVisible : boolean ;
  host :any;
  headElements: any;
  serverciesHeadElements: any;
  commentImages: any = [];
  profileImage:any = [];
  salonId: string;
  myUserId: string;
  phoneNumber:String;
  lock: Boolean = false;
  percent: number;
  timeIntervalComment: any;
  sanitizedURL: SafeResourceUrl;
  fbLink: string;
  whatsApp: string;
  instaLink: string;
  modalRef: MDBModalRef;
  navbarLabel: string;
  scrollOffset: number = 380;
  fixedPos: boolean = false;
  tabs: any[];
  employeesTabs: any[];
  img100x100Path: string;
  commentImg100x100Path: string;
  userIsBlocked:boolean;
  lastSelectedCommentID: any;
  isOwnStore:boolean;
  public unComment : any;
  public phoneComment : any;
  searchText:any;
  compressedFile: File;
  public profileImg: string = "";
  public thumbProfileImg: string = "";
  public categories: Category[] = [];
  public lat = 51.678418;
  public lng = 7.809007;
  public aInfo : any;
  public isImageProfileClicked : boolean;
  public isUploadProfileClicked : boolean;
  public isShareIconClicked : Boolean;
  public isNotificationClicked : Boolean;
  public curOp : any;
  public newNotificationCount : number;
  public isHaveStore : any;
  public smallProfileImg : any;
  public isVisible : Boolean;
  public visibilityBody : string;
  imageChangedEvent: any = '';
  smallprofImg: any;

  public outerStrokeColor : string = '#12B4FD'
  public innerStrokeColor : string = '#D72E2F'


  public openhours : any = [];

  @ViewChild('modalImages', {static: false}) modalImages: ImageModalComponent;

  @ViewChild('modalProfileImage', {static: false}) modalProfileImage: ImageModalComponent;

    triggerModalImageClick(i : number) {
      //alert("test");
      this.modalImages.openGallery(i);
    
  }

  triggerModalProfileClick() {
    //alert("test");
    this.modalProfileImage.openGallery(0);
  }

  constructor(private route: ActivatedRoute, public apiUsers: ApiUserService,
    private salonPhotos: apiSalonPhotos, private router: Router,
    private apiOpenSalon: ApiOpensalonService, private globalFunc: StaticObjectsService,
    private authObj: AuthenticationService,
    private apiStore:ApiStoreService,
    private sanitizer: DomSanitizer,
    private imageHandler: ImageHandler,
    private cdref: ChangeDetectorRef,
    private modalService: MDBModalService,
    private imageCompress: NgxImageCompressService,
    private ng2ImgMax: Ng2ImgMaxService,
    private translate: TranslateService,
    private apiConfig: ApiConfigService,
    private dataService: DataService,
   // ngNavigatorShareService: NgNavigatorShareService,
    private toastrService: ToastService) {
    this.model = {
      rating: 0
    }
   // this.ngNavigatorShareService = ngNavigatorShareService;
    Observable.fromEvent(window, "scroll").subscribe(e => {
      this.onWindowScroll();
    });
  }

  //@HostListener('window:scroll')
  onWindowScroll() {

    if(this.curOp == "PC") return;
    if ((window.pageYOffset || document.documentElement.scrollTop) > this.scrollOffset) {
      this.fixedPos = true;
    }
    else {
      this.fixedPos = false;
    }
  }

  previewImage() {
    event.stopPropagation();
    if(this.isUploadProfileClicked) 
    {
      this.isUploadProfileClicked = false;
      return;
    }
    this.isImageProfileClicked = true;

    this.modalProfileImage.openGallery(0);
    // let path = this.host + this.model.profileimg + "?" + new Date().getTime();
    // this.profileImage = [];
    // this.profileImage.push({ img: path, thumb: path, description: "" });
    //this.profileModal.show();

    setTimeout(() => {
      this.isImageProfileClicked = false;
    }, 300);
  }

  initProfileImage()
  {
    debugger;
    let path = this.host + this.model.profileimg + "?" + new Date().getTime();
    this.profileImage = [];
    this.profileImage.push({ img: path, thumb: path, description: "" });
  }

  previewCommentImages(path: string,un:any,phoneNum:any) {
    this.unComment = un;
    this.phoneComment = phoneNum;
    this.commentImages = [];
    this.commentImages.push({ img: path, thumb: path, description: "" });
  }

  navigateByWaze() 
  {
    window.location.href = "https://www.waze.com/ul?ll=" + this.lat + "," + this.lng + "&navigate=yes&zoom=17";
  }

  navigateByGoogle()
  {
    location.href = "https://www.google.com/maps/search/?api=1&query="+this.lat+","+this.lng;
  }

  addMarker(latitude: any, longitude: any) {
    return;
    event.stopPropagation();
    if(this.isImageProfileClicked || this.isShareIconClicked || this.isUploadProfileClicked  || this.isNotificationClicked )
    {
      this.isImageProfileClicked = false;
      this.isShareIconClicked = false;
      this.isUploadProfileClicked = false;
      return;
    }
    location.href = "https://www.google.com/maps/search/?api=1&query="+latitude+","+longitude;
  }


  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  toggleFav() {
    event.stopPropagation();
    if (!this.lock) {
      this.lock = true;
      this.model.isFavorite = !this.model.isFavorite;
      this.apiUsers.setOrRemoveFavorite(this.salonId, this.myUserId, this.model.isFavorite).subscribe(
        res => {
          this.lock = false;
        },
        err => { }
      );
    }
  }

  loadSalonPhotos(data)
  {
    this.images = [];
    this.commentsIsVisible = true;
    this.imagesPath = data.imagesPath.filter(item => item.status != "removed");
    if(this.imagesPath.length == 0)
    {
     this.commentsIsVisible = false;
    }

    if(this.isOwner)
    {
       localStorage.setItem("salonImagesLength",this.imagesPath.length);
    }
    this.previewImages();
  }

  loadData() {
    this.salonPhotos.getSalonPhotos(this.userID)
      .subscribe(
        res => {
          if (res.data) {
            this.images = [];
            this.commentsIsVisible = true;
            this.imagesPath = res.data.imagesPath.filter(item => item.status != "removed");
            if(this.imagesPath.length == 0)
            {
             this.commentsIsVisible = false;
            }

            if(this.isOwner)
            {
               localStorage.setItem("salonImagesLength",this.imagesPath.length);
            }

            this.host = res.host;

            this.previewImages();
          }
        })

        this.categories = this.globalFunc.getCategories();
  }

  openCropperDialog()
  {
    this.router.navigate(["/CropperImage"]);
  }



  uploadProfileBtn()
  {
   this.isUploadProfileClicked = true;
   setTimeout(() => {
    this.isUploadProfileClicked = false;
   }, 300);
  }

  isHavingStore(){
    this.apiStore.isHavingStore().subscribe(
      res => {
          this.isHavingStore = res.isHave;
      }
    );

  }

  showRemoveCommentModal(id)
  {
    this.lastSelectedCommentID = id;
    this.removeCommentModal.show();
  }

  removeComment()
  {
    this.apiOpenSalon.removeComment(this.lastSelectedCommentID,this.userID).subscribe(
      res => { this.getComment()},
      err => { }
    );
  }


  countStar(star) {
    if (this.model.rating !== star) {
      this.model.rating = star;

      this.apiOpenSalon.setRating(star, this.userID).subscribe(
        res => { },
        err => { }
      );
    }
  }

  additionalInfoUpdate(value:any)
  {
    this.aInfo = value;
  }

  shareWith()
  {
    this.isLoading = true;
    this.isShareIconClicked  = true;
    let my_uid = this.myUserId
    let uid =  this.userID ;
    uid = uid == "-1" ? my_uid : uid;
    let lang =  this.globalFunc.getUserLang();

    this.apiConfig.getDeepLink(uid,lang,'salonpage')
    .subscribe(
      res => {  
        this.isLoading = false;
        if(this.curOp == "PC")
        {
          //this.shareFromPC(uid);
        }
        else
        {
        window["plugins"].socialsharing.share(res.title, null, null, res.deepLink);
        }
      },
      err => { }
    );
  }


  // shareFromPC(uid : any) {
    
  //   if (!this.ngNavigatorShareService.canShare()) {
  //     alert(`This service/api is not supported in your Browser`);
  //     return;
  //   }

  //   var link =window.location.href;
  //   if(!link)
  //   {
  //     link = document.URL;
  //   }

  //   if(link.indexOf("id=") == -1)
  //   {
  //     link = link + ";id=" + uid;
  //   }
 
  //   this.ngNavigatorShareService.share({
  //     title: 'Salotime Link',
  //     text: 'I want to share with you a link to the Salotime app',
  //     url: link
  //   }).then( (response) => {
  //     console.log(response);
  //   })
  //   .catch( (error) => {
  //     console.log(error);
  //   });
  // }


  openNotification()
  {
    this.newNotificationCount = 0;
    this.isNotificationClicked = true;

    this.router.navigate(["/Notification"]);


  /*  this.modalRef = this.modalService.show(NotificationComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: false,
      class: 'h-75',
      containerClass: 'h-75',
      animated: true,
      data: {
          heading: this.translate.instant('Appointment.ModalHeading')
      }
  });

  this.modalService.closed.subscribe((result: any) => {
    if(this.modalRef.content.isCommentEvent)
    {
      this.SBItemComponent.toggle(false)
      this.chatSection.nativeElement.scrollIntoView();
    }
  });*/

  
  }

  navigateToComments()
  {
    this.SBItemComponent.toggle(false)
    this.chatSection.nativeElement.scrollIntoView();
  }


  onImagePicked2(event: Event): void {
    this.isLoading = true;

    let file = (event.target as HTMLInputElement).files[0];

    this.imageHandler.openCropImage(file,'', () => { this.onCloseCropImage() } , () => { this.onOpenCropImage() });
  }

  onCloseCropImage() {
    this.smallprofImg = localStorage.getItem('profileimg100x100');
    this.img100x100Path = localStorage.getItem('profileimg100x100');
    this.isLoading = false;
  }

  onOpenCropImage() {
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
  }

 



//ToDo: this function i exist on my profile so need to insert to globalfunction 
  onImagePicked() {
    this.isLoading = true;
    const file = (event.target as HTMLInputElement).files[0];

    const reader = new FileReader();
    const reader100x100 = new FileReader();
    const reader40x40 = new FileReader();

    reader.onload = (event: any) => {
      var orientation = -1;
      this.imageCompress.compressFile(event.target.result, orientation, 50, 50).then(
        result => {

          let Blob = this.imageHandler.dataURItoBlob(result.split(',')[1]);
          this.compressedFile = new File([Blob], file.name, { type: 'image/jpeg' });

          this.ng2ImgMax.resizeImage(this.compressedFile, 40, 40).subscribe(
            result => {
 
              const file40x40 = new File([result], "thumbs40x40_" + result.name, {
                type: result.type,
              });
              reader40x40.onload = () => {

                this.ng2ImgMax.resizeImage(this.compressedFile, 100, 100).subscribe(
                  result => {
                    const file100x100 = new File([result], "thumbs100x100_" + result.name, {
                      type: result.type,
                    });
                    reader100x100.onload = () => {
                      this.setPhoto(this.compressedFile, file40x40, file100x100);
                    }
                    reader100x100.readAsDataURL(file100x100);
                  })

              }
              reader40x40.readAsDataURL(file40x40);
            },
            error => {
              console.log('😢 Oh no!', error);
            }
          )
        });
    };
    reader.readAsDataURL(file);
  }
  

  setPhoto(file: File, file40x40: File, file100x100: File) {
    this.isLoading = true;
    this.apiUsers.setProfile(file, file40x40, file100x100)
      .subscribe(
        res => {

          if (res.message === "not allowed content") {

            this.isLoading = false;
            this.notAllowedContent();
            return;
          }

          setTimeout(() => {

            this.img100x100Path = localStorage.getItem('profileimg100x100').split('?')[0] + "?" + new Date().getTime();

            localStorage.setItem('profileimg100x100',this.img100x100Path);

            this.profileImg = localStorage.getItem('pathImg') + "?" + new Date().getTime();

            let new40x40 = localStorage.getItem('pathImg40x40').split('?')[0] + "?" + new Date().getTime();

            localStorage.setItem("pathImg40x40",new40x40);

            this.isLoading = false;
          }, 200)

        })
        
  }
  getDateFromDateTime(dt : any)
  {
    return dt.split(" ")[0];
  }

  getHourFromDateTime(dt : any)
  {
    return dt.split(" ")[1];
  }

  notAllowedContent() {
    const options = { positionClass: 'md-toast-top-center', opacity: 0.8, toastClass: 'mt-5' };
    this.toastrService.error("Detect Not Allowed Content!.", 'ERROR', options);
  }

  addComment(comment: string) {
    if (comment.trim() == "") return;


    let currentMomentUtc = moment.utc();


    let d = currentMomentUtc.format('D');
    let m = currentMomentUtc.format('M');
    let y = currentMomentUtc.format('YYYY');
    let h = currentMomentUtc.format('H');
    //todo: missing loading 
    this.commmentIsLoading = true;

    let passedMin = this.globalFunc.calculcateMinPassed(parseInt(y), parseInt(m) - 1, parseInt(d), parseInt(h), parseInt(m));
    let lang =  this.globalFunc.getUserLang();
    this.apiOpenSalon.addComment(comment, this.userID, passedMin,lang,this.phoneNumber,this.isOwner).subscribe(
      res => {
        this.model.comments = res.data;
        this.updateDateByTimeZone();
        this.txtBox = "";
        this.commmentIsLoading = false;
      },
      err => { }
    );
  }

  stopPropagation(event)
  {
    event.stopPropagation();
  }

  navigateToInsta(event) {
    event.stopPropagation();
    if (this.instaLink) {
      const AppURL = this.instaLink;
     // window.open(AppURL, '_blank');

     if(this.curOp === "PC")
     {
       window.open(AppURL, "_blank");
       return;
     }

      var ref = cordova.InAppBrowser.open(AppURL, '_blank', 'location=yes');
      ref.addEventListener('loadstart', this.loadstartCallback);
      ref.addEventListener('loadstop', this.loadstopCallback);
    }
  }

  navigateToFB(event) {
    event.stopPropagation();


    if (this.fbLink) {
      const ffbHomePage = this.fbLink.split("facebook.com/")[1];
      const AppURL = 'fb://facewebmodal/f?href=https://it-it.facebook.com/' + ffbHomePage;
      const url = 'https://it-it.facebook.com/' + ffbHomePage;
      if(this.curOp === "PC")
      {
        window.open(url, "_blank");
        return;
      }
      setTimeout(function () {
        var ref = cordova.InAppBrowser.open(url, '_blank', 'location=yes');
        if (this.curOp !== "IOS")
        {
          ref.addEventListener('loadstart', this.loadstartCallback);
          ref.addEventListener('loadstop', this.loadstopCallback);
        }   
      }, 25);

      var ref = cordova.InAppBrowser.open(AppURL, '_blank', 'location=yes');
      if (this.curOp !== "IOS")
      {
        ref.addEventListener('loadstart', this.loadstartCallback);
        ref.addEventListener('loadstop', this.loadstopCallback);
      }   
    }
  }

  loadstartCallback(event) {
    window.plugins.spinnerDialog.show(null, "loading Salotime...");
  }

  loadstopCallback(event) {
    window.plugins.spinnerDialog.hide();
  }


  previewImages() {
    let imPath = this.imagesPath;
    this.images = [];
    for (let i = 0; i < imPath.length; i++) {
      this.images.push({ img: this.host + imPath[i].imagePath , thumb: this.host + imPath[i].imagePath , description: imPath[i].title });
    }
  }

  updateDateByTimeZone() {
    let utcZeroTime;
    for (let i = 0; this.model.comments && i < this.model.comments.length; i++) {
      utcZeroTime = this.model.comments[i].commentTime;
      this.model.comments[i].commentTime = moment(utcZeroTime).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format("DD/MM/YYYY HH:mm");
    }
  }


  scroll(event,el: HTMLElement) {
    event.stopPropagation();
    el.scrollIntoView();
}
sendSms(event) {
  event.stopPropagation();
  window.open('sms:' + this.model.salonPhoneNumber + '?body=', '_self');;
}

sendWhatsApp(event) {
  event.stopPropagation();
}


displayVisibilityModal()
{

  this.visibilityBody = this.isVisible   ?  this.translate.instant('MySalon.invisibleBody') : this.translate.instant('MySalon.visibleBody');
  this.invisibleModal.show();
}

changeVisiblity()
{
  this.isVisible = this.isVisible ? false : true;

  this.apiOpenSalon.setVisibility(String(this.isVisible)).subscribe(
    res => {
        localStorage.setItem("isVisible", String(this.isVisible));
        const options = { positionClass: 'md-toast-top-center', timeOut: 1500,opacity: 0.9, toastClass: 'text-center mt-1' };
        this.toastrService.success("", this.translate.instant('Common.updated'), options);

        this.router.routeReuseStrategy.shouldReuseRoute =  () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(["/salon-panel"]);
    });
}


    changeTheme(id:Number,cName:string,c1: string,c2:string,c3:string,c4:string,c5:string,c6:string,c7:string,needToUpdate:boolean = true) {

              this.globalFunc.changeTheme(c1,c2,c3,c4,c5,c6,c7,this.isOwner);
              this.outerStrokeColor = c6;
              this.innerStrokeColor = c2;

              let obj = 
              {
                "colors":{"id":id,"cName":cName,"c1": c1, "c2": c2, "c3": c3,"c4":c4,"c5":c5,"c6":c6,"c7":c7}
              };

              let obj_str = JSON.stringify(obj);

              if(needToUpdate)
              {
                this.apiOpenSalon.setPreferences(obj_str).subscribe(
                  res => {      
                  },
                  err => { }
                );
              }

    }



  ngOnInit() {  
    this.smallprofImg = localStorage.getItem('profileimg100x100');
    this.img100x100Path = localStorage.getItem('profileimg100x100');


    this.translate.get('MySalon.Day').subscribe((translated: string) => {
      this.headElements = [this.translate.instant('MySalon.Day'), this.translate.instant('MySalon.From'), this.translate.instant('MySalon.At')];
      this.serverciesHeadElements = [this.translate.instant('MySalon.Service'), this.translate.instant('MySalon.Duration'), this.translate.instant('MySalon.Price')];
      this.userID = this.route.snapshot.paramMap.get('id') == null ? "-1" : this.route.snapshot.paramMap.get('id');
      this.myName = localStorage.getItem('fName');
      this.myUserId = localStorage.getItem('uid');
      this.isAdmin = this.authObj.isAdmin();
      this.isOwner = this.authObj.isSalonOwner(this.userID);
      this.phoneNumber = localStorage.getItem('phone');
      this.curOp = this.globalFunc.getMobileOperatingSystem();
      this.smallProfileImg = localStorage.getItem('pathImg40x40') + "?" + new Date().getTime();
      var naviagteTo = this.route.snapshot.paramMap.get('navigateTo');

    debugger;
      //todo need to add default language on global class
      let Lang = localStorage.getItem('Lang') ;
      if(Lang == null)
      {
        localStorage.setItem('Lang','he');
      }
  
      

      let afterColorUpdateFunc = (c1,c2,c3,c4,c5,c6,c7) => {
        this.outerStrokeColor = c6;
        this.innerStrokeColor = c2;

        if(this.isOwner)
        {
        localStorage.setItem("StatusBarColor",c6);
        }
      }
   

      let onDeviceReady = () => {
        if (this.curOp === "IOS" && this.isOwner) { 
          FirebasePlugin.grantPermission(function(hasPermission){ });
         }
      }
      if (this.curOp === "IOS" && this.isOwner) { 
         document.addEventListener('deviceready', onDeviceReady, false);
      }
      

      function addPrefixToNumber(number : any)
      {
        if(!number) return null;

        if(number.startsWith("972"))
        {
          number= "+" + number.trim() ;
        }
        else if(!number.startsWith("+972"))
        {
          number= "+972" + number.trim() ;
        }
        return number;
      }

      //todo no need to call to server to get field , we must change logic here.
      //this.isHavingStore();

      //this.loadData();
      
      this.apiOpenSalon.getSalonPanel(this.userID, this.myUserId)
        .subscribe(
          res => {
            debugger;
            this.isHaveStore = res.isHaveStore;

            if(res.data.isVisible)
            {
              localStorage.setItem('isVisible',res.data.isVisible);
              this.isVisible = res.data.isVisible == 'true';
            }

            localStorage.setItem('isHaveStore',this.isHaveStore);

            localStorage.setItem('salonNumber',res.data.salonPhoneNumber);

            localStorage.setItem('salonLocation',res.data.address.location);

            this.newNotificationCount = res.notificationCount;
            
            this.isExceededMinAppointment = res.isExceededMinAppointment;

            this.host = res.host;


        
            if(res.data.preferences)
            {
              let colorsObj_str = res.data.preferences.colors;
              this.globalFunc.updateAndChangeTheme(colorsObj_str,this.isOwner,afterColorUpdateFunc);
              if(!localStorage.getItem("defaultColors") && this.isOwner)
              {
                localStorage.setItem("defaultColors",colorsObj_str) 
              }
            }
            else
            {
              this.globalFunc.defaultTheme();
            }

            if(res.salonPhotos)
            {
            this.loadSalonPhotos(res.salonPhotos);
            }

            if(this.isExceededMinAppointment)
            {
              this.exceededAppoitnemt.show();
            }

            this.userIsBlocked = res.userIsBlocked;
            this.model = res.data;

            this.initProfileImage();


            this.lat =  parseFloat(this.model.address.lat);
            this.lng =  parseFloat(this.model.address.lon);

            this.openhours.push({day: "Sun" , day_display:this.translate.instant('updateSalon.Days.Sun'), hours: this.translate.instant('Common.closed'), isDayOff : true});
            this.openhours.push({day: "Mon" , day_display:this.translate.instant('updateSalon.Days.Mon'), hours: this.translate.instant('Common.closed'), isDayOff : true});
            this.openhours.push({day: "Tue" , day_display:this.translate.instant('updateSalon.Days.Tue'), hours: this.translate.instant('Common.closed'), isDayOff : true});
            this.openhours.push({day: "Wed" , day_display:this.translate.instant('updateSalon.Days.Wed'), hours: this.translate.instant('Common.closed'), isDayOff : true});
            this.openhours.push({day: "Thu" , day_display:this.translate.instant('updateSalon.Days.Thu'), hours: this.translate.instant('Common.closed'), isDayOff : true});
            this.openhours.push({day: "Fri" , day_display:this.translate.instant('updateSalon.Days.Fri'), hours: this.translate.instant('Common.closed'), isDayOff : true});
            this.openhours.push({day: "Sat" , day_display:this.translate.instant('updateSalon.Days.Sat'), hours: this.translate.instant('Common.closed'), isDayOff : true});
        

         
            localStorage.setItem("host",this.host);
            this.salonId = this.model.salonId;
            this.comments = this.model.comments;
            this.percent = this.model.finalrating.score / 5 * 100;
            this.fbLink = this.model.fbLink;
            this.whatsApp = addPrefixToNumber(this.model.whatsAppNumber);
            this.instaLink = this.model.instaLink;
            this.updateDateByTimeZone();

            if(this.isOwner)
            {
              this.img100x100Path = localStorage.getItem("profileimg100x100");
            }
            else
            {
            this.model.profileimg100x100 += "?" + new Date().getTime();
            this.img100x100Path = this.host  +  this.model.profileimg100x100;
            }


            this.commentImg100x100Path = localStorage.getItem("profileimg100x100");

            let index = 0;
            let fromDays: Array<number> = [];
            let atDays: Array<number> = [];
            let minServiceTime: Array<number> = [];
      
   

            let fromArr = [];
            let toArr = [];
            for(let i=0;i<this.model.employees.length;i++)
            {
              index = 0;
              this.model.employees[i].workTimeObj.forEach(element1 => {
                let daysObj = this.model.employees[i].workTimeObj[index++];
                daysObj.daysDropDown.forEach(element2 => {
                  let fArr = element1.from.split(":");
                  let atArr = element1.at.split(":");
                  fromDays.push(parseInt(fArr[0]));
                  atDays.push(parseInt(atArr[0]));
                  var foundIndex = this.openhours.findIndex(x => x.day == element2);
                  let fromInMin = Number(fArr[0]) * 60 + Number(fArr[1]);
                  let atInMin = Number(atArr[0]) * 60 + Number(atArr[1]);
                  let to_index = toArr.findIndex(x=>x.index == foundIndex);
                  let from_index = fromArr.findIndex(x=>x.index == foundIndex);

                  if(to_index != -1)
                  {
                    if(atInMin > toArr[to_index].at)
                    toArr[to_index].at = atInMin;
                  }
                  else
                  {
                    toArr.push({index:foundIndex,at:atInMin});
                  }

                  if(from_index != -1)
                  {
                    if(fromInMin < fromArr[to_index].from)
                    fromArr[to_index].from = fromInMin;
                  }
                  else
                  {
                    fromArr.push({index:foundIndex,from:fromInMin});
                  }

                  this.openhours[foundIndex].isDayOff = false;
                });
              });

            }

            for(let i=0;i<fromArr.length;i++)
            {
              fromArr[i].from = this.globalFunc.convertMintuesToHHMM(fromArr[i].from);
              toArr[i].at = this.globalFunc.convertMintuesToHHMM(toArr[i].at);
              let index = Number(fromArr[i].index);
              this.openhours[index].hours = fromArr[i].from  + "-" + toArr[i].at;
            }

            for(let i=0;i<this.model.employees.length;i++)
            {
              this.model.employees[i].subServersObj.forEach(item => {
                minServiceTime.push(parseInt(item.subServiceTime));
              });
            }


            this.navbarLabel = this.translate.instant('Common.Salon');
            this.minWorkHour = Math.min.apply(null, fromDays);
            this.maxWorkHour = Math.max.apply(null, atDays);

            this.minimumServerTime = Math.min.apply(null, minServiceTime);

            if (this.isAdmin) {
              let obj = { minWH: this.minWorkHour, maxWH: this.maxWorkHour, minST: this.minimumServerTime };
              localStorage.setItem('calendarParams', JSON.stringify(obj));

              if(this.isOwner)
              {
                localStorage.setItem("salonName",this.model.salonName);
              }
              
            }

            var subServersObj_groupBy = this.groupBy(this.model.employees[0].subServersObj, "typeID");
    

            this.employeesTabs = [];
            var dataArr = [];
       
            var obj: any;
            for(let i=0;i<this.model.employees.length;i++)
            {
              this.tabs = [];
              var subServersObj_groupBy = this.groupBy(this.model.employees[i].subServersObj, "typeID");
              subServersObj_groupBy.forEach(element => {
                obj = this.globalFunc.getHebValueBytypeID(element[0].typeID);
                this.tabs.push({ title: obj.name, content: element,path:obj.path});
              });
             
              var path ;
              if(!this.model.employees[i].profile || !this.model.employees[i].profile.profileimg100x100 )
              {
                path = "assets/images/defaultProfilePic.png";
              }
              else
              {
                 path = this.host + this.model.employees[i].profile.profileimg100x100 + "?" + new Date().getTime();
              }
         
              this.employeesTabs.push({name:this.model.employees[i].employeeName,tabs:this.tabs,profile: path});
              dataArr.push({name:this.model.employees[i].employeeName,tabs:this.tabs});

            }

            
            if(this.isOwner)
            {
              //this.openWhatsNewDialog();
            }
         
            this.isLoading = false;
           

      
            setTimeout(() => {
              if(naviagteTo == "Comments")
              {
                this.navigateToComments();
              }
            }, 300);


            setTimeout(() => {
              if (this.imagesPath && this.imagesPath.length > 0) {
                this.carouselRef.nextSlide();
              }
            }, 4000);

            setTimeout(() => {
              this.scrollToBottom();
            }, 0);

          },

          err => { 
              this.router.navigate(["/home"]);
          }
        );

      this.timeIntervalComment = setInterval(() => { this.getComment("true"); }, 300000);
    });
  }

  translateDay(day:any)
  {
    return this.globalFunc.translateDay(day);
  }


  showThemes()
  {
    this.router.navigate(["/Settings",{ activeWindow: 'Themes' }]);
  }



  sendMail() {
    window.location.href = 'mailto:info@salotime.com';
  }


  groupBy(collection, property) {
    var i = 0, val, index,
      values = [], result = [];
    for (; i < collection.length; i++) {
      val = collection[i][property];
      index = values.indexOf(val);
      if (index > -1)
        result[index].push(collection[i]);
      else {
        values.push(val);
        result.push([collection[i]]);
      }
    }
    return result;
  }

  ngOnDestroy() {
    // Will clear when component is destroyed
    if (this.timeIntervalComment)
      clearInterval(this.timeIntervalComment);
  }


  getComment(isFromInterval = "false") {
    this.apiOpenSalon.getComment(this.userID,isFromInterval)
      .subscribe(
        res => {
          this.model.comments = res.data.comments;
        //  this.newNotificationCount = res.notificationCount;
          this.updateDateByTimeZone();
          this.scrollToBottom();
        });
  }


  navigateToStore(){
    this.router.navigate(["/OpenStore"]);
  }

  

  navigateToCalendar(event) {
    event.stopPropagation();
      this.router.navigate(["/calendar", { minH: this.minWorkHour, maxH: this.maxWorkHour, mST: this.minimumServerTime , activeTab: 'calendar' }]);
    }

  navigateToReservationApp() {
    if (this.isOwner) {
      this.router.navigate(["/reservationApp", { id: this.userID, minH: this.minWorkHour, maxH: this.maxWorkHour }]);
    }
    else {
      this.router.navigate(["/reservationApp", { id: this.userID }]);
    }
  }

  ngAfterViewInit() {
    new WOW().init();
  }


  scrollToBottom(): void {
    try {
      this.scrolltop = this.comment.nativeElement.scrollHeight

    } catch (err) { }
  }


}

