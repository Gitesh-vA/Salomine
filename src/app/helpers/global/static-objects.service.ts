import { Injectable } from '@angular/core';
import { Category } from '../../models/Home/category';
import * as moment from 'moment';
import { NgxImageCompressService } from 'ngx-image-compress';
import { HttpResponseBase } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { UrlService } from 'src/app/shared/url.service';
import { Router } from '@angular/router';
import { MDBModalRef, MDBModalService, ToastService } from 'ng-uikit-pro-standard';
import { CropperImageComponent } from 'src/app/cropper-image/cropper-image.component';
import { DataService } from 'src/app/shared/data.service';
import heic2any from 'heic2any';


declare var window: any;
declare var FirebasePlugin;

@Injectable({
  providedIn: 'root'
})
export class StaticObjectsService {


  
  private categories: Category[] = [];
  modalRef: MDBModalRef;

  //y,m-1,d,min,s
  private constMoment = moment([2020, 3, 1, 0, 0]);

  public static isDebugMode : Boolean = false;
  
  public paymentEnabled: boolean = false;

  constructor(private router: Router,
    private modalService: MDBModalService,
    private toastrService: ToastService,
    private urlService: UrlService,
    private translate: TranslateService) {
      

  }

  public clearsCategories() {
    this.categories = [];
  }


  public navigateToPreviousUrl() {
    this.urlService.previousUrl$
      .subscribe((previousUrl: string) => {
        this.router.navigateByUrl(previousUrl);
      });
  }

  public setCategories() {
    this.translate.get('Home.Tatto').subscribe((translated: string) => {
      this.categories.push(new Category("All", "0", "assets/images/mainicons/all.svg", "assets/images/mainicons/all_fill.svg"));
      this.categories.push(new Category(this.translate.instant('Home.Tatto'), "1", "assets/images/mainicons/permanentmakeup.svg", "assets/images/mainicons/permanentmakeup_fill.svg"));
      this.categories.push(new Category(this.translate.instant('Home.Makeup'), "2", "assets/images/mainicons/makeup.svg", "assets/images/mainicons/makeup_fill.svg"));
      this.categories.push(new Category(this.translate.instant('Home.Eyebrow'), "3", "assets/images/mainicons/eyebrows.svg", "assets/images/mainicons/eyebrows_fill.svg"));
      this.categories.push(new Category(this.translate.instant('Home.Barber'), "4", "assets/images/mainicons/barber.svg", "assets/images/mainicons/barber_fill.svg"));
      this.categories.push(new Category(this.translate.instant('Home.Eyelash'), "5", "assets/images/mainicons/eyelashes.svg", "assets/images/mainicons/eyelashes_fill.svg"));
      this.categories.push(new Category(this.translate.instant('Home.Wax'),"6","assets/images/mainicons/removal.svg","assets/images/mainicons/removal_fill.svg"))
      this.categories.push(new Category(this.translate.instant('Home.Cosmetics'), "7", "assets/images/mainicons/cusmmatics.svg", "assets/images/mainicons/cusmmatics_fill.svg"));
      this.categories.push(new Category(this.translate.instant('Home.Nails'), "8", "assets/images/mainicons/nails.svg", "assets/images/mainicons/nails_fill.svg"));
      this.categories.push(new Category(this.translate.instant('Home.HairSalon'), "9", "assets/images/mainicons/hairstyle.svg", "assets/images/mainicons/hairstyle_fill.svg"));
      this.categories.push(new Category(this.translate.instant('Home.Massage'), "10", "assets/images/mainicons/massage.svg", "assets/images/mainicons/massage_fill.svg"));
      this.categories.push(new Category(this.translate.instant('Home.Aesthetics'), "11", "assets/images/mainicons/aesthetics.svg", "assets/images/mainicons/aesthetics_fill.svg"));
      this.categories.push(new Category(this.translate.instant('Home.Piercing'), "12", "assets/images/mainicons/piercing.svg", "assets/images/mainicons/piercing_fill.svg"));
    });
  }


