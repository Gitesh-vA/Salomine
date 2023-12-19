import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from "../../helpers/auth/authentication.service";
import {first} from "rxjs/operators";
import { WOW } from 'wowjs/dist/wow.min';



@Component({
  selector: 'app-authphone',
  templateUrl: './authphone.component.html',
  styleUrls: ['./authphone.component.scss']
})
export class AuthphoneComponent implements OnInit {

  authForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) { }
    public code:any;



  ngOnInit() {

    new WOW().init();
    this.authForm = this.formBuilder.group({
      authcode: ['', [Validators.required,Validators.pattern("^[0-9]*$")]]
    });

    this.code = this.route.snapshot.paramMap.get('code');
  }
    get f() { return this.authForm.controls; }

    get authcode(){
      return this.authForm.get('authcode');
    }
  

    onSubmit() {
      // stop here if form is invalid
      if (this.authForm.invalid) {
        return;
      }
      console.log('ss')
      let phone = localStorage.getItem('phone');
      let authCode = this.f.authcode.value;
      let curTime = new Date().getTime();
      this.authenticationService.login(phone, authCode,curTime.toString(),"","")
        .pipe(first())
        .subscribe(
          data => {

            localStorage.setItem('pathImg', data.pathObj.pathImg);
            localStorage.setItem('pathImg40x40', data.pathObj.pathImg40x40);
            localStorage.setItem('profileimg100x100', data.pathObj.profileimg100x100);
            localStorage.setItem('userHasLogged', "true");
            
            this.router.navigate(["/home"]);
          },
          error => {
           // this.alertService.error(error);
           // this.loading = false;
          });

    }


  public goToMain():void {

  }

}
