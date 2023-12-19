
import { SubServerList } from './sub-server-list';

export class Service {

    subServicesDp:string;
    subServiceTime:number;
    subServicePrice:number;
    breakTimeFrom:number;
    breakTimeAt:number;
    resetTime:number;
    typeID:string;
    orderID:string;
    isContainBreakTime:Boolean;
    isContainResetTime:Boolean;
    additionalInfo:String;
    

       //todo: contructor for test should to remove it 
       constructor(private _service: string,private _timeInMin : number,
         private _price: number,private _typeID:string,private _orderID:string,private _breakTimeFrom:number,
          private _breakTimeAt : number,_isContainBreakTime : Boolean,_isContainResetTime : Boolean,_resetTime : number,_additionalInfo:String) {

        this.subServicesDp =  _service;
        this.subServiceTime = _timeInMin;
        this.subServicePrice = _price;
        this.breakTimeFrom = _breakTimeFrom;
        this._breakTimeAt = _breakTimeAt;
        this.typeID = _typeID;
        this.orderID = _orderID;
        this.isContainBreakTime = _isContainBreakTime;
        this.isContainResetTime = _isContainResetTime;
        this.resetTime = _resetTime;
        this.additionalInfo = _additionalInfo;


     }
}