  public dataURItoBlob = (dataURI, datatype = "image/jpeg") => {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: datatype });
    return blob;
  };



  public changeCssFile(lang: string) {
    let headTag = document.getElementsByTagName("head")[0] as HTMLHeadElement;
    let existingLink = document.getElementById("langCss") as HTMLLinkElement;
    let bundleName = lang === "he" ? "rtlStyle.css" : "ltrStyle.css";
    if (existingLink) {
      existingLink.href = bundleName;
    } else {
      let newLink = document.createElement("link");
      newLink.rel = "stylesheet";
      newLink.type = "text/css";
      newLink.id = "langCss";
      newLink.href = bundleName;
      headTag.appendChild(newLink);
    }
  }

  public defaultTheme() {
    document.documentElement.style.setProperty('--dynamic-c1', '#67CCF8');
    document.documentElement.style.setProperty('--dynamic-c2', '#D72E2F');
    document.documentElement.style.setProperty('--dynamic-c3', '#FFD7D7');
    document.documentElement.style.setProperty('--dynamic-c4', '#91F2B2');
    document.documentElement.style.setProperty('--dynamic-c5', '#12B4FD');
    document.documentElement.style.setProperty('--dynamic-c6', '#12B4FD');
    document.documentElement.style.setProperty('--dynamic-c7', '#80CDF7');


    document.documentElement.style.setProperty('--dynamic-private-c1', '#67CCF8');
    document.documentElement.style.setProperty('--dynamic-private-c2', '#D72E2F');
    document.documentElement.style.setProperty('--dynamic-private-c3', '#FFD7D7');
    document.documentElement.style.setProperty('--dynamic-private-c4', '#91F2B2');
    document.documentElement.style.setProperty('--dynamic-private-c5', '#12B4FD');
    document.documentElement.style.setProperty('--dynamic-private-c6', '#12B4FD');
    document.documentElement.style.setProperty('--dynamic-private-c7', '#80CDF7');
  }

  public setDefaultColors()
  {
    let defaultColorObj = localStorage.getItem("defaultColors");
    if(defaultColorObj)
    {
    this.updateAndChangeTheme(defaultColorObj,true);
    }
  }


  public updateAndChangeTheme(colorsObj_str : string,isOwner:Boolean,callbackFunc : any = null)
  {
    try
    {
        if(colorsObj_str)
        {
          let colorsObj = JSON.parse(colorsObj_str);
          this.changeTheme(colorsObj.colors.c1,colorsObj.colors.c2,colorsObj.colors.c3,colorsObj.colors.c4,colorsObj.colors.c5,colorsObj.colors.c6,colorsObj.colors.c7,isOwner);


          try
          {
           window.StatusBar.backgroundColorByHexString(colorsObj.colors.c6);
          }
          catch(ex)
          {

          }
      
          if(callbackFunc)
          {
            callbackFunc(colorsObj.colors.c1,colorsObj.colors.c2,colorsObj.colors.c3,colorsObj.colors.c4,colorsObj.colors.c5,colorsObj.colors.c6,colorsObj.colors.c7,isOwner);
          }

        }
        else
        {
          this.defaultTheme();
        }
    }
    catch
    {
      this.defaultTheme();
    }
  }

  public changeTheme(c1: string,c2:string,c3:string,c4:string,c5:string,c6:string,c7:string,isOwner:Boolean = false,callbackFunc : any = null) {
    let dynamicColor = {color1:c1,color2:c2,color3:c3}
    JSON.stringify(dynamicColor);

            if(!c1 || !c2 || !c3 || !c4 || !c5 || !c6 || !c7 )
            {
              this.defaultTheme();
              return
            }
  
            document.documentElement.style.setProperty('--dynamic-c1', c1);
            document.documentElement.style.setProperty('--dynamic-c2', c2);
            document.documentElement.style.setProperty('--dynamic-c3', c3);
            document.documentElement.style.setProperty('--dynamic-c4', c4);
            document.documentElement.style.setProperty('--dynamic-c5', c5);
            document.documentElement.style.setProperty('--dynamic-c6', c6);
            document.documentElement.style.setProperty('--dynamic-c7', c7);
  
  
  
            if(isOwner)
            {
            document.documentElement.style.setProperty('--dynamic-private-c1', c1);
            document.documentElement.style.setProperty('--dynamic-private-c2', c2);
            document.documentElement.style.setProperty('--dynamic-private-c3', c3);
            document.documentElement.style.setProperty('--dynamic-private-c4', c4);
            document.documentElement.style.setProperty('--dynamic-private-c5', c5);
            document.documentElement.style.setProperty('--dynamic-private-c6', c6);
            document.documentElement.style.setProperty('--dynamic-private-c7', c7);
            }

            if(callbackFunc)
            {
              callbackFunc();
            }
  }


  

  public logout() {
    let curLoc = localStorage.getItem("myLocation");
    let Lang = localStorage.getItem("Lang");
    let fName = localStorage.getItem("fName");
    let version = localStorage.getItem("version");
    let screenH = localStorage.getItem("screenH");
    let screenW = localStorage.getItem("screenW");



    try
    {
     window.StatusBar.backgroundColorByHexString("#10B4FA");
    }
    catch(ex)
    {

    }

    localStorage.clear();

    if (curLoc) {
      localStorage.setItem("myLocation", curLoc);
    }

    if (Lang) {
      localStorage.setItem("Lang", Lang);
    }

    if (version) {
      localStorage.setItem("version", version);
    }

    if (screenH) {
      localStorage.setItem("screenH", screenH);
    }

    if (screenW) {
      localStorage.setItem("screenW", screenW);
    }


    localStorage.setItem("fName", fName);

    this.defaultTheme();

    this.router.navigate(['/login']);
  }

  public getDayName() {
    var arrayOfWeekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    var dateObj = new Date();
    var weekdayNumber = dateObj.getDay();
    var weekdayName = arrayOfWeekdays[weekdayNumber];
    return weekdayName;
  }

  public arrayUnique(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j])
          a.splice(j--, 1);
      }
    }

    return a;
  }




  public getHebValueBytypeID(typeID) {
    var test = this.categories;
    return test.find(x => x.id === typeID);
  }


  public getCategories() {
    return this.categories;
  }


  getUserLang() {
    let lang = localStorage.getItem("Lang");
    lang = lang ? lang : "he";
    return lang;
  }

  public AadMiniutesToTime_HHMM(t: string, m: number) {
    let time = t;
    let totalInMinutes = (parseInt(time.split(":")[0]) * 60) + parseInt(time.split(":")[1]);
    let otherMinutes = m;
    let grandTotal = otherMinutes + totalInMinutes;
    let bookH = Math.floor(grandTotal / 60);
    let bookM = grandTotal % 60;
    let bookingDurationToHour = bookH % 24 + ':' + (bookM.toString().length == 1 ? "0" + bookM : bookM);
    return bookingDurationToHour;
  }

  public calculateDifferenceInMinutes(time1, time2) {
    let time1Array = time1.split(':');
    let time2Array = time2.split(':');
  
    let time1Hours = parseInt(time1Array[0]);
    let time1Minutes = parseInt(time1Array[1]);
  
    let time2Hours = parseInt(time2Array[0]);
    let time2Minutes = parseInt(time2Array[1]);
  
    let totalTime1InMinutes = time1Hours * 60 + time1Minutes;
    let totalTime2InMinutes = time2Hours * 60 + time2Minutes;
    
    let differenceInMinutes = Math.abs(totalTime1InMinutes - totalTime2InMinutes);
    
    return differenceInMinutes;
  }


  public getMinPassedUntilNow() {
    let currentMoment = moment();
    let d = currentMoment.format('D');
    let m = currentMoment.format('M');
    let y = currentMoment.format('YYYY');
    let h = currentMoment.format('H');
    let min = currentMoment.format('m');
    return this.calculcateMinPassed(parseInt(y), parseInt(m) - 1, parseInt(d), parseInt(h), parseInt(min));
  }


  public calculcateMinPassed(y: number, m: number, d: number, h: number, min: number) {
    var appointmentMoment, deff;

    appointmentMoment = moment([y, m, d, h, min]);
    deff = appointmentMoment.diff(this.constMoment, 'minutes');// 1

    return deff;
  }



  public calculcateDayPassed(y: number, m: number, d: number) {
    var appointmentMoment;

    appointmentMoment = moment([y, m, d]);
    let deff = appointmentMoment.diff(this.constMoment, 'days');

    return deff;
  }

  public calculcateDayPassedAtNow() {
    let appointmentMoment = moment();
    let deff = appointmentMoment.diff(this.constMoment, 'days');

    return deff;
  }

  public getDateFromate(d: any, m: any, y: any) {


    return `${d}/${m}/${y}`;
  }

  public getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d.toFixed(1);
  }

  private deg2rad(deg) {
    return deg * (Math.PI / 180)
  }


  public isToday(date: Date) {
    let isToday = moment(date).isSame(moment(), 'day');
    return isToday;
  }

  public isTommorrow(date: Date) {
    let isToday = moment(date).isSame(moment().add(1, 'days'), 'day');
    return isToday;
  }


  public updateCurLocation(successCallBack, failCallBack) {

    var options = {
      enableHighAccuracy: true,
      maximumAge: 0
    };


    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {
          let curLocation = JSON.stringify({ lat: position.coords.latitude, lon: position.coords.longitude });
          localStorage.setItem("myLocation", curLocation);
          if (typeof successCallBack === "function") {
            successCallBack();
          }

          return true;
        }
      },
        (error: any) => {
          if (typeof successCallBack === "function") {
            failCallBack();
          }
          return false;
        }, options);
    } else {
      failCallBack();
      return false;
    }
  }

  translateDay(day) {
    switch (day.toLowerCase()) {
      case "sun":
        return this.translate.instant('updateSalon.Days.Sun');
      case "mon":
        return this.translate.instant('updateSalon.Days.Mon');
      case "tue":
        return this.translate.instant('updateSalon.Days.Tue');
      case "wed":
        return this.translate.instant('updateSalon.Days.Wed');
      case "thu":
        return this.translate.instant('updateSalon.Days.Thu');
      case "fri":
        return this.translate.instant('updateSalon.Days.Fri');
      case "sat":
        return this.translate.instant('updateSalon.Days.Sat');
    }

  }

  mongoObjectId() {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
      return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
  };

  isImageUrl(url) {
    if(url && url != undefined && url.length > 0 && url.indexOf('?') > -1)
    {
      url = url.split('?')[0];
    }
    return (url.match(/\.(jpeg|jpg|gif|svg|bmp|webp|tiff|ico|heic|heif|png)$/) != null);
  }

  convertMintuesToHHMM(min) {
    min = Number(min);
    let hh = String(Math.floor(min / 60));
    let mm = String(min % 60);
    if (hh.length == 1) hh = "0" + hh;
    if (mm.length == 1) mm = "0" + mm;

    return hh + ":" + mm;
  }



  getMobileOperatingSystem2() {
 
    var userAgent = navigator.userAgent || navigator.vendor;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
      return "Android";
    }

    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return "IOS";
    }

    return "PC";
  }


   getMobileOperatingSystem() {
      const userAgent = navigator.userAgent;
      if (/android/i.test(userAgent)) {
        return 'Android';
      } else if (/ipad|macintosh/i.test(userAgent) && !window.MSStream) {
        if (/macintosh/i.test(userAgent)) {
          if(this.detectIOS())
          {
            return 'IOS';
          }
          else {
            return 'PC';
          }
        } 
        else {
          return 'IOS';
        }
      } else if (/iphone/i.test(userAgent) && !window.MSStream) {
        return 'IOS';
      } 
      else {
        return 'PC';
      }
  }

  detectIOS() {

    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    var isAppleDevice = navigator.userAgent.includes('Macintosh');

    var isTouchScreen = navigator.maxTouchPoints >= 1; // true for iOS 13 (and hopefully beyond)

    return isIOS || (isAppleDevice && (isTouchScreen));

  }

  async getToken() {
    try {
      return new Promise<string>((resolve, reject) => {
        try {
          FirebasePlugin.hasPermission(function(hasPermission){
            if (!hasPermission) {
              FirebasePlugin.grantPermission(function(isAccept){
                if (isAccept) {
                  setTimeout(() => {
                      FirebasePlugin.getToken(function (fcmToken) {
                        resolve(fcmToken);
                      }, function (error) {
                          FirebasePlugin.getToken(function (fcmToken) {
                            resolve(fcmToken);
                          }, function (error) {
                            resolve("");
                          })        
                      });
                  }, 500); 
                } else {
                  resolve("");
                }
              });
            } else {
              FirebasePlugin.getToken(function (fcmToken) {
                resolve(fcmToken);
              }, function (error) {
                resolve("");
              });
            } 
          });
        } catch (error) {
          // Handle error
          reject("");
        }
      });
    } catch (ex) {
      // Handle exception
      return "";
    }
  }

  getTokenRefresh() {

    return new Promise((resolve, reject) => {
      FirebasePlugin.onTokenRefresh(function (fcmTokenRefresh) {
        resolve(fcmTokenRefresh);
      }, function (error) {
        reject("error");
      });
    });
  }

  getId() {
    return new Promise((resolve, reject) => {
      FirebasePlugin.getId(function (appIsntanceId) {
        resolve(appIsntanceId);
      }, function (error) {
        reject("error");
      });
    });
  }




  displayLimitationAlert(appointment_Limit,appointment_Count,SMS_limit,SMS_count) {
      let appointment_limit = appointment_Limit;
      let appointment_count = appointment_Count;
      let appointment_left = appointment_limit - appointment_count;
      let SMS_left =  SMS_limit - SMS_count;

      if(!appointment_Limit || Number(appointment_Limit) == -1)
      {
        return;
      }
     
    
      if(appointment_left == 10 || appointment_left == 15)
      {
        const options = { positionClass: 'md-toast-bottom-center', opacity: 0.9,timeOut: 3000, toastClass: 'mb-2 text-center' };
        this.toastrService.warning(this.translate.instant('Appointment.youHaveXAppointmentLeft', { Appointment_Number:appointment_left }),"", options);
      }
      else if(SMS_left == 7)
      {
        const options = { positionClass: 'md-toast-bottom-center', opacity: 0.9,timeOut: 3000, toastClass: 'mb-2 text-center' };
        this.toastrService.warning(this.translate.instant('Appointment.youHaveXSMSLeft', { SMS_Number:SMS_left }),"", options);
      }
      else if(appointment_left <= 5)
      {
        const options = { positionClass: 'md-toast-bottom-center', opacity: 0.9,timeOut: 3000, toastClass: 'mb-2 text-center' };
        this.toastrService.error(this.translate.instant('Appointment.youHaveXAppointmentLeft', { Appointment_Number:appointment_left }),"", options);
      }
  
    }
}



