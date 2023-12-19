export class Category {

    name:string;
    hebName:string;
    id:string;
    path:string;
    selected_path:string;


       //todo: contructor for test should to remove it 
       constructor(private _name: string,private _id : string,private _path:string,private sPath:string) {

        this.name =  _name;
        this.id = _id;
        this.path = _path;
        this.selected_path = sPath;
  
     }
}
