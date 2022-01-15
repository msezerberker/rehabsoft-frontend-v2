import {Component, OnInit} from '@angular/core';
import 'devextreme/data/odata/store';
import {TokenDto} from '../models/tokendto';
import {FirebaseMessagingService} from "../shared/services/firebase-messaging.service";

@Component({
  templateUrl: 'pages.component.html'
})

export class PagesComponent implements OnInit{
  currentUser: TokenDto;

  constructor(
    private messagingService: FirebaseMessagingService) {
  }

  ngOnInit() {
    this.messagingService.receiveMessage();
  }
}
