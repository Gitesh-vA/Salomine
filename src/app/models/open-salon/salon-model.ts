import { Employee } from './employee';
import { Service } from './service';

export class SalonModel {
    public salonName: string;
    public salonPhoneNumber : number;
    public employees : Employee[];
    public fbLink : string;
    public instaLink : string;
    public location : string;
    

    constructor(private _salonName: string,private _salonPhoneNumber: number,private _fbLink:string,private _instaLink:string,private _location:string, private _employee: Employee[] ) {
        this.salonName =  _salonName;
        this.salonPhoneNumber = _salonPhoneNumber;
        this.employees = _employee;
        this.fbLink = _fbLink;
        this.instaLink = _instaLink;
        this.location = _location;

     }

}
