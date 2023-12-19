import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ApiStoreService } from '../api/api-store.service';
import { ApiNotificationService } from '../api/api-notification.service'
import * as moment from 'moment';
import 'moment-timezone';
import { MDBModalRef, ModalDirective } from 'ng-uikit-pro-standard';
import { StaticObjectsService } from '../helpers/global/static-objects.service';
import { Router } from '@angular/router';
import { ApiOpensalonService } from '../api/api-opensalon.service';
import { AuthenticationService } from '../helpers/auth/authentication.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notificationType = "salon";
  
  ngOnInit(): void {
  }

}

