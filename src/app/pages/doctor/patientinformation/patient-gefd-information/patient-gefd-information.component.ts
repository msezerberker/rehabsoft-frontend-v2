import { Component, ElementRef, OnInit, SecurityContext } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { GeneralFormService } from "../../../../shared/services/generalForm.service"
import { ViewChild } from '@angular/core';
import { DxFileUploaderComponent, DxRadioGroupComponent, DxSankeyComponent } from "devextreme-angular";
import { Hyperbilirubinemia } from "../../../../models/generalevaluationform/hyperbilirubinemia";
import { ActivatedRoute } from '@angular/router';
import { AsynImageComponent } from "../../../../shared/components/asyn-image/asyn-image.component";

import { environment } from "../../../../../environments/environment";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-patient-gefd-information',
  templateUrl: './patient-gefd-information.component.html',
  styleUrls: ['./patient-gefd-information.component.scss']
})
export class PatientGefdInformationComponent implements OnInit {
  @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;
  generalEvaluationForm: any;
  tcKimlikNo: string;

  @ViewChild("eventRadioGroupMultiplePregnancy") eventRadioGroup: DxRadioGroupComponent;
  @ViewChild("dxFileUploaderComponentBotoxReport") eventBotoxReport: DxFileUploaderComponent;
  isGeneralEvaluationFormLoaded: boolean = false;

  loading = false;
  error = '';

  //****** booleans for show component ********//
  isBotoxTreatmentHasImage: boolean=false;


