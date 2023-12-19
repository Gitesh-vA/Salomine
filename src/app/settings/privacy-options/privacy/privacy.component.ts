import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'ng-uikit-pro-standard';
import { ApiOpensalonService } from 'src/app/api/api-opensalon.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {


  public isChecked : boolean = false;
  public headerName : string;
  constructor(private router: Router,private toastrService: ToastService,private apiOpenSalon: ApiOpensalonService,private translate: TranslateService) { }

  ngOnInit() {
   let isSalonVisible = localStorage.getItem("isVisible");
    this.isChecked = isSalonVisible != 'true';

    this.translate.get('settings.Privacy').subscribe((translated: string) => {

      this.headerName = this.translate.instant('settings.Privacy')
    });

  }

  backEventOverride() {
    //this.router.navigateByUrl(this.previousUrl);


    this.router.routeReuseStrategy.shouldReuseRoute =  () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(["/Settings",{ activeWindow: 'Privacy' }]);
}


  changeConfirmTypeState(state)
  {
    //is private
    this.isChecked  = state.currentTarget.checked;

    this.apiOpenSalon.setVisibility(String(!this.isChecked)).subscribe(
      res => {
          localStorage.setItem("isVisible", String(!this.isChecked));

          const options = { positionClass: 'md-toast-bottom-center', timeOut: 1500,opacity: 0.9, toastClass: 'text-center mt-1' };
          this.toastrService.success("", this.translate.instant('Common.updated'), options);

      });
  }

}
