import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-update-salon',
  templateUrl: './update-salon.component.html',
  styleUrls: ['./update-salon.component.scss']
})
export class UpdateSalonComponent implements OnInit {

  public backButtonUrl: string;
  public backButtonUrlOpts: string[] = ['home', 'salon-panel'];
  public headerName : string;

  constructor(private route: ActivatedRoute,private translate: TranslateService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.backButtonUrl = this.backButtonUrlOpts.indexOf(params.from) == -1 ? "/home" : "/" + params.from;
    });


    this.translate.get('Home.sideBar.updateSalon').subscribe((translated: string) => {
      this.headerName = this.translate.instant('Home.sideBar.updateSalon');  
    });
  }

}
