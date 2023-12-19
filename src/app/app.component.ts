import { Component, HostListener, OnInit } from '@angular/core';
import { WOW } from 'wowjs/dist/wow.min';
import { NavigationEnd, Router } from "@angular/router"
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { UrlService } from './shared/url.service';
import { StaticObjectsService } from './helpers/global/static-objects.service';
import { ApiUserService } from './api/api-user.service';
import { AuthenticationService } from './helpers/auth/authentication.service';




declare var universalLinks;
declare var FirebasePlugin;
declare var cordova;

declare var window;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})


export class AppComponent implements OnInit {
  public showpassform: Boolean = true;
  previousUrl: string = null;
  currentUrl: string = null;
  lastSalonUrl : string;
  isSalonOwner : boolean;
  public screenHeight: any;


  model = {
    left: true,
    middle: false,
    right: false
  };
  constructor(public router: Router,  private authObj: AuthenticationService,private apiUser: ApiUserService,private globalFunc: StaticObjectsService,private urlService: UrlService, private translate: TranslateService ) {

    let Lang = localStorage.getItem("Lang");
    if (Lang) {
      translate.setDefaultLang(Lang);
      this.globalFunc.changeCssFile(Lang);
       this.loadScripts(Lang);
    }
    else {
        translate.setDefaultLang('en');
        this.globalFunc.changeCssFile('en');
        this.loadScripts('en');
        localStorage.setItem("Lang","en");
    }
    this.getScreenSize();
    this.globalFunc.clearsCategories();
    this.globalFunc.setCategories();

  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    if(!this.screenHeight)
    {
      localStorage.setItem("screenH",String(screen.height));
      localStorage.setItem("screenW",String(screen.width));
        this.screenHeight = screen.height + "px";
        this.changeBodyClass();
    }
  }

  changeBodyClass() {
    // get html body element
    const bodyElement = document.body;
    const htmlElement = document.getElementsByTagName("html")[0];

    if (bodyElement) {
      //bodyElement.style.minHeight = this.screenHeight ;
      //htmlElement.style.minHeight = this.screenHeight ;
    }
  }

  
  setPreferences() {
      this.globalFunc.defaultTheme();
  }


  ngOnInit(): void {
    this.isSalonOwner = this.authObj.isAdmin();
    if(this.isSalonOwner && localStorage.getItem("defaultColors"))
    {
      this.globalFunc.setDefaultColors();
    }
    else
    {
      this.setPreferences();
    }




    let onDeviceReady = () => {
      let tempRouter = this.router;

      if(window.MobileAccessibility){
        window.MobileAccessibility.setTextZoom(95, this.setTextZoomCallback);
        }

        cordova.getAppVersion.getVersionNumber().then(result => { 
          let isUserIsLogin = localStorage.getItem("uid") ? true : false;
          let currentVersion =  localStorage.getItem("version");
          if(currentVersion != result)
          {
            localStorage.setItem("version",result);
            if(isUserIsLogin)
            {
              //update Version
              this.apiUser.updateVersion(result).subscribe(
                res => {
                },
                err => { 
                }
              );
          
            }
          }

  
        });

        //*todo: need to use dynamiclink firebase instead of cordova deeplink plugin (dynamiclinks firebase already installed)*/
        cordova.plugins.firebase.dynamiclinks.getDynamicLink().then((data: any) => {

          if (data) {
  
            try
            {
                let deepLink = data.deepLink;
  
                let paramters =  decodeURIComponent(deepLink);
                
                let invitedToName = paramters.split("invitedToName=")[1].split("?")[0];
           
                let invitedById = paramters.split("invitedById=")[1].split("?")[0];
    
                let invitedToId = paramters.split("invitedToId=")[1].split("?")[0];
    
                this.invokeByDeepLink(invitedById,invitedToId,invitedToName);
  
            }
            catch(error)
            {
              console.log("exception:" + error.message);
            }
  
          }
          });
  
      cordova.plugins.firebase.dynamiclinks.onDynamicLink((data: any) => {

        if (data) {

          try
          {

            let deepLink = data.deepLink;

            let paramters =  decodeURIComponent(deepLink);          

            let invitedToName = paramters.split("invitedToName=")[1].split("?")[0];
           
            let invitedById = paramters.split("invitedById=")[1].split("?")[0];

            let invitedToId = paramters.split("invitedToId=")[1].split("?")[0];

            this.invokeByDeepLink(invitedById,invitedToId,invitedToName);

          }
          catch(error)
          {
            console.log("exception:" + error.message);
          }

        }
        });



        universalLinks.subscribe('openNewsListPage', (eventData: any) => {
          try
          {
            let params = eventData.params;
     
            let invitedById = params.invitedById; //salon id or user id

            let invitedToId = params.invitedToId;
            
            var invitedToName = params.invitedToName;

            this.invokeByDeepLink(invitedById,invitedToId,invitedToName);
          }
          catch(ex){
            alert(ex.message);
          }
         
      });
        universalLinks.subscribe('openNewsDetailedPage', this.onNewsDetailedPageRequested);
        universalLinks.subscribe('launchedAppFromLink', this.onApplicationDidLaunchFromLink);
    };



    document.addEventListener('deviceready', onDeviceReady, false);
  }


