import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StaticObjectsService } from '../helpers/global/static-objects.service';
import { ApiUserService } from "../api/api-user.service";

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {
  public curLang : any;
  public isLoading : boolean;
  @Input('locatedIn') locatedIn: any;



  constructor( private translate: TranslateService,
    private globalFunc: StaticObjectsService,
    private router: Router,
    public apiUsers: ApiUserService,
    ) { }

  ngOnInit() {
    this.curLang = this.globalFunc.getUserLang();
    this.curLang  = this.curLang  ? this.curLang  : "he";
  }


  public setLang(language : string) {
    this.isLoading = true;
    if(this.locatedIn == "login")
    {
      this.useLanguage(language);
      this.isLoading = false;
      return;
    }


    this.apiUsers.updateLang(language).subscribe(
      res => {

        this.useLanguage(language);
        this.isLoading = false;
        if(this.locatedIn == "home")
        {
          this.router.routeReuseStrategy.shouldReuseRoute =  () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(["/home"]);
        }
      },
      err => {
        console.error(err);
      }
    );
  }


  useLanguage(language: string) {
        this.translate.use(language);
        this.globalFunc.changeCssFile(language);
        this.globalFunc.clearsCategories();
        this.globalFunc.setCategories();
        localStorage.setItem('Lang', language);
        this.curLang = language;
        this.loadScripts(language);
}


  

      // Method to dynamically load JavaScript 
      loadScripts(lang) { 
        let element  = document.getElementById("mapsGoogleApi");
        if(element)
        {
          element.parentNode.removeChild(element);
        }
        const script = document.createElement('script'); 
        script.id="mapsGoogleApi";
        script.src = 'https://maps.googleapis.com/maps/api/js?radius=50&language=' + lang + '&key=AIzaSyBy53hKpD250Cn_IkQHyP9Lt2Ysv_8oxH0&libraries=places'; 
        document.getElementsByTagName('head')[0].appendChild(script); 
   } 


}
