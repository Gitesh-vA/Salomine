
import { SubServerList } from './sub-server-list';

export class profile {

    profileimg:string;
    profileimg40x40:string;
    profileimg100x100:string;

    
       constructor(private _profileimg: string,private _profileimg40x40 : string,
         private _profileimg100x100: string) {

        this.profileimg = _profileimg;
        this.profileimg40x40 = _profileimg40x40;
        this.profileimg100x100 = _profileimg100x100;
     }
}

