
    enum Day {
        Sun = 1,
        Mon,
        Tue,
        Wed,
        Thur,
        Fri,
        Sat
    }

export class Days {


    id:number;
    value:string;


       //todo: contructor for test should to remove it 
       constructor(private _id: number,private _value : string) {

        this.id =  _id;
        this.value = _value;
  
     }

}
