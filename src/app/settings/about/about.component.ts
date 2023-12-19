import { Component, OnInit } from '@angular/core';

declare var cordova: any;
declare var window: any;

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public curVer : string;
  jsonData : any;

  constructor() { }

  ngOnInit() {
    this.curVer = localStorage.getItem("version");
    let data = sessionStorage.getItem("configuration");
    this.jsonData = JSON.parse(data);
  }

  openTermOfServices()
  {
    
    var ref = cordova.InAppBrowser.open(this.jsonData.termOfServicesLink, '_blank', 'location=yes');
    ref.addEventListener('loadstart', this.loadstartCallback);
    ref.addEventListener('loadstop', this.loadstopCallback);
  }

  openPrivacy()
  {
    var ref = cordova.InAppBrowser.open(this.jsonData.privacyLink, '_blank', 'location=yes');
    ref.addEventListener('loadstart', this.loadstartCallback);
    ref.addEventListener('loadstop', this.loadstopCallback);
  }

  loadstartCallback(event) {
    window.plugins.spinnerDialog.show(null, "loading Salotime...");
  }

  loadstopCallback(event) {
    window.plugins.spinnerDialog.hide();
  }

}
