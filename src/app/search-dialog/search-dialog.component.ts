import { Component, OnInit } from '@angular/core';
import { ApiOpensalonService } from '../api/api-opensalon.service';
import { MDBModalRef } from 'ng-uikit-pro-standard';
import { StaticObjectsService } from '../helpers/global/static-objects.service';
import { ApiUserService } from '../api/api-user.service';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnInit {
  searchText: string;
  searchedSalons: any;
  closestSalons: any;
  host : any;
  isLoading: boolean = true;
  myLocation: any;
  timeOutVar: any;
  Gate: Boolean = false;
  typingTimer: any;
  doneTypingInterval: number = 600;


  constructor(
    private apiUser: ApiUserService,
    private apiOpenSalon: ApiOpensalonService,
    public modalRef: MDBModalRef,
    private staticObj: StaticObjectsService) { }

  ngOnInit(): void {
    this.getCurLocation()
    //this.getClosestSalon(true);
    this.getRecently();
    this.host = localStorage.getItem('host');
    this.searchedSalons = this.closestSalons;
  }


  keyup(searchValue: string) {
    this.searchText = searchValue;
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.doneTyping(searchValue);
    }, this.doneTypingInterval);

  }

  keydown(searchValue: string) {
    clearTimeout(this.typingTimer);
  }

  doneTyping(searchValue: string) {
    this.getSalonBySearch(searchValue);
  }

  getSalonBySearch(searchValue) {
    if (!searchValue) {
      this.searchedSalons = this.closestSalons;
      return;
    }

    this.isLoading = true;
    this.apiOpenSalon.salonSearch(searchValue).subscribe(
      res => {
        this.searchedSalons = res.data;
        this.isLoading = false;
        this.Gate = true;

        /*for (let i = 0; i < this.searchedSalons.length; i++) {
          this.searchedSalons[i].distance = this.staticObj.getDistanceFromLatLonInKm(this.myLocation.lat, this.myLocation.lon, this.searchedSalons[i].address.lat, this.searchedSalons[i].address.lon);
        }*/

      },
      err => { }
    );
  }

  getRecently() {
       this.apiUser.getRecently().subscribe(
         res => {
           debugger;
          this.closestSalons = res.data;
          this.isLoading = false;
  
          if(this.myLocation)
          {
            for (let i = 0; i < this.closestSalons.length; i++) {
              this.closestSalons[i].distance = this.staticObj.getDistanceFromLatLonInKm(this.myLocation.lat, this.myLocation.lon, this.closestSalons[i].address.lat, this.closestSalons[i].address.lon);
            }
          }
  
          this.searchedSalons = this.closestSalons;
         },
         err => { }
       );
   }
 

  getClosestSalon(onInit: boolean = false) {
    this.apiOpenSalon.getClosestSalons(this.myLocation.lat, this.myLocation.lon).subscribe(
      res => {
        this.closestSalons = res.data;
        this.isLoading = false;

        for (let i = 0; i < this.closestSalons.length; i++) {
          this.closestSalons[i].distance = this.staticObj.getDistanceFromLatLonInKm(this.myLocation.lat, this.myLocation.lon, this.closestSalons[i].address.lat, this.closestSalons[i].address.lon);
        }

        if (onInit) {
          this.searchedSalons = this.closestSalons;
        }
      },
      err => { }
    );
  }

  closeDialog() {

  }


  getCurLocation() {
    let curLoc = localStorage.getItem("myLocation")
    if (curLoc) {
      this.myLocation = JSON.parse(curLoc);
      return true;
    }
    else {
      return false;
    }
  }


}
