import { AbstractControl, ValidatorFn } from "@angular/forms";




export function openHoursValidation(from: string, at: string): ValidatorFn {
  debugger;
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (Date.parse('01/01/2011 ' + from) >= Date.parse('01/01/2011 ' + at)) {

      return {
        'isInValid': true
      }
    }

    return null;

  }
}

export function openHoursIsValid(from: string, at: string)
{
  if (Date.parse('01/01/2011 ' + from) >= Date.parse('01/01/2011 ' + at)) {

    return false;
  }

  return true;
}



export function restTimeValidation(restTimeFrom: string, restTimeAt: string, from: string, at: string): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    let f = convertToMin(from);
    let a = convertToMin(at);
    let rTA = convertToMin(restTimeAt);
    let rTF = convertToMin(restTimeFrom);

    if ((rTA == 0 && rTF == 0) || (rTA > f && rTA < a && rTF > f && rTF < a) && (rTA > rTF)) {
      return null;
    }
    else {
      return {
        'isInValid': true
      }
    }


  }
}

function convertToMin(time: string) {
  if (!time) return 0;
  let timeArr = time.split(":");
  let min = parseInt(timeArr[0]) * 60 + parseInt(timeArr[1]);
  return min;
}



export function breakTimesValidation(from: string, at: string, subServiceTime: string): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {

    let a = parseInt(at);
    let f = parseInt(from);
    let sST = subServiceTime ? parseInt(subServiceTime) : 0;


    if (f > 0 && f < a && a > 0 && a < sST && a > f || (!at && !from)) {
      return null;
    }
    else {
      return {
        'isInValid': true
      }
    }


  }
}