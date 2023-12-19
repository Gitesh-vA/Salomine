import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/helpers/auth/authentication.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  public Options : any[] = [];
  public activeWindow : string = "home";
  public isAdmin : boolean;

  addValueTopOption(caption,id,row1,row2,src)
  {
    let data=
    {
      "id":id,
      "caption":caption,
      "row1": row1,
      "row2": row2,
      "src":src
    }

    this.Options.push(data);
 
  }

  clickEvent(id)
  {

    if(id == "deleteAccount")
    {
      this.activeWindow  = id;
    }
  }
  




  constructor(private translate: TranslateService, private authObj: AuthenticationService) { }

  ngOnInit() {
    this.isAdmin = this.authObj.isAdmin();
    let name = localStorage.getItem("fName");
    let phone = localStorage.getItem("phone");
    let salonName = localStorage.getItem("salonName");
    let salonLocation = localStorage.getItem("salonLocation");
    let salonNumber = localStorage.getItem("salonNumber");

    this.translate.get('settings.Account').subscribe((translated: string) => {

      this.addValueTopOption(this.translate.instant('settings.AccountContent.loginDetails'),"loginDetails",name,phone,"assets/images/settings/Lock.svg");
      if(this.isAdmin)
      {
      this.addValueTopOption(this.translate.instant('settings.AccountContent.salonName'),"salonName",salonName,"","assets/images/settings/Account.svg");
      this.addValueTopOption(this.translate.instant('settings.AccountContent.salonAddress'),"salonAddress",salonLocation,"","assets/images/settings/Location.svg");
      this.addValueTopOption(this.translate.instant('settings.AccountContent.salonNumber'),"salonNumber",salonNumber,"","assets/images/settings/Phone.svg");
      }
      this.addValueTopOption(this.translate.instant('settings.AccountContent.deleteAccount'),"deleteAccount","","","assets/images/settings/Redtrash.svg");
      });
      
      
 
  }

}
