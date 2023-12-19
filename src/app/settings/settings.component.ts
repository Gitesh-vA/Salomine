import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertPromise } from 'selenium-webdriver';
import { ApiConfigService } from '../api/api-config.service';
import { ApiUserService } from '../api/api-user.service';
import { AuthenticationService } from '../helpers/auth/authentication.service';
import { StaticObjectsService } from '../helpers/global/static-objects.service';
import { DataService } from '../shared/data.service';
import { UrlService } from '../shared/url.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public code : string;
  public numberOfAttempt : number = 0;
  public Options : any[] = [];
  public activeWindow : string = "Home";
  public headerTxt : string;
  public previousUrl: string = '';
  public isAdmin : boolean = false;
  public isLoading : boolean = false;

  constructor(public apiUsers: ApiUserService,
            private globalFunc: StaticObjectsService,
            private apiConfig: ApiConfigService,
            private authObj: AuthenticationService,
            private urlService: UrlService,
            private route: ActivatedRoute,
            private translate: TranslateService,
            private dataService: DataService,
            private router: Router) { }
  

  addValueTopOption(caption,src,name)
  {
    let data=
    {
      "caption":caption,
      "src": src,
      "name": name
    }

    this.Options.push(data);
    debugger;
  }

  onclick(name,caption){
      this.activeWindow = name;
      this.headerTxt = caption;
      if(this.activeWindow  == "Exit")
      {
       this.logout();
      }
  }

  backEventOverride() {
    if(this.activeWindow  == "Home")
    {
      this.router.navigateByUrl(this.previousUrl);
    }
    else
    {
      this.headerTxt = this.translate.instant('settings.Settings');
      this.activeWindow = "Home";
    }
    
  }

  logout() {
      this.globalFunc.logout();
  }

  ngOnInit() {
    this.isLoading = true;
    this.isAdmin = this.authObj.isAdmin();
    var activeWindow = this.route.snapshot.paramMap.get('activeWindow');

    this.translate.get('settings.Account').subscribe((translated: string) => {

      if(activeWindow)
      {
        this.activeWindow = activeWindow;
        if(this.activeWindow == "Language")
        {
          this.headerTxt = this.translate.instant('settings.Language');
        }
        else if(this.activeWindow == "Account")
        {
          this.headerTxt = this.translate.instant('settings.Account');
        }
        else if(this.activeWindow == "Privacy")
        {
          this.headerTxt = this.translate.instant('settings.Privacy');
        }
        else if(this.activeWindow == "Themes")
        {
          this.headerTxt = this.translate.instant('settings.Themes');
        }
      }
      else
      {
  
        this.headerTxt = this.translate.instant('settings.Settings');
      }



    //this.addValueTopOption(this.translate.instant('settings.Account'),"assets/images/settings/Account.svg","Account");
    this.addValueTopOption(this.translate.instant('settings.Language'),"assets/images/settings/Language.svg","Language");
   // this.addValueTopOption(this.translate.instant('settings.Help'),"assets/images/settings/Help.svg","Help");
    //this.addValueTopOption(this.translate.instant('settings.About'),"assets/images/settings/About.svg","About");
    if(this.isAdmin)
    {
   // this.addValueTopOption(this.translate.instant('settings.Privacy'),"assets/images/settings/Privacy.svg","Privacy");
    }
    if(this.isAdmin)
    {
    this.addValueTopOption(this.translate.instant('settings.Themes'),"assets/images/settings/Theme.svg","Themes");
    }
    this.addValueTopOption(this.translate.instant('Home.sideBar.Logout'),"assets/images/settings/Logout.svg","Exit");

    });

    this.urlService.previousUrl$
    .subscribe((previousUrl: string) => {
      if(this.dataService.getData != "languageIsChanged")
      {
        if(this.activeWindow  == "Home")
        {
        this.previousUrl = previousUrl
        }
      }
    });

    let config = sessionStorage.getItem('configuration');

    if(!config)
    {
      this.loadConfiguration();
    } 
    else
    {
      this.isLoading = false;
    }

  }

  loadConfiguration()
  {
    this.isLoading = true;
    this.apiConfig.getConfiguration()
    .subscribe(
      res => {  
        sessionStorage.setItem('configuration', JSON.stringify(res.data));
        this.isLoading = false;
      },
      err => { }
    );
  }



}
