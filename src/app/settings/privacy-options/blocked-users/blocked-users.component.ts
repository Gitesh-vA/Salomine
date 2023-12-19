import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { ApiOpensalonService } from 'src/app/api/api-opensalon.service';

@Component({
  selector: 'app-blocked-users',
  templateUrl: './blocked-users.component.html',
  styleUrls: ['./blocked-users.component.scss']
})
export class BlockedUsersComponent implements OnInit {
  From: FormGroup;
  UID : any;
  Models:any;
  searchText : any;
  isLoading : boolean;
  selectedNumber : any;
  errorMsg:any;
  @ViewChild('blockUserModal', { static: false }) private blockModal: ModalDirective;
  @ViewChild('unblockUserModal', { static: false }) private unblockModal: ModalDirective;
  @ViewChild('errorModal', { static: false }) private errorModal: ModalDirective;


  
  constructor( private formBuilder: FormBuilder,
               private toastrService: ToastService,
               private translate: TranslateService,
               private router: Router,
               private apiOpenSalon: ApiOpensalonService) { }

  ngOnInit() {

    this.isLoading = true;
    this.UID = localStorage.getItem("uid");

    
    this.From = this.formBuilder.group({
      phoneNum: ['', [Validators.required,Validators.minLength(9),Validators.maxLength(14),Validators.pattern("^[0-9]*$")]],
    });


    this.apiOpenSalon.getblockedUsers(this.UID).subscribe(
      res => {
          this.Models = res.blockedUsers;
          this.isLoading = false;
          debugger;
      },
      err => { }
    );
  }

  get phoneNum(){
    return this.From.get('phoneNum');
  }
  
  get f() { return this.From.controls; }

  backEventOverride() {
    //this.router.navigateByUrl(this.previousUrl);


    this.router.routeReuseStrategy.shouldReuseRoute =  () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(["/Settings",{ activeWindow: 'Privacy' }]);
}



  unblockUser()
  {
    this.isLoading = true;

    this.apiOpenSalon.removeblockedUsers(this.UID,this.selectedNumber).subscribe(
      res => {
        this.Models = res.blockedUsers;
        this.isLoading = false;

        const options = { positionClass: 'md-toast-bottom-center', opacity: 0.9, toastClass: 'mt-1 text-center' };
        this.toastrService.success("", this.translate.instant('BlockUser.cancelBlockSuccessfully') + " " + this.selectedNumber , options);
      },
      err => { }
    );
  }

  blockUser()
  {
    let number = this.f.phoneNum.value;
    let filteredBlockedUsers = this.Models.filter(function(el) { return el.number == number; }); 
    this.blockModal.hide();
    
    if(filteredBlockedUsers.length > 0)
    {
     this.errorMsg = this.translate.instant('BlockUser.alreadyBlocked');
     this.errorModal.show();
      return;
    }

    if (this.From.invalid) {
      this.errorMsg = this.translate.instant('BlockUser.numberIsInvalid');
      this.errorModal.show();
      return;
    }



    this.isLoading = true;
  
    this.apiOpenSalon.setblockedUsers(this.UID,number).subscribe(
      res => {
        this.Models = res.blockedUsers;
        this.f.phoneNum.setValue("");
        this.searchText ="";
        this.isLoading = false;

        const options = { positionClass: 'md-toast-bottom-center', opacity: 0.9, toastClass: 'mt-1 text-center' };
        this.toastrService.success("", this.translate.instant('BlockUser.blockSuccessfully') + " " + number , options);
      },
      err => { }
    );
  }

  unBlockUserModal(number : any)
  {
    this.selectedNumber = number;
    this.unblockModal.show();
  }

  BlockUserModal()
  {
    this.blockModal.show();
  }

}
