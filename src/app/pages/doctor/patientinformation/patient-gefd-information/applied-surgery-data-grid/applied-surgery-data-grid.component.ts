
import {Component, Input, OnInit} from '@angular/core';
import {GeneralFormService} from "../../../../../shared/services/generalForm.service"
import { ViewChild} from '@angular/core';
import {AsynImageComponent} from "../../../../../shared/components/asyn-image/asyn-image.component";
import {environment} from "../../../../../../environments/environment";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {AppliedSurgery} from "../../../../../models/generalevaluationform/appliedsurgery";

@Component({
  selector: 'app-applied-surgery-data-grid',
  templateUrl: './applied-surgery-data-grid.component.html',
  styleUrls: ['./applied-surgery-data-grid.component.scss']
})
export class AppliedSurgeryDataGridComponent implements OnInit {

  @Input()
  appliedSurgeryCollection:AppliedSurgery[];
  tcKimlikNo:string;
  error = '';

  @ViewChild(AsynImageComponent) asynImageComponentForImageView: AsynImageComponent;
  title:string;
  isImagePopUpVisible: boolean;
  imageUrlToDownload: string;
  epiCrisisImageFileName:Map<number,string> = new Map<number, string>();

  constructor(private generalFormService:GeneralFormService) {

  }

  ngOnInit() {
    this.appliedSurgeryCollection.forEach(
      appliedSurgery=>{
        this.prepareDownloadName(appliedSurgery);
      }
    );
  }

  showEpiCrisisImage = (event)=>{
    console.log("epikriz secildi:",event.row.data.id);
    this.isImagePopUpVisible = true;
    this.imageUrlToDownload = `${environment.API_BASE_PATH}/patient/generalevaluationform/getepicrisisimage/${event.row.data.id}`;
    this.title = 'Epikriz Resmi';
  }

  downloadAppliedSurgery = (event) => {
    this.generalFormService.getEpiCrisisImageByAppliedSurgeryId(event.row.data.id).subscribe(imageBlob=>{
      let link = document.createElement("a");
      link.href = URL.createObjectURL(imageBlob);
      link.setAttribute('visibility','hidden');
      link.download = this.epiCrisisImageFileName.get(event.row.data.id);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  private prepareDownloadName = (appliedSurgery:AppliedSurgery) =>{
      this.epiCrisisImageFileName.set(appliedSurgery.id, this.getFileNameFromUrl(appliedSurgery.epicrisisImageUrl));
  }
  private getFileNameFromUrl = (url:string):string =>{
    return url.split("/").pop();
  }

}
