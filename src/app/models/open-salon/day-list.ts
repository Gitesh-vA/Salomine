export class DayList {
    id:number;
    value:string;


       //todo: contructor for test should to remove it 
       constructor(private dayID: number,private _value : string) {

        this.id =  dayID;
        this.value = _value;
  
     }
    }
