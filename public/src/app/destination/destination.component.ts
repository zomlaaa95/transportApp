import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Destination, DestinationRequest } from '../_model/index';
import { DestinationService } from '../_services/index';
import { NotificationComponent } from '../notification/notification.component';
import { SessionService } from './../_core/index';
import * as _ from 'lodash';
import { constants } from './../utils/constants';

import { } from 'googlemaps';
import { MapsAPILoader, AgmMap } from '@agm/core';

@Component({
  selector: 'app-destination',
  templateUrl: './destination.component.html',
  styleUrls: ['./destination.component.css']
})
export class DestinationComponent implements OnInit {

  constructor(private destinationService: DestinationService, private sessionService: SessionService, private router: Router) { }

  @ViewChild(NotificationComponent) notification: NotificationComponent;

  destination = new Destination();
  destinationRequest = new DestinationRequest();

  destinationRequests = new Array<DestinationRequest>();
  preChangeDestinationRequests: Array<DestinationRequest>;
  openRequests = new Array<DestinationRequest>();

  destinationOpen: boolean;
  remove: boolean;
  destinationRequestId: String;

  ticketsIncome: Number;
  // ili da ga dobijem iz html-a - kao zbir svih cena iz request-ova

  lat = 0;
  lng = 0;

  points = new Array<Object>();

  deleteHeader = 'Reject Request';
  deleteText = 'Are you sure you want to reject this request?';

  deleteHeaderReject = 'Reject Request';
  deleteTextReject = 'Are you sure you want to reject this request?';

  deleteHeaderRemove = 'Remove Request';
  deleteTextRemove = 'Are you sure you want to remove the request?';

  ngOnInit() {
    this.setDummyLocation();
    this.refreshPage();
  }

  setDummyLocation() {
    // To prevent error, because destination is binded to map
    this.destination.startLocation = {
      lat: 0, lng: 0
    };
    this.destination.endLocation = {
      lat: 10, lng: 10
    }
  }

  refreshPage() {
    const urlString = this.router.url;
    const urlArray = urlString.split('/');
    const id = urlArray[urlArray.length - 1];
    this.destinationService.findById(id).subscribe(data => {
      this.destination = data;
      this.setMapInitLocation();
      const startDate = new Date(this.destination.startDate);
      if (startDate.getTime() > new Date().getTime()) {
        this.destinationOpen = true;
      }

      // load current requests and save to preChange and destinationRequests
    }, error => {
      this.notification.error('Get Destinations - Error ' + error.status + ' - ' + error.statusText);
    });
  }

  setMapInitLocation() {
    this.points.push(this.destination.startLocation);
    this.points.push(this.destination.endLocation);

    console.log(this.points);
  }

  setLocation(destinationRequest: DestinationRequest) {
    console.log('setting location');
    this.destinationRequest = destinationRequest;
  }

  resetLocation() {
    this.destinationRequest = new DestinationRequest();
  }

  addToDestination(destinationRequest: DestinationRequest) {
    console.log('adding to destination');
    // add to destinationRequests
    // remove from open requests
  }

  calculate() {
    console.log('calculating');
  }

  save() {
    console.log('saving changes');
    // go thround preChanged and destinationRequests
    // compare them, and save the changes (change statuses, add/delete neccessary, send push notifications)
    // if one fails, all fail
  }

  setDeleteId(id: string, remove: boolean) {
    if (remove) {
      this.deleteHeader = this.deleteHeaderRemove;
      this.deleteText = this.deleteTextRemove;
      this.remove = true;
    } else {
      this.deleteHeader = this.deleteHeaderReject;
      this.deleteText = this.deleteTextReject;
      this.remove = false;
    }

    this.destinationRequestId = id;
  }

  delete() {
    if (this.remove) {
      this.removeRequest();
    } else {
      this.rejectRequest();
    }
  }

  removeRequest() {
    console.log('removing request');
    // remove request from destinationRequests
  }

  rejectRequest() {
    console.log('rejecting request');
    // reject request and remove it from view
  }

  drawPolyline() {
    console.log('this should draw a polylyne');

    const polylines = [
      {
        latitude:  39.8282,
        longitude: -98.5795,
        speed: 50
    },
     {
        latitude:  38.8282,
        longitude: -108.5795,
        speed: 50
    }
    ];


  }

}
