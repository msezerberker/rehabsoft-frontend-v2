import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../../services/notification.service";
import notify from "devextreme/ui/notify";
import { Notification } from 'src/app/models/notification';

@Component({
  selector: 'app-notification-list-component',
  templateUrl: 'notification-list.component.html',
  styleUrls: [ './notification-list.component.scss' ]
})

export class NotificationListComponent implements OnInit{


  dataSource: Notification[];
  monthNames = ["","Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  constructor(private notificationService:NotificationService) {

  }

  ngOnInit(): void {
    this.getItemsList();

  }

  click=(id:number)=>{
    console.log("notification tiklandi: " + id);
    this.notificationService.clickNotification(id).subscribe(
      (data)=>{
      },
      (error)=>{
        notify(error);
      }
    );

  }

  getItemsList = ()=>{
    this.notificationService.getAll().subscribe(
      (data)=>{
        this.dataSource = data;
        this.convertCreationDateToDate();
      },
      (error)=>{
        notify(error);
      }
    );
  }

  convertCreationDateToDate = () => {
    this.dataSource.forEach(notification=>{
      notification.creationDate = new Date(notification.creationDate);
      console.log("bildirim tarihi: "+notification.creationDate);
      notification.creationDate = notification.creationDate.toLocaleString();
      console.log("bildirim tarihi: "+notification.creationDate);
    });
  }
}
