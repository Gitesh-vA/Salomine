import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiUserService } from 'src/app/api/api-user.service';
import { StaticObjectsService } from 'src/app/helpers/global/static-objects.service';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {

  public curLang : any;
  public isLoading : boolean;
  public activeLang : string = "heb"
  constructor( 
    private translate: TranslateService,
    private dataService: DataService,
    private globalFunc: StaticObjectsService,
    private router: Router,
    public apiUsers: ApiUserService,
    ) { }

  ngOnInit() {
    this.curLang = this.globalFunc.getUserLang();
    this.activeLang = this.curLang  = this.curLang  ? this.curLang  : "he";
  }
  

  changelang(lang : string)
  {
    this.activeLang = lang;
  }

  
  public setLang(language : string) {
    this.dataService.setData = "languageIsChanged";
    this.isLoading = true;
    this.activeLang = language;
    /*if(this.locatedIn == "login")
    {
      this.useLanguage(language);
      this.isLoading = false;
      return;
    }*/


    this.apiUsers.updateLang(language).subscribe(
      res => {

        this.useLanguage(language);
        this.isLoading = false;

        this.router.routeReuseStrategy.shouldReuseRoute =  () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(["/Settings",{ activeWindow: 'Language' }]);

       /* if(this.locatedIn == "home")
        {
          this.router.routeReuseStrategy.shouldReuseRoute =  () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(["/home"]);
        }*/
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
