import { Days } from './days';
import { DayList } from './day-list';

   
export class WorkTime {

    public daysDropDown : DayList[];
    public from : string;
    public at: string;
    public restTimeFrom: string;
    public restTimeAt : string;



   constructor(private d: DayList[],private f : string,private a: string,private rTF : string = "",private rTA : string = "") {

    this.daysDropDown =  d;
    this.from = f;
    this.at = a;
    this.restTimeFrom = rTF;
    this.restTimeAt = rTA;
 }

 
}

