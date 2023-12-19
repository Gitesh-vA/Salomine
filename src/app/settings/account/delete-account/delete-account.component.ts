import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ng-uikit-pro-standard';
import { ApiUserService } from 'src/app/api/api-user.service';
import { StaticObjectsService } from 'src/app/helpers/global/static-objects.service';
import { UrlService } from 'src/app/shared/url.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent implements OnInit {

  public previousUrl: string = '';
  public headerName : string = ''
  public code : string;
  public numberOfAttempt : number = 0;
  public userName : string;
  public userData : any;
  public isLoading : boolean;
  public Error: string;
  public backBtnIsHidden : boolean;
  @ViewChild('deleteAccountModal', { static: false }) private deleteAccountModal: ModalDirective;

  constructor(private router: Router,public apiUsers: ApiUserService,private globalFunc: StaticObjectsService,private translate: TranslateService) { }

  ngOnInit() {

    this.userData = JSON.parse(localStorage.getItem("currentUser"));
    this.userName = String(localStorage.getItem("fName"))
    this.translate.get('settings.AccountContent').subscribe((translated: string) => {

        this.headerName = this.translate.instant('settings.AccountContent.deleteAccount')
      });

  }

  backEventOverride() {
      //this.router.navigateByUrl(this.previousUrl);


      this.router.routeReuseStrategy.shouldReuseRoute =  () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(["/Settings",{ activeWindow: 'Account' }]);
  }

  sentSMSCode()
  {
    this.apiUsers.sendCodeVertification(this.userData.user.phone).subscribe(
      res => {
    
       this.code = res.phToken;
      },
      err => {
        //TODO: show error in notification
        console.error(err);
      }
    );
  }


  
  deleteAccont(){
    this.isLoading = true;
    try
    {
    this.apiUsers.deleteAccount()
    .subscribe(
      res => {  
        this.globalFunc.logout();
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


  keyup()
  {
    this.Error = '';
  }

  validate()
  {
    this.apiUsers.vertificateCode(this.userData.user.phone,this.code,0).subscribe(
      res => {
    
        if(res.isMatch)
        {
          this.backBtnIsHidden = true;
          this.deleteAccountModal.hide();
          this.deleteAccont();
        }
        else
        {
          this.Error = this.translate.instant('settings.AccountContent.deleteAccountContent.incorrectCode');
        }
      },
      err => {
        //TODO: show error in notification
        console.error(err);
      }
    );
  }



}
