import { WorkTime } from './work-time';
import { Service } from './service';
import { ServerList } from './server-list';
import { profile } from './profile';

export class Employee {
    public employeeName : string;
    public servers : string[];
    public serversDisplayName : string[];
    public workTimeObj : WorkTime[];
    public subServersObj:Service[];
    public profile:profile;
    public _id:string;

   //todo: contructor for test should to remove it 
    constructor(private employeename: string,private cat : string[],private worktimes: WorkTime[],private _services: Service[],private empId:string,private _profile: any ) {

        this.employeeName =  employeename;
        this.servers = cat;
        this.workTimeObj = worktimes;
        this.subServersObj = _services;
        this._id = empId;
        this.profile = _profile;

     }

}
