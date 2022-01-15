
import {Component, Input, OnInit} from '@angular/core';
import {GeneralFormService} from "../../../../../shared/services/generalForm.service"
import { ViewChild} from '@angular/core';
import {AsynImageComponent} from "../../../../../shared/components/asyn-image/asyn-image.component";
import {environment} from "../../../../../../environments/environment";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {OtherOrthesisInfo} from "../../../../../models/generalevaluationform/otherorthesisinfo";

@Component({
  selector: 'app-other-orthesis-info-data-grid',
  templateUrl: './other-orthesis-info-data-grid.component.html',
  styleUrls: ['./other-orthesis-info-data-grid.component.scss']
})
export class OtherOrthesisInfoDataGridComponent implements OnInit {

  @Input()
  otherOrthesisInfoCollection:OtherOrthesisInfo[];
  tcKimlikNo:string;
  error = '';

  @ViewChild(AsynImageComponent) asynImageComponentForImageView: AsynImageComponent;
  title:string;
  isImagePopUpVisible: boolean;
  imageUrlToDownload: string;
  orthesisImageFileName:Map<number,string> = new Map<number, string>();

  constructor(private generalFormService:GeneralFormService) {

  }

  ngOnInit() {
    this.otherOrthesisInfoCollection.forEach(
      orthesisInfo=>{
        this.prepareDownloadName(orthesisInfo);
      }
    );
  }

  showImage = (event)=>{
    this.imageUrlToDownload = `${environment.API_BASE_PATH}/patient/generalevaluationform/getorthesisimage/${event.row.data.id}`;
    this.title = 'Ortez Resmi';
    this.isImagePopUpVisible = true;
  }

  downloadImage = (event) => {
    this.generalFormService.getOrthesisImage(event.row.data.id).subscribe(imageBlob=>{
      let link = document.createElement("a");
      link.href = URL.createObjectURL(imageBlob);
      link.setAttribute('visibility','hidden');
      link.download = this.orthesisImageFileName.get(event.row.data.id);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  private prepareDownloadName = (otherOrthesisInfo:OtherOrthesisInfo) =>{
    this.orthesisImageFileName.set(otherOrthesisInfo.id, this.getFileNameFromUrl(otherOrthesisInfo.orthesisUrl));
  }
  private getFileNameFromUrl = (url:string):string =>{
    return url.split("/").pop();
  }

}
