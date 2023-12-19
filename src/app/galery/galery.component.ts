import { Component, OnInit, ViewChild } from '@angular/core';
import { MDBModalRef, ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { apiSalonPhotos } from '../api/api-salonphotos.service';
import { ImageHandler } from '../helpers/global/ImageHandler';

declare var window: any;
declare var cordova: any;

@Component({
  selector: 'app-galery',
  templateUrl: './galery.component.html',
  styleUrls: ['./galery.component.scss']
})
export class GaleryComponent implements OnInit {

  model: any;
  host : any;
  images: any = [];
  isLoading: Boolean = true;
  imagesPath: any
  compressedFile: File;
  isMultiImagePicker : Boolean = false;
  @ViewChild('accessRequestModal', { static: false }) accessRequestModal: ModalDirective;

  constructor(private imageHandler:ImageHandler, private imageCompress: NgxImageCompressService, private salonPhotos: apiSalonPhotos, private ng2ImgMax: Ng2ImgMaxService, private toastrService: ToastService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.salonPhotos.getSalonPhotos("-1")
      .subscribe(
        res => {
          debugger;
          if (res.data) {
            this.images = [];
            this.imagesPath = res.data.imagesPath.filter(item => item.status != "removed");
            this.model = this.imagesPath;
            localStorage.setItem("salonImagesLength",this.imagesPath.length);
            console.log("res.host =>" + res.host);
            this.host = res.host;
          }
          this.isLoading = false;

        })
  }

  previewImages() {
    let imPath = this.imagesPath;
    this.images = [];
    var fullP;
    var eFName;
    for (let i = 0; i < imPath.length; i++) {
      eFName = imPath[i].extendedFileName ? imPath[i].extendedFileName : "";
      fullP = this.host + imPath[i].imagePath + eFName;
      this.images.push({ img: fullP, thumb: fullP, description: imPath[i].title });
    }
  }

  updateImageObj(index: number) {
    this.images = [];
    let i = index;
    let eFName = this.imagesPath[i].extendedFileName ? this.imagesPath[i].extendedFileName : "";
    let fullP = this.host + this.imagesPath[i].imagePath + eFName;
    this.images.push({ img: fullP, thumb: fullP, description: this.imagesPath[i].title });
  }

  setPhoto(file: File, file2: File) {
    this.isLoading = true;
    this.salonPhotos.setSalonPhotos(file, file2)
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

  showError() {
    const options = { positionClass: 'md-toast-top-center', opacity: 0.8, toastClass: 'mt-5' };
    this.toastrService.error("Photo only allows file types of PNG, JPG and JPEG.", 'ERROR', options);
  }


  notAllowedContent() {
    const options = { positionClass: 'md-toast-top-center', opacity: 0.8, toastClass: 'mt-5' };
    this.toastrService.error("Detect Not Allowed Content!.", 'ERROR', options);
  }

  advancedOnImagePicked()
  {
    try
    {

      var permissions = cordova.plugins.permissions;

      permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, ( status )=>{
        if ( status.hasPermission ) {
          this.advancePickImage();
        }
        else {
          //this.accessRequestModal.show();
          permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE,
          (success )=>{

            permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, ( status )=>{

              if ( status.hasPermission ) {
                this.advancePickImage();
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


  successCallback(result)
  {
    try
    {
    alert("success");
    blabla();
    this.testfuncc();
    alert(result);
    this.testfunc(result);
    }
    catch(ex)
    {

    }
  }

  testfuncc()
  {
    alert("test");
  }

  errorCallback()
  {
    alert("error!");
  }

  advancePickImage()
  {
    try
    {
      window.AdvancedImagePicker.present({
        max: 5,
       }, results => {
        for (let i = 0; i < results.length; i++) {
          window.FilePath.resolveNativePath(results[i].src, (result) => {this.testfunc(result);}, this.errorCallback);
        }
         
       }, function (error) {
         alert(error);
       });
     }
     catch(ex)
     {
      this.isLoading = false;
       alert(ex.message);
     }
  }

  


  testfunc(path : any)
  {
    try
    {
      this.isLoading = true;
      const file = path;

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

    
      toDataURL(path, (dataUrl) => {
        reader.onload = (event: any) => {
          var orientation = -1;
          this.imageCompress.compressFile(event.target.result, orientation, 50, 50).then(
            result => {
              let Blob = this.imageHandler.dataURItoBlob(result.split(',')[1]);
              this.compressedFile = new File([Blob], new Date().getTime().toString(), { type: 'image/jpeg' });

              this.ng2ImgMax.resizeImage(this.compressedFile, 40, 40).subscribe(
                result => {
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
        let Blob2 = this.imageHandler.dataURItoBlob(dataUrl.split(',')[1]);
        reader.readAsDataURL(Blob2);
      })
    }
    catch(ex)
    {
      alert(ex.message);
    }
  }


  onImagePicked() {
    this.isLoading = true;
    debugger;
    const file = (event.target as HTMLInputElement).files[0];
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
          let Blob = this.imageHandler.dataURItoBlob(result.split(',')[1]);
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
    reader.readAsDataURL(file);
  }

}




function validateFileUpload(fileName) {
  if (fileName.lastIndexOf('.') == -1) return false;

  var Extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

  if (Extension == "png" || Extension == "jpeg" || Extension == "jpg") {
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

function blabla()
{
  alert("blabla");
}

function toDataURL2(imageUri,callback) {
  var c = document.createElement('canvas');
  var ctx = c.getContext("2d");
  var img = new Image();
  img.onload = function() {
    alert("onload");
      c.width = img.width;
      c.height = img.height;
      ctx.drawImage(img, 0, 0);
  };
  img.src = imageUri;
  //alert(imageUri);
  var dataURL = c.toDataURL("image/jpeg");
  callback(dataURL);
  
  //return dataURL.slice(22, dataURL.length);
}
