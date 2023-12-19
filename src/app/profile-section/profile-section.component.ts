import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MDBModalRef, MDBModalService, ToastService } from 'ng-uikit-pro-standard';
import { Session } from 'protractor';
import { ApiUserService } from '../api/api-user.service';
import { CropperImageComponent } from '../cropper-image/cropper-image.component';
import { ImageHandler } from '../helpers/global/ImageHandler';
import { StaticObjectsService } from '../helpers/global/static-objects.service';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-profile-section',
  templateUrl: './profile-section.component.html',
  styleUrls: ['./profile-section.component.scss']
})
export class ProfileSectionComponent implements OnInit {

  public thumbProfileImg: string = "";
  public isLoading: boolean;
  modalRef: MDBModalRef;
  compressedFile: File;

  constructor(
    private globalFunc: StaticObjectsService,
    private imageHandler:ImageHandler,
    private translate: TranslateService,
    private modalService: MDBModalService,
    private dataService: DataService,
    private toastrService: ToastService,
    public apiUsers: ApiUserService) { }

  ngOnInit() {


    this.modalService.opened.subscribe((result: any) => {
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);

    });


    this.thumbProfileImg = localStorage.getItem('profileimg100x100').split('?')[0] + "?" + new Date().getTime();
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
            this.thumbProfileImg = localStorage.getItem('profileimg100x100').split('?')[0] + "?" + new Date().getTime();
            let new40x40Url = localStorage.getItem('pathImg40x40').split('?')[0] + "?" + new Date().getTime();
            localStorage.setItem("profileimg100x100", this.thumbProfileImg);
            localStorage.setItem("pathImg40x40", new40x40Url);
            this.isLoading = false;
          }, 200)

        })
  }

  notAllowedContent() {
    const options = { positionClass: 'md-toast-top-center', opacity: 0.8, toastClass: 'mt-5' };
    this.toastrService.error("Detect Not Allowed Content!.", 'ERROR', options);
  }



  onImagePicked(event: Event): void {
    this.isLoading = true;

    let file = (event.target as HTMLInputElement).files[0];

    this.imageHandler.openCropImage(file,'', () => { this.afterCropImage() });

    this.isLoading = false;
  }

  afterCropImage() {
    this.thumbProfileImg = localStorage.getItem('profileimg100x100').split('?')[0] + "?" + new Date().getTime();
  }

}




