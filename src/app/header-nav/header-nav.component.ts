import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {  Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../helpers/auth/authentication.service';
import { MDBModalService, ModalDirective, NavbarComponent, ToastService } from 'ng-uikit-pro-standard';
import { UrlService } from '../shared/url.service';
import { StaticObjectsService } from '../helpers/global/static-objects.service';
import { ApiOpensalonService } from '../api/api-opensalon.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.scss']
})
export class HeaderNavComponent implements OnInit {

  @Input('headerName') headerName: string;
  @Input('hiddenHome') hiddenHome: string;
  @Input('navLink') navLink: string;
  @Input('isFixedTop') isFixedTop: boolean;
  @Input('customClass') customClass: string;
  @Input('isHasList') isHasList: string;
  @Input('parameters') parameters: string;
  @Input('isOwner') isOwner: string;
  @Input('isVisible') isVisible: string;
  @Input('backBtnIsHidden') backBtnIsHidden: string;
  @Input('isHavingStore') isHavingStore: string;
  @Input('showConfirmationModal') showConfirmationModal: string;
  @ViewChild('confirmationModal', { static: false }) confirmationModal: ModalDirective;
  @ViewChild('invisibleModal', { static: false }) invisibleModal: ModalDirective;
  @ViewChild('navbar', { static: false }) navbar: NavbarComponent;

  @Output() triggerAction = new EventEmitter<string>();

  visibilityBody : string;
  from:string;
  public isHaveStore : string;
  previousUrl: string = '';
  public curOp : any;
  public navBarIsHidden : boolean = false;

  @Output()
  shareFunc = new EventEmitter<string>();

  @Output()
  navigateex = new EventEmitter<string>();
  


  constructor(private router:Router,
    private toastrService: ToastService,
    private OpensalonService: ApiOpensalonService,
    private globalFunc: StaticObjectsService,
    private translate: TranslateService,
    private urlService: UrlService) { 

    }

  ngOnInit() {
    this.curOp = this.globalFunc.getMobileOperatingSystem();
    this.urlService.previousUrl$
    .subscribe((previousUrl: string) => {
        this.previousUrl = previousUrl
        console.log(this.previousUrl);
    });

    /*this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
  ).subscribe((event: NavigationEnd) => {
  });*/

   this.isHaveStore = localStorage.getItem("isHaveStore");
  }

  navigator(){
    if(this.backBtnIsHidden == 'true')
    {
      return;
    }
    debugger;
    if(this.showConfirmationModal == "true")
    {
      this.confirmationModal.show();
    }
    else if(this.triggerAction.observers.length > 0)
    {
      this.triggerAction.emit();
    }
    else
    {   
      //difference between navigateByUrl and navigate that navigate doen't work if swe send string path include paramters by navigateByUrl yes it work
     this.router.navigateByUrl(this.previousUrl);
    }
  }

  confirmationModalResponse()
  {
    this.router.navigateByUrl(this.previousUrl);
  }

  inviteFriend(){
    this.shareFunc.emit();
  }

  navigateToStore(){
    this.router.navigate(["/OpenStore"]);
  }

  displayVisiblityModal()
  {

    this.visibilityBody = this.isVisible == 'true'  ?  this.translate.instant('MySalon.invisibleBody') : this.translate.instant('MySalon.visibleBody');
    this.invisibleModal.show();
  }

  changeVisiblity()
  {
    this.isVisible = String(this.isVisible != 'true');
    this.OpensalonService.setVisibility(this.isVisible).subscribe(
      res => {
        localStorage.setItem("isVisible", String(this.isVisible));

 
          const options = { positionClass: 'md-toast-top-center', timeOut: 1500,opacity: 0.9, toastClass: 'text-center mt-1' };
          this.toastrService.success("", this.translate.instant('Common.updated'), options);
          this.navbar.hide();

      });
  }



  sendMail()
  {
    window.location.href='mailto:info@salotime.com';  
  }


}
