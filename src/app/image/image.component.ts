import { Component, OnInit, ViewChild } from '@angular/core';
import heic2any from 'heic2any';
import { MDBModalRef, ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { NgxImageCompressService } from 'ngx-image-compress';
import { apiSalonPhotos } from '../api/api-salonphotos.service';
import { ImageHandler } from '../helpers/global/ImageHandler';
import { StaticObjectsService } from '../helpers/global/static-objects.service';

declare var cordova: any;
declare var window: any;

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

  isLoading: Boolean = false;
  compressedFile: File;
  imagesPath: any;
  host : any;
  model: any = [];
  gateIsClose : boolean = false;
  imageIdToEdit : any;
  isMultiImagePicker : Boolean = false;
  pathStack : any[];
  curSys : any;
  @ViewChild('accessRequestModal', { static: false }) accessRequestModal: ModalDirective;

  constructor(private imagehandler:ImageHandler,private staticObj: StaticObjectsService, private modalRef: MDBModalRef,private salonPhotos: apiSalonPhotos,private imageCompress: NgxImageCompressService,private toastrService: ToastService, private ng2ImgMax: Ng2ImgMaxService) { }

  ngOnInit() {
    this.curSys = this.staticObj.getMobileOperatingSystem();
    this.loadData();
  }

  editImage(imgId)
  {
    this.imageIdToEdit = imgId;
  }


  notAllowedContent() {
    const options = { positionClass: 'md-toast-top-center', opacity: 0.8, toastClass: 'mt-5' };
    this.toastrService.error("Detect Not Allowed Content!.", 'ERROR', options);
  }

  loadData() {
    this.salonPhotos.getSalonPhotos("-1")
      .subscribe(
        res => {
          debugger;
          if (res.data) {
            debugger;
            this.imagesPath = res.data.imagesPath.filter(item => item.status != "removed");
            //this.images = [];
            this.model = this.imagesPath;
            localStorage.setItem("salonImagesLength",this.imagesPath.length);
            console.log("res.host =>" + res.host);
            this.host = res.host;
          }
          this.isLoading = false;

        })
  }

  backEventOverride()
  {
    this.modalRef.hide();
  }

  displayImage(path : any)
  {

  try
  {
    if(this.curSys != "IOS")
    {
      cordova.InAppBrowser.open(path, '_blank', 'enableViewportScale=true,hidenavigationbuttons=yes,hideurlbar=yes,toolbarcolor=#000000,footer=no,footercolor=#000000,closebuttoncolor=#ffffff');
    }
  }
  catch(ex)
  {
    alert(ex.message);
  }

  }

 loadstartCallback(event) {
    window.plugins.spinnerDialog.show(null, "loading Salotime privacy...");
}

loadstopCallback(event) {
  window.plugins.spinnerDialog.hide();
}



  advancedOnImagePicked(max)
  {
    try
    {

      var permissions = cordova.plugins.permissions;

      permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, ( status )=>{
        if ( status.hasPermission ) {
          this.advancePickImage(max);
        }
        else {
          //this.accessRequestModal.show();
          permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE,
          (success )=>{

            permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, ( status )=>{

              if ( status.hasPermission ) {
                this.advancePickImage(max);
              }
              else
              {
                this.accessRequestModal.show();

              }

            });
            
          },
          (error)=>{

          });
        }
      });
    }
    catch(ex)
    {
      alert(ex.message);
    }
  }

  errorCallback()
  {
    alert("error!");
  }

  pickImageDone()
  {
    var path = this.pathStack.pop();
    this.ImageUploadEx(path);
  }

  advancePickImage(maxPick) {
    try {

      window.AdvancedImagePicker.present({
        max: maxPick,
      }, results => {
        let resLen = results.length;

        this.pathStack = [];

        for (let i = 0; i < resLen; i++) {
          if (this.curSys != "IOS") {
            window.FilePath.resolveNativePath(results[i].src, (result) => {
              try {
                this.pathStack.push(result)

                if (i == (resLen - 1)) {
                  this.pickImageDone();
                }
              }
              catch (ex) {
                //alert(ex.message);
              }
            }, this.errorCallback);
          }
          else {
            try {
              this.pathStack.push(results[i].src)

              if (i == (resLen - 1)) {
                this.pickImageDone();
              }
            }
            catch (ex) {
              //alert(ex.message);
            }
          }

        }

      }, function (error) {
        // alert(error);
      });




    }
    catch (ex) {
      this.isLoading = false;
      alert(ex.message);
    }
  }


  ImageUploadEx(path : any)
  {
    try
    {
      this.isLoading = true;
      let file = path;

      if (file == null) {
        this.isLoading = false;
        return false;
      }

      var pathes_splitbySlash = path.split("/");
      var filename = pathes_splitbySlash[pathes_splitbySlash.length - 1];


      if (file != null && validateFileUpload(filename) == false) {
        this.isLoading = false;
        this.showError();
        return false;
      }
      var fileName;

      if(!file.name)
      {
        fileName = filename.split(".")[0];
      }
      else
      {
        fileName = file.name;
      }

      const reader = new FileReader();
      const reader2 = new FileReader();

    
      this.gateIsClose = true;
      toDataURL(path, (dataUrl) => {
        reader.onload = (event: any) => {
          var orientation = -1;
       
          this.imageCompress.compressFile(event.target.result, orientation, 50, 50).then(
            result => {
              let Blob = this.imagehandler.dataURItoBlob(result.split(',')[1]);
              let test = new Date().getTime().toString();
              this.compressedFile = new File([Blob], test, { type: 'image/jpeg' });
              this.ng2ImgMax.resizeImage(this.compressedFile, 40, 40).subscribe(
                result => {
                  const file2 = new File([result], "thumbs_" + result.name, {
                    type: result.type,
                  });
                  reader2.onload = () => {
                    this.setPhoto(this.compressedFile, file2);
                    if(this.pathStack.length > 0)
                    {
                      let path = this.pathStack.pop();
                       this.ImageUploadEx(path);
                    }
                  }
                  reader2.readAsDataURL(file2);
                },
                error => {
                  console.log('😢 Oh no!', error);
                }
              )

            });

        };

        if (/hei(c|f)/.test(filename)) {
            let blob: Blob;
            blob = this.imagehandler.dataURItoBlob(dataUrl.split(',')[1]);
            heic2any({ blob, toType: "image/jpeg", quality: 100 }).then((jpgBlob: Blob) => {
            //Change the name of the file according to the new format
            let newName = filename.replace(/\.[^/.]+$/, ".jpg");
            file = this.blobToFile(jpgBlob, newName);
            reader.readAsDataURL(file);
          });
        }
        else
        {
          let Blob2 = this.imagehandler.dataURItoBlob(dataUrl.split(',')[1]);
          reader.readAsDataURL(Blob2);
        }
          
      })
    }
    catch(ex)
    {
      alert(ex.message);
    }
  }



  setPhoto(file: File, file2: File) {
    this.isLoading = true;
    this.salonPhotos.setSalonPhotos(file, file2,this.imageIdToEdit)
      .subscribe(
        res => {
          debugger;
          if (res.message === "not allowed content") {
            this.notAllowedContent();
            this.isLoading = false;
            return;
          }

          this.loadData();
        })
  }

  removePic(id: string) {
    this.isLoading = true;
    this.salonPhotos.removePic(id)
      .subscribe(
        res => {
          this.loadData();
        }
      );

  }

  
  openAppSettings()
  {
      cordova.plugins.settings.open("application_details",  ()=> { 
        this.accessRequestModal.hide();
      },
        function () {
          alert('failed to open settings');
          this.accessRequestModal.hide();
        }
      );
  }


  
  showError() {
    const options = { positionClass: 'md-toast-top-center', opacity: 0.8, toastClass: 'mt-5' };
    this.toastrService.error("Photo only allows file types of PNG, JPG and JPEG.", 'ERROR', options);
  }

  onImagePicked() {
    this.isLoading = true;
    let file = (event.target as HTMLInputElement).files[0];
    var str = JSON.stringify(file, null, 4); 
    if (file == null) {
      this.isLoading = false;
      return false;
    }

    if (file != null && validateFileUpload(file.name) == false) {
      this.isLoading = false;
      this.showError();
      return false;
    }

    const reader = new FileReader();
    const reader2 = new FileReader();

    reader.onload = (event: any) => {
      str = JSON.stringify(event.target.result, null, 4); 

      var orientation = -1;
      this.imageCompress.compressFile(event.target.result, orientation, 50, 50).then(
        result => {
          let Blob = this.imagehandler.dataURItoBlob(result.split(',')[1]);
          this.compressedFile = new File([Blob], file.name, { type: 'image/jpeg' });

          this.ng2ImgMax.resizeImage(this.compressedFile, 40, 40).subscribe(
            result => {
              debugger;
              const file2 = new File([result], "thumbs_" + result.name, {
                type: result.type,
              });
              reader2.onload = () => {
                this.setPhoto(this.compressedFile, file2);
              }
              reader2.readAsDataURL(file2);
            },
            error => {
              console.log('😢 Oh no!', error);
            }
          )

        });

    };
      if (/hei(c|f)/.test(file.name)) {
            let blob: Blob = file;
            heic2any({ blob, toType: "image/jpeg", quality: 100 }).then((jpgBlob: Blob) => {
          //Change the name of the file according to the new format
          let newName = file.name.replace(/\.[^/.]+$/, ".jpg");
          file = this.blobToFile(jpgBlob, newName);
          reader.readAsDataURL(file);
        });
      }
      else
      {
        reader.readAsDataURL(file);
      }
  }
  

  blobToFile = (theBlob: Blob, fileName: string): File => {
    let b: any = theBlob;

    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModified = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  }

}


function validateFileUpload(fileName) {
  if (fileName.lastIndexOf('.') == -1) return false;

  var Extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

  if (Extension == "png" || Extension == "jpeg" || Extension == "jpg" || Extension == "heic" || Extension == "heif") {
    return true;
  }

  return false;

}


function toDataURL(url, callback) {
  try
  {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }
  catch(ex)
  {
    alert(ex.message);
  }

}