  ////************** For 2 Collections in GeneralEvaluationForm bunlar sonra submitte tek tek kontrol edilip oyle collectionlarina set edilecek****************/////
  // Orthesis checkbox options
  isOrthesisMap = [
    { name: 'Tabanlık', value: false },
    { name: 'Topuk Kapı', value: false },
    { name: 'Ayak bileği hizasında ortez (supra-malleoler)', value: false },
    { name: 'Sabit Ayak-ayak bileği ortezi (AFO)', value: false },
    { name: 'Eklemli Ayak-ayak bileği ortezi (eklemli AFO)', value: false },
    { name: 'Eklemli Ayak-ayak bileği ortezi (eklemli AFO)', value: false },
    { name: 'Dinamik ayak ayak bileği ortezi (DAFO)', value: false },
    { name: 'Bacaklar için gece splinti', value: false },
    { name: 'Bacaklar için gece splinti', value: false },
    { name: 'İmmobilizer', value: false },
    { name: 'Kalça ateli', value: false },
    { name: 'Gövde korsesi', value: false },
    { name: 'Dirsek splinti', value: false },
    { name: 'Baş parmak ortezi', value: false },
  ];
  orthesisMap = new Map([
    ['Tabanlık', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['Topuk Kapı', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['Ayak bileği hizasında ortez (supra-malleoler)', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['Sabit Ayak-ayak bileği ortezi (AFO)', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['Eklemli Ayak-ayak bileği ortezi (eklemli AFO)', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['Dinamik ayak ayak bileği ortezi (DAFO)', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['Bacaklar için gece splinti', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['İmmobilizer', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['Kalça ateli', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['Gövde korsesi', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['Dirsek splinti', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['Baş parmak ortezi', new Map([
      ['left', false],
      ['right', false]
    ])]
  ]);




  ////************** For 2 Collections in GeneralEvaluationForm and 1 collection in field end ****************/////
  //For selectbox
  birthTypeSelectBoxList = [
    {
      name: "Normal vajinal ",
      value: "Normal vajinal "
    }, {
      name: "Planlı sezaryen",
      value: "planlı sezaryen"
    }, {
      name: "Acil sezaryen ",
      value: "Acil sezaryen "
    }];

  // Multiple pregnancy and others radio button
  // onIsMultiplePregnancyOptionValueChanged = (event) =>{
  //   console.log(this.generalEvaluationForm.isMultiplePregnancy);
  // }
  isRelativeMarriagelist = [{ name: 'Var', value: true }, { name: 'Yok', value: false }];
  isRelativeMarriageOption = {
    dataSource: this.isRelativeMarriagelist,
    layout: "horizontal",
    valueExpr: 'value',
    displayExpr: 'name',
  };
  isBloodIncompatibilitylist = [{ name: 'Var', value: true }, { name: 'Yok', value: false }];
  isBloodIncompatibilityOption = {
    dataSource: this.isBloodIncompatibilitylist,
    layout: "horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isBirthAnoxialist = [{ name: 'Var', value: true }, { name: 'Yok', value: false }];
  isBirthAnoxiaOption = {
    dataSource: this.isBirthAnoxialist,
    layout: "horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isBirthEmpurplinglist = [{ name: 'Var', value: true }, { name: 'Yok', value: false }];
  isBirthEmpurplingOption = {
    dataSource: this.isBirthEmpurplinglist,
    layout: "horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isBirthCryinglist = [{ name: 'Var', value: true }, { name: 'Yok', value: false }];
  isBirthCryingOption = {
    dataSource: this.isBirthCryinglist,
    layout: "horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isHighBloodPressorPregnancyList = [{ name: 'Var', value: true }, { name: 'Yok', value: false }];
  isHighBloodPressorPregnancyOption = {
    dataSource: this.isHighBloodPressorPregnancyList,
    layout: "horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isPregnancyDrinkingList = [{ name: 'Var', value: true }, { name: 'Yok', value: false }];
  isPregnancyDrinkingOption = {
    dataSource: this.isPregnancyDrinkingList,
    layout: "horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isPregnancySmokingList = [{ name: 'Var', value: true }, { name: 'Yok', value: false }];
  isPregnancySmokingOption = {
    dataSource: this.isPregnancySmokingList,
    layout: "horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isIntensiveCareList = [{ name: 'Kaldı', value: true }, { name: 'Kalmadı', value: false }];
  oxygenSupportList = [{ name: 'Aldı', value: true }, { name: 'Almadı', value: false }];
  oxygenSupportOption = {
    dataSource: this.oxygenSupportList,
    layout: "horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  newbornRetinopathyList = [{ name: 'Oldu', value: true }, { name: 'Olmadı', value: false }];
  newbornRetinopathyOption = {
    dataSource: this.newbornRetinopathyList,
    layout: "horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isRespiratuvarDistressSyndromList = [{ name: 'Oldu', value: true }, { name: 'Olmadı', value: false }];
  isRespiratuvarDistressSyndromOption = {
    dataSource: this.isRespiratuvarDistressSyndromList,
    layout: "horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isBronchopulmonaryDysplasiaList = [{ name: 'Var', value: true }, { name: 'Yok', value: false }];
  isBronchopulmonaryDysplasiaOption = {
    dataSource: this.isBronchopulmonaryDysplasiaList,
    layout: "horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isHyperbilirubinemiaList = [{ name: 'Oldu', value: true }, { name: 'Olmadı', value: false }];
  isHyperbilirubinemiaOption = {
    dataSource: this.isHyperbilirubinemiaList,
    layout: "horizontal",
    valueExpr: 'value',
    displayExpr: 'name',
    onValueChanged: (event) => {
      if (!event.value) {
        this.generalEvaluationForm.hyperbilirubinemia = null;
      }
      else {
        this.generalEvaluationForm.hyperbilirubinemia = new Hyperbilirubinemia();
      }
    }
  };
  isPhototeraphyList = [{ name: 'Aldı', value: true }, { name: 'Almadı', value: false }];
  isPhototeraphyOption = {
    dataSource: this.isPhototeraphyList,
    layout: "horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isHypoglycaemiaList = [{ name: 'Var', value: true }, { name: 'Yok', value: false }];
  isHypoglycaemiaOption = {
    dataSource: this.isHypoglycaemiaList,
    layout: "horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isVisualImpairmentList = [{ name: 'Var', value: true }, { name: 'Yok', value: false }];
  isVisualImpairmentOption = {
    dataSource: this.isVisualImpairmentList,
    layout: "horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isHearingImpairmentList = [{ name: 'Var', value: true }, { name: 'Yok', value: false }];
  isHearingImpairmentOption = {
    dataSource: this.isHearingImpairmentList,
    layout: "horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isHearingAidList = [{ name: 'Var', value: true }, { name: 'Yok', value: false }];
  isHearingAidOption = {
    dataSource: this.isHearingAidList,
    layout: "horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isPhysiotherapyPastList = [{ name: 'Var', value: true }, { name: 'Yok', value: false }];
  isPhysiotherapyPastOption = {
    dataSource: this.isPhysiotherapyPastList,
    layout: "horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };


  constructor(private generalFormService: GeneralFormService, route: ActivatedRoute, private domSanitizer: DomSanitizer) {

    route.parent.params.subscribe(
      (params) => {
        this.tcKimlikNo = params.tckimlikno;
      });
    this.generalEvaluationForm = {};
    this.generalEvaluationForm["isVisualImpairment"] = false;
    this.generalEvaluationForm["isHearingImpairment"] = false;
    this.generalEvaluationForm["isPhysiotherapyPast"] = false;
  }

  ngOnInit() {
    this.getGeneralEvaluationForm();
  }



  downloadPdf = () => {

    var element = document.getElementById("content");
    html2canvas(element).then((canvas) => {
      console.log("pdf islemi basladi")

      var imgWidth = 210;
      var pageHeight = 295;
      console.log("pdf CP- -1 basladi")
      var imgData = canvas.toDataURL('image/jpeg')
      console.log("pdf CP-0 basladi")

      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      console.log("pdf CP-1 basladi")
      var doc = new jspdf.jsPDF('p', 'mm');
      var position = 0;
      console.log("pdf CP-2 basladi")
      doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      console.log("pdf CP-3 basladi")

      doc.save('file.pdf');
      console.log("pdf islemi soona erdi")

    })
  }


  getGeneralEvaluationForm = () => {
    this.generalFormService.getByTcKimlikNo(this.tcKimlikNo).subscribe(
      (data) => {
        console.log("data", data);
        this.generalEvaluationForm = data;
        this.isGeneralEvaluationFormLoaded = true;

        this.generalEvaluationForm["isVisualImpairment"] = this.generalEvaluationForm.visualimpairment !== null;
        this.generalEvaluationForm["isHearingImpairment"] = this.generalEvaluationForm.hearingImpairment !== null;
        this.generalEvaluationForm["isPhysiotherapyPast"] = this.generalEvaluationForm.physiotherapyPast !== null;
        this.generalEvaluationForm["isBotoxTreatment"] = this.generalEvaluationForm.botoxTreatment !==  null;

        if(this.generalEvaluationForm.botoxTreatment !== null){
          this.prepareDownloadLinkBotoxImage();
          this.isBotoxTreatmentHasImage = this.generalEvaluationForm.botoxTreatment.botoxRecordUrl !== null;
        } else{
          this.isBotoxTreatmentHasImage = true;
        }

        console.log("isBotoxTreatment",this.generalEvaluationForm.isBotoxTreatment);
      },
      (error) => {
        notify("Hasta formu doldurmamıştır veya kaydı bulunmamaktadır.");
      });
  }



  // ******* Applied Treatments start******** //
  @ViewChild(AsynImageComponent) asynImageComponentForImageView: AsynImageComponent;
  title: string;
  isImagePopUpVisible: boolean;
  imageUrlToDownload: string;
  // Botox Image //
  botoxImageFileUrl: SafeResourceUrl;
  botoxImageFileName: string;
  showBotoxImage = () => {
    this.imageUrlToDownload = `${environment.API_BASE_PATH}/patient/generalevaluationform/getbotoximage/${this.generalEvaluationForm.botoxTreatment.id}`;
    this.title = 'Botoks Resmi';
    this.isImagePopUpVisible = true;
  }
  private prepareDownloadLinkBotoxImage = () => {
    if(this.generalEvaluationForm.botoxTreatment.botoxRecordFile !== undefined){
      this.generalFormService.getBotoxImageByBotoxTreatmentId(this.generalEvaluationForm.botoxTreatment.id).subscribe(imageBlob => {
        console.log("imageBlob", imageBlob);
        this.botoxImageFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(imageBlob));
        this.botoxImageFileName = this.getFileNameFromUrl(this.generalEvaluationForm.botoxTreatment.botoxRecordUrl);
      }, (error) => {
        notify(error);
      });
    }
  }
  private getFileNameFromUrl = (url: string): string => {
    return url.split("/").pop();
  }
  // ******* Applied Treatments end******** //

}
