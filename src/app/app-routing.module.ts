import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthphoneComponent } from './login/authphone/authphone.component';

import { HomeComponent } from './home/home.component';
import { OpenSalonComponent } from './open-salon/open-salon.component';
import {RedirectGuard} from "../../src/app/helpers/auth/redirect-guard";
import {AuthGuard} from "../../src/app/helpers/auth/authguard.service";
import { SalonListComponent } from './salon-list/salon-list.component';
import { UpdateSalonComponent } from './update-salon/update-salon.component';
import { GaleryComponent } from './galery/galery.component';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { BlockedUsersComponent } from './settings/privacy-options/blocked-users/blocked-users.component'
import { NotificationComponent } from './notification/notification.component';
import { SalonUsersComponent } from './salon-users/salon-users.component';
import { CropperImageComponent } from './cropper-image/cropper-image.component';
import { ImageComponent } from './image/image.component';
import { SettingsComponent } from './settings/settings.component';

import { AccountComponent } from './settings/account/account.component';
import { SalonPanelComponent } from './salon-panel/salon-panel.component';
import { SalonDeleteComponent } from './salon-delete/salon-delete.component';
  






const routes: Routes = [
  {path: '', redirectTo: '/defualtPage', pathMatch: 'full'},
  {path: 'defualtPage',component: HomeComponent, canActivate: [RedirectGuard]},
  {path: 'home',component: HomeComponent},
  {path: 'blockUsers',component: BlockedUsersComponent, canActivate: [AuthGuard]},
  {path: 'login', component:LoginComponent},
  {path: 'auth', component:AuthphoneComponent },
  {path:'open-salon',component:OpenSalonComponent, canActivate: [AuthGuard]},
  {path:'salon-panel/:id',component:SalonPanelComponent, canActivate: [AuthGuard]},
  {path:'salon-panel',component:SalonPanelComponent, canActivate: [AuthGuard]},
  {path:'salonList/:id',component:SalonListComponent, canActivate: [AuthGuard]},
  {path:'update-salon',component:UpdateSalonComponent, canActivate: [AuthGuard]},
  {path:'GaleryComponent',component:GaleryComponent, canActivate: [AuthGuard]},
  {path:'SearchDialog',component:SearchDialogComponent, canActivate: [AuthGuard]},
  {path:'MyappointmentInfoComponent',component:SearchDialogComponent, canActivate: [AuthGuard]},
  {path:'Notification',component:NotificationComponent, canActivate: [AuthGuard]},
  {path:'salonUsers',component:SalonUsersComponent, canActivate: [AuthGuard]},
  {path:'Image',component:ImageComponent, canActivate: [AuthGuard]},
  {path:'Settings',component:SettingsComponent, canActivate: [AuthGuard]},
  {path:'Account',component:AccountComponent, canActivate: [AuthGuard]},
  {path:'employee-list',component:SalonDeleteComponent, canActivate: [AuthGuard]},
   // otherwise redirect to home
   { path: '**', redirectTo: '/login' }
 ];
 
 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
export const routingComponents = [LoginComponent,HomeComponent,
                                  OpenSalonComponent,SalonListComponent,UpdateSalonComponent,SearchDialogComponent,NotificationComponent,SalonUsersComponent]
