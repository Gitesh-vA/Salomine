import { Component, OnInit } from '@angular/core';
import { ApiOpensalonService } from '../api/api-opensalon.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StaticObjectsService } from '../helpers/global/static-objects.service';

@Component({
  selector: 'app-salon-list',
  templateUrl: './salon-list.component.html',
  styleUrls: ['./salon-list.component.scss']
})
export class SalonListComponent implements OnInit {

  public currentRate: number = 3;
  public models: any;
  isLoading = true;
  public name: String;
  public typeID;
  public allowGeoRecall: boolean;

  constructor(private apiOpenSalon: ApiOpensalonService, private globalFunc: StaticObjectsService, private staticObj: StaticObjectsService, private route: ActivatedRoute, private router: Router) { }
  navigator(salonId: string) {
    // this.router.navigate(["/salon-panel"],{queryParams:{id:salonId}});
    this.router.navigate(["/salon-panel", { id: salonId }]);
  }



  getProfleUrl(path: string) {
    return "url('" + path + "?" + new Date().getTime() + "')";
  }



  getCurLocationSuccess() {
    this.initFunction();
  }

  curLocationError() {
    //alert("failer");
    this.initFunction();
  }


  initFunction() {
    this.typeID = this.route.snapshot.paramMap.get('id') == null ? "-1" : this.route.snapshot.paramMap.get('id');

    let myLocation = JSON.parse(localStorage.getItem("myLocation"));
    let curLoc;
    debugger;
    if (myLocation) {
      curLoc = { lat: myLocation.lat, lon: myLocation.lon };
    }

    this.apiOpenSalon.getSalonByTypeID(this.typeID, myLocation.lat, myLocation.lon,false)
      .subscribe(
        res => {
          this.models = res.data;

          for (let i = 0; i < this.models.length; i++) {
            this.models[i].profileimg100x100 = this.models[i].profileimg100x100 + "?" + new Date().getTime();
            if (this.models[i].address) {
              this.models[i].distance = this.staticObj.getDistanceFromLatLonInKm(curLoc.lat, curLoc.lon, this.models[i].address.lat, this.models[i].address.lon);
            }
            else {
              this.models[i].distance = "45";
            }

          }

          this.isLoading = false;

          console.log(res);
        },

        err => { }
      );

  }

  ngOnInit() {

    /* if(!this.globalFunc.updateCurLocation(this.getCurLocationSuccess ,this.curLocationError ) === false)
     {
        alert("please enable location to continue");
     }*/

    this.initFunction();

  }

}
