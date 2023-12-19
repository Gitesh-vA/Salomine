import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { MDBSpinningPreloader } from 'ng-uikit-pro-standard';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule, ToastService } from 'ng-uikit-pro-standard';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CalendarModule, DateAdapter } from 'angular-calendar'
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { OpenSalonComponent } from './open-salon/open-salon.component';
import { NgwWowModule } from 'ngx-wow';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from "./helpers/auth/token-interceptor.service";
import { AuthphoneComponent } from './login/authphone/authphone.component';
import { SalonListComponent } from './salon-list/salon-list.component';
import { EmployeeDropDownComponent } from './employee-drop-down/employee-drop-down.component'
import { ModalComponent } from './modal/modal.component';
import { InfoComponent } from './info/info.component';
import { HeaderNavComponent } from './header-nav/header-nav.component';
import { UpdateSalonComponent } from './update-salon/update-salon.component';
import { SalonPanelComponent } from './salon-panel/salon-panel.component';
import { SuccessDynamicModalComponent } from './success-dynamic-modal/success-dynamic-modal.component';
import { InfoDynamicModalComponent } from './info-dynamic-modal/info-dynamic-modal.component';
import { CropperImageComponent } from './cropper-image/cropper-image.component';
import { Ng2ImgMaxModule } from 'ng2-img-max';

// Import ng-circle-progress
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxImageCompressService } from 'ngx-image-compress';
import { GaleryComponent } from './galery/galery.component';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { LoginInfoComponent } from './login-info/login-info.component';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LanguagesComponent } from './languages/languages.component';
import { UrlService } from './shared/url.service';
import { BlockedUsersComponent } from './settings/privacy-options/blocked-users/blocked-users.component';
import { MyHammerConfig } from './my-hammer-config';

import { AgmCoreModule } from '@agm/core';
import { ProfileSectionComponent } from './profile-section/profile-section.component';
import { NotificationComponent } from './notification/notification.component';
import { NavbarComponent } from './side-navbar/navbar.component';
import { SalonDetailsComponent } from './salon-details/salon-details.component';
import { BottomNavBarComponent } from './bottom-nav-bar/bottom-nav-bar.component';
import { SalonUsersComponent } from './salon-users/salon-users.component';
import { NotificationTemplateComponent } from './notification-template/notification-template.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageComponent } from './image/image.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountComponent } from './settings/account/account.component';
import { LanguageComponent } from './settings/language/language.component';
import { HelpComponent } from './settings/help/help.component';
import { AboutComponent } from './settings/about/about.component';
import { PrivacyComponent } from './settings/privacy-options/privacy/privacy.component';
import { DeleteAccountComponent } from './settings/account/delete-account/delete-account.component';
import { PrivacyOptionsComponent } from './settings/privacy-options/privacy-options.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { ThemeComponent } from './settings/theme/theme.component';
import { SalonDeleteComponent } from './salon-delete/salon-delete.component';




@NgModule({
  declarations: [
    AppComponent, 
    routingComponents, 
    LoginComponent, 
    HomeComponent, 
    OpenSalonComponent, 
    AuthphoneComponent, 
    SalonListComponent, 
    EmployeeDropDownComponent, 
    ModalComponent, 
    InfoComponent, 
    HeaderNavComponent, 
    UpdateSalonComponent, 
    SuccessDynamicModalComponent, 
    InfoDynamicModalComponent, 
    GaleryComponent, 
    SearchDialogComponent, 
    LoginInfoComponent, 
    CropperImageComponent,
    LanguagesComponent, 
    BlockedUsersComponent,ProfileSectionComponent, NotificationComponent, NavbarComponent, SalonDetailsComponent, BottomNavBarComponent, SalonUsersComponent,NotificationTemplateComponent,ImageComponent, SettingsComponent, AccountComponent, LanguageComponent, HelpComponent, AboutComponent, PrivacyComponent, DeleteAccountComponent, PrivacyOptionsComponent, ThemeComponent,SalonPanelComponent, SalonDeleteComponent],
    
  imports: [
    GooglePlaceModule,
    BrowserModule,
    InlineSVGModule.forRoot(),
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyBy53hKpD250Cn_IkQHyP9Lt2Ysv_8oxH0',
    language: 'he'}),
    MDBBootstrapModulesPro.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    ToastModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgwWowModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NgbModule,
    Ng2ImgMaxModule,
    Ng2SearchPipeModule,

    // Specify ng-circle-progress as an import
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
      subtitle: "test",
    }),
    HttpClientModule,
    InfiniteScrollModule,
    ImageCropperModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [SuccessDynamicModalComponent,
    NotificationComponent,
    GaleryComponent,
    InfoDynamicModalComponent,
    LoginInfoComponent,
    CropperImageComponent],


  providers: [
    UrlService,
    MDBSpinningPreloader,
    ToastService,
    NgxImageCompressService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig},
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }


// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
