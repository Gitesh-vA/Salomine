import { Component, OnInit } from '@angular/core';

declare var cordova: any;
declare var window: any;

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  jsonData : any;

  constructor() { }

  ngOnInit() {
    let data = sessionStorage.getItem("configuration");
    this.jsonData = JSON.parse(data);
  }

  openSupportCenter()
  {
    var ref = cordova.InAppBrowser.open(this.jsonData.supportCenterLink, '_blank', 'location=yes');
    ref.addEventListener('loadstart', this.loadstartCallback);
    ref.addEventListener('loadstop', this.loadstopCallback);
  }

  openCommonQuestion()
  {
    var ref = cordova.InAppBrowser.open(this.jsonData.commonQuestionsLink, '_blank', 'location=yes');
    ref.addEventListener('loadstart', this.loadstartCallback);
    ref.addEventListener('loadstop', this.loadstopCallback);
  }

  openHelpCenter()
  {
    var ref = cordova.InAppBrowser.open(this.jsonData.contactUsLink, '_blank', 'location=yes');
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
