import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { ApiUserService } from '../api/api-user.service';
import { MDBModalRef, ToastService } from 'ng-uikit-pro-standard';
import { UrlService } from '../shared/url.service';
import { DataService } from '../shared/data.service';
import { StaticObjectsService } from '../helpers/global/static-objects.service';
import { ApiOpensalonService } from '../api/api-opensalon.service';


@Component({
  selector: 'app-cropper-image',
  templateUrl: './cropper-image.component.html',
  styleUrls: ['./cropper-image.component.scss']
})
export class CropperImageComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isLoading = false;
  compressedFile: File;
  selectedFile : File;
  img100x100Path: string;
  public profileImg: string = "";
  public imgData : any;
  public empid :any;
  previousUrl: string = '';
  public ScreenHeight :any;
  public screenGap : any;
  public isUploadFile : boolean = false;
  public imgW : any;
  public imgH : any;
 
  @ViewChild("myinput",{static:false}) myInputField: ElementRef;
  zeroOp = true;
  cropper = {
    x1: 100,
    y1: 50,
    x2: 300,
    y2: 250
  }

  constructor(private imageCompress: NgxImageCompressService,
    private modalRef: MDBModalRef,
    private urlService: UrlService,
    private apiOpenSalon: ApiOpensalonService,
    private globalFunc: StaticObjectsService,
    private toastrService: ToastService, 
    private ng2ImgMax: Ng2ImgMaxService,
    private apiUsers: ApiUserService,
    private dataService: DataService) { }

  ngOnInit() {
    this.urlService.previousUrl$
    .subscribe((previousUrl: string) => {
        this.previousUrl = previousUrl
        console.log(this.previousUrl);
    });

    let data = JSON.parse(this.dataService.getData);
    this.imgData= data.base64;
    this.empid = data.empid;
    if(this.empid && this.empid.length > 0)
    {
      this.dataService.setData = "isEmployeesDialog";
    }
    this.ScreenHeight = parseInt(localStorage.getItem("screenH"));
    let ScreenWidth= parseInt(localStorage.getItem("screenW"));
    let ratio = data.width / data.height; 
    let h = (ScreenWidth ) /ratio;
    this.imgH  = h;
    this.imgW = ScreenWidth;
    let blackSectionHeigh = (this.ScreenHeight - h) / 3
    if(blackSectionHeigh > 0)
    {
      this.screenGap = blackSectionHeigh;
    }
  }


  fileChangeEvent(event: Event): void {
      this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }
  imageLoaded() {
    setTimeout(() => {
      this.isLoading = false;
      this.zeroOp = false;
    });
  }
  cropperReady() {
  }

  loadImageFailed() {
  }


  cancelEvent()
  {
    this.modalRef.hide();
  }

  uploadPic()
  {
    this.isLoading = true;
    let Blob = this.globalFunc.dataURItoBlob(this.croppedImage.split(",")[1]);
    this.selectedFile = new File([Blob], "test", { type: 'image/png' });
    this.onImagePicked(this.selectedFile);
  }

  uploadEmpProfile(file: File, file40x40: File, file100x100: File)
  {
    this.apiOpenSalon.setEmployeeProfile(this.empid,file, file40x40, file100x100)
      .subscribe(
        res => {

          if (res.message === "not allowed content") {

            this.isLoading = false;
            this.notAllowedContent();
            return;
          }
          this.modalRef.content.isNewImage = true;

          let data={
            profileimg:res.profileimg,
            profileimg40x40:res.profileimg40x40,
            profileimg100x100:res.profileimg100x100,
            empid:this.empid
          }

          this.modalRef.content.Data = JSON.stringify(data);
          this.modalRef.content.isNewImage = true;
          this.modalRef.hide();
        })
  }

  
  setPhoto(file: File, file40x40: File, file100x100: File) {
    this.isLoading = true;
    this.apiUsers.setProfile(file, file40x40, file100x100)
      .subscribe(
        res => {

          if (res.message === "not allowed content") {

            this.isLoading = false;
            this.notAllowedContent();
            return;
          }

          setTimeout(() => {
            this.img100x100Path = localStorage.getItem('profileimg100x100').split('?')[0] + "?" + new Date().getTime();

            localStorage.setItem('profileimg100x100',this.img100x100Path);

            this.profileImg = localStorage.getItem('pathImg') + "?" + new Date().getTime();

            let new40x40 = localStorage.getItem('pathImg40x40').split('?')[0] + "?" + new Date().getTime();

            localStorage.setItem("pathImg40x40",new40x40);

            localStorage.setItem("isHaveProfileImage",'true');

            this.isLoading = false;

            this.modalRef.content.isNewImage = true;

            this.modalRef.hide();

          }, 200)

        })


  }



  onImagePicked(file : File) {
    this.isLoading = true;

    const reader = new FileReader();
    const reader100x100 = new FileReader();
    const reader40x40 = new FileReader();

    reader.onload = (event: any) => {
      var orientation = -1;
      this.imageCompress.compressFile(event.target.result, orientation, 50, 50).then(
        result => {

          let Blob = this.globalFunc.dataURItoBlob(result.split(',')[1]);
          this.compressedFile = new File([Blob], file.name, { type: 'image/jpeg' });
          this.ng2ImgMax.resizeImage(this.compressedFile, 40, 40).subscribe(
            result => {
              const file40x40 = new File([result], "thumbs40x40_" + result.name, {
                type: result.type,
              });
              reader40x40.onload = () => {
                this.ng2ImgMax.resizeImage(this.compressedFile, 100, 100).subscribe(
                  result => {
                    const file100x100 = new File([result], "thumbs100x100_" + result.name, {
                      type: result.type,
                    });
                    reader100x100.onload = () => {
                      if(this.empid && this.empid.length > 0)
                      {
                        this.uploadEmpProfile(this.compressedFile, file40x40, file100x100);
                      }
                      else
                      {
                       this.setPhoto(this.compressedFile, file40x40, file100x100);
                      }
                    }
                    reader100x100.readAsDataURL(file100x100);
                  })

              }
              reader40x40.readAsDataURL(file40x40);
            },
            error => {
              console.log('😢 Oh no!', error);
            }
          )
        });
    };
    reader.readAsDataURL(file);
  }

  notAllowedContent() {
    const options = { positionClass: 'md-toast-top-center', opacity: 0.8, toastClass: 'mt-5' };
    this.toastrService.error("Detect Not Allowed Content!.", 'ERROR', options);
  }

  


}


