export class GaleryList {
    isFav : boolean;
    src: string;
    

    constructor(private _isFav: boolean,private _src : string) {
        this.isFav = _isFav;
        this.src = _src;
     }
}