   setTextZoomCallback(textZoom) {
    console.log('WebView text should be scaled ' + textZoom + '%')
 }


 
 invokeByDeepLink(invitedById : any,invitedToId : any,invitedToName : any)
 {
  try
  {

    var invitedById = invitedById; //salon id or user id

    var invitedToId = invitedToId;
    
    var invitedToName = invitedToName;


    if(!invitedToName)
    {
      invitedToName = "Home";
    }


    let isNewUser  = localStorage.getItem("fName") ? false : true;
    let isUserIsLogin = localStorage.getItem("uid") ? true : false;


    if(isUserIsLogin && invitedToId && invitedToName == "salonpage")
    {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(["/salon-panel", { id: invitedToId }]);
      return;
    }


    if(isNewUser)
    {
      localStorage.setItem("downloadBy",invitedById);
    }

     localStorage.setItem("InvitedToId",invitedToId);
     localStorage.setItem("InvitedToName",invitedToName);
  }
  catch(ex){
    alert(ex.message);
  }
 
 }


 onNewsDetailedPageRequested(eventData)
 {
  console.log('Showing to user details page for some news');
 }

 
 onApplicationDidLaunchFromLink(eventData)
 {
  console.log('Did launch app from the link: ' + eventData.url);
 }



  // Method to dynamically load JavaScript 
  loadScripts(lang) {
    let element = document.getElementById("mapsGoogleApi");
    if (element) {
      element.parentNode.removeChild(element);
    }
    const script = document.createElement('script');
    script.id = "mapsGoogleApi";
    script.src = 'https://maps.googleapis.com/maps/api/js?radius=50&language=' + lang + '&key=AIzaSyBy53hKpD250Cn_IkQHyP9Lt2Ysv_8oxH0&libraries=places';
    document.getElementsByTagName('head')[0].appendChild(script);
  }


  ngAfterViewInit(): void {

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
  ).subscribe((event: NavigationEnd) => {
    if(this.isSalonOwner && localStorage.getItem("defaultColors"))
    {
      this.globalFunc.setDefaultColors();
    }
    this.previousUrl =  this.currentUrl;
    this.previousUrl  = this.getPreviousUrl(event.url,this.previousUrl);
    this.currentUrl = event.url;
    console.log("this.previousUrl " + this.previousUrl)
    this.urlService.setPreviousUrl(this.previousUrl);
  });

    // Your code
    new WOW().init();
  }

  setScale(scale)
  {
    if(window.MobileAccessibility){
      window.MobileAccessibility.setTextZoom(scale, this.setTextZoomCallback);
    }
  }



  getPreviousUrl(cur: string , prev : string) {
    
    const htmlElement = document.getElementsByTagName("html")[0];
    htmlElement.scrollTop = 0;

    let backUrl = "";


    if(cur.indexOf("salon-panel") != -1)
    {
      this.lastSalonUrl = cur;
      backUrl = "/home";
    }

    else if(cur.indexOf("calendar") != -1)
    {
      backUrl =  this.lastSalonUrl ;
    }

    else if(cur.indexOf("my-appointment") != -1 && prev && (prev.indexOf("reservationApp") != -1 || prev.indexOf("salonUsers")))
    {
      backUrl = "/home";
    }

    else if(cur.indexOf("update-salon") != -1 && prev && (prev.indexOf("/Image") != -1 || prev.indexOf("salonUsers")))
    {
      backUrl = "/salon-panel";
    }



    //else if(cur.indexOf("salonUsers") != -1)
    //{
     // backUrl = "/salon-panel";
    //}

    /*if(cur.indexOf("open-salon") != -1 || cur.indexOf("salon-panel") != -1)
    {
      this.setScale(100);
    }
    else
    {
      this.setScale(90);
    }*/

    backUrl = backUrl ? backUrl : prev;
    return backUrl;
  }



  public toGotWebsite(): void {

    var pass = (<HTMLInputElement>document.getElementById("password")).value;
    if (pass == "nopainnogain") {
      this.showpassform = false;
      this.router.navigate(['/login'])
    }

  }

}

