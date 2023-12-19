import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy-options',
  templateUrl: './privacy-options.component.html',
  styleUrls: ['./privacy-options.component.scss']
})
export class PrivacyOptionsComponent implements OnInit {

  public activeWindow : string = "home";


  constructor() { }

  ngOnInit() {
    
  }

  openPrivacy()
  {
    this.activeWindow = 'privacy';
  }

  opnenUserBlock()
  {
    this.activeWindow = 'usrBlock';
  }

}
