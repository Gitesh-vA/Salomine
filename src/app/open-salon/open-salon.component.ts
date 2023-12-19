import {Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router"
import { TranslateService } from '@ngx-translate/core';
import { MdbStepperComponent } from 'ng-uikit-pro-standard'
import { ApiOpensalonService } from '../api/api-opensalon.service'

@Component({
  selector: 'app-open-salon',
  templateUrl: './open-salon.component.html',
  styleUrls: ['./open-salon.component.scss']
})
export class OpenSalonComponent implements OnInit {
  private location: Location;
  public step2: any;
  public backButtonPoint:string;
  public headerName = "Open Salon";
  public backButtonPointOpts: string[] = ['home', 'salon-panel'];
  valueEmittedFromChildComponent: string = "";


  @ViewChild('stepper', {static: true})
  stepper: MdbStepperComponent;
  constructor(private translate: TranslateService, private apiOpenSalon : ApiOpensalonService,private route: ActivatedRoute) {

   }


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.backButtonPoint = this.backButtonPointOpts.indexOf(params.from) == -1 ? "/home" : "/" + params.from;   

      this.translate.get('Home.sideBar.OpenSalon').subscribe((translated: string) => {
        this.headerName = this.translate.instant('Home.sideBar.OpenSalon');  
      });
    });

  }

}
