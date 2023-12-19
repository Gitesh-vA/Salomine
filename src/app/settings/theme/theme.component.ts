import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { ApiOpensalonService } from 'src/app/api/api-opensalon.service';
import { StaticObjectsService } from 'src/app/helpers/global/static-objects.service';
// import { numberlike } from 'temp/moment/moment';

declare var cordova: any;
declare var window: any;


@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class ThemeComponent implements OnInit {

  activeColor: number;
  color_f:string = '#ffc0cb'
  color_t:string = '#ffc0cb'
  colorsData : any;
  public isLoading : boolean;
  constructor(private globalFunc: StaticObjectsService, private apiOpenSalon: ApiOpensalonService) { }

  ngOnInit() {
    this.isLoading = true;
    this.activeColor = 1
    this.getPreferences();
  }

  getPreferences()
  {
      this.apiOpenSalon.getPreferences().subscribe(
        res => {     
          debugger;
          this.colorsData =  JSON.parse(res.config.colorsObj);
          
          if(!res.data.preferences) 
          {
            this.initDefault();
          }
          let obj_str = res.data.preferences.colors;

          this.selectedDefault(obj_str);
          this.isLoading = false; 
        },
        err => { }
      );
  }
  
  initDefault()
  {
    this.setActive( this.colorsData[0].id ,this.colorsData[0].colors ,this.colorsData[0].cName,false)
    this.isLoading = false;
  }

  selectedDefault(obj_str)
  {
    let colorsObj = JSON.parse(obj_str);
    this.setActive(colorsObj.colors.id,colorsObj.colors,colorsObj.colors.cName,false)
    this.isLoading = false;
  }

  setActive(colorID:number, colorObj : any,cName:string = "",needToUpdate:boolean = true)
  {
    debugger;
    this.activeColor = colorID;


      this.changeTheme(colorID,cName,colorObj.c1,colorObj.c2,colorObj.c3,colorObj.c4,colorObj.c5,colorObj.c6,colorObj.c7,needToUpdate);

  }

  changeTheme(id: number,cName:string,c1: string,c2:string,c3:string,c4:string,c5:string,c6:string,c7:string,needToUpdate:boolean = true) {
    this.isLoading = true;
    this.activeColor = id;
    debugger;
    this.globalFunc.changeTheme(c1,c2,c3,c4,c5,c6,c7,true);
    debugger;

    let obj = 
    {
      "colors":{"id":id,"cName":cName,"c1": c1, "c2": c2, "c3": c3,"c4":c4,"c5":c5,"c6":c6,"c7":c7}
    };

    let obj_str = JSON.stringify(obj);


    try
    {
     window.StatusBar.backgroundColorByHexString(c6);
    }
    catch(ex)
    {

    }

    

    if(needToUpdate)
    {
      this.apiOpenSalon.setPreferences(obj_str).subscribe(
        res => {     
          this.isLoading = false; 
        },
        err => { }
      );
    }

}

  

}
