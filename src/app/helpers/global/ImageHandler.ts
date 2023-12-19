import { Injectable } from '@angular/core';
import { Category } from '../../models/Home/category';
import * as moment from 'moment';
import { NgxImageCompressService } from 'ngx-image-compress';
import { HttpResponseBase } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { UrlService } from 'src/app/shared/url.service';
import { Router } from '@angular/router';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { CropperImageComponent } from 'src/app/cropper-image/cropper-image.component';
import { DataService } from 'src/app/shared/data.service';
import heic2any from 'heic2any';

@Injectable({
  providedIn: 'root'
})
export class ImageHandler {
  modalRef: MDBModalRef;

  constructor(private imageCompress: NgxImageCompressService, private dataService: DataService, private modalService: MDBModalService, private router: Router, private urlService: UrlService, private translate: TranslateService) {
  }

  public isFileImage(file) {
    return file && file['type'].split('/')[0] === 'image';
  }

  public openCropImage(file: File,empid : any  = '', callBackclosedFunc: any = '',callBackOpenFunc : any = '') {
    let fileNameArr = file.name.split(".");
    let blob: Blob = file;

    if (!this.isFileImage(file)) {
      alert(this.translate.instant('cropperImg.uploadPhotosOnly'));
      //this.isLoading = false;
      return;
    }

    if (/hei(c|f)/.test(fileNameArr[fileNameArr.length - 1])) {
      heic2any({ blob, toType: "image/jpeg", quality: 100 }).then((jpgBlob: Blob) => {
        //Change the name of the file according to the new format
        let newName = file.name.replace(/\.[^/.]+$/, ".jpg");
        file = this.blobToFile(jpgBlob, newName);
        this.openCropperImage(file,empid,callBackclosedFunc,callBackOpenFunc);
      });
    }
    else
    {
      this.openCropperImage(file,empid,callBackclosedFunc,callBackOpenFunc);
    }

  }



  public openCropperImage = (file: File,empid : any  = '', callBackclosedFunc: any = '',callBackOpenFunc : any = '') => {

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const image = new Image();
      image.src = reader.result.toString();
      image.onload = rs => {
        const img_height = rs.currentTarget['height'];
        const img_width = rs.currentTarget['width'];
        if (img_height < 170 || img_width < 170) {
          alert("image is too small");
          return;
        }


        let Data = {
          base64: reader.result.toString(),
          height: img_height,
          width: img_width,
          empid: empid
        };


        this.dataService.setData = JSON.stringify(Data);


        this.modalService.opened.subscribe((result: any) => {
          callBackOpenFunc();    
        });

        this.modalService.closed.subscribe((result: any) => {
          if (this.modalRef.content.isNewImage == true) {
            if (typeof callBackclosedFunc === "function") {
              let data = this.modalRef.content.Data;
              callBackclosedFunc(data);
            }

          }
        });

        this.modalRef = this.modalService.show(CropperImageComponent, {
          backdrop: true,
          keyboard: true,
          focus: true,
          show: false,
          ignoreBackdropClick: true,
          class: 'h-100 m-0',
          containerClass: 'h-100 m-0',
          animated: true
        });



      }

    };

  };

  public dataURItoBlob = (dataURI,datatype="image/jpeg") => {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: datatype});
    return blob;
  };
  

  blobToFile = (theBlob: Blob, fileName: string): File => {
    let b: any = theBlob;

    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModified = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  }

}