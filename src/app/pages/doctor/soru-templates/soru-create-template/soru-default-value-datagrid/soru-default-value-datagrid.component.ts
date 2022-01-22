import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import notify from 'devextreme/ui/notify';
import {SoruFieldDefaultValue} from '../../../../../models/dynamicsoru/sorufielddefaultvalue';
import {FormFieldDefaultValue} from "../../../../../models/dynamicform/formfielddefaultvalue";

@Component({
  selector: 'app-soru-default-value-datagrid',
  templateUrl: './soru-default-value-datagrid.component.html',
  styleUrls: ['./soru-default-value-datagrid.component.scss']
})
export class SoruDefaultValueDatagridComponent implements AfterViewInit {

  @Input()
  @Input()
  formFieldDefaultValueMap: any;

  @Input()
  key:number;

  @Input()
  dataSource: FormFieldDefaultValue[];
  defaultValue :FormFieldDefaultValue;

  constructor(){
    this.defaultValue = new FormFieldDefaultValue();
  }

  ngAfterViewInit() {
  }

  addMediaToList = (e) => {
    if(this.defaultValue.valueName === '' || this.defaultValue === null || this.defaultValue.valueName === undefined){
      notify("HATA: Lütfen seçenek ismini giriniz!!!", "error");
      return;
    }

    this.formFieldDefaultValueMap[this.key].push(this.defaultValue);
    this.defaultValue = new FormFieldDefaultValue();

  }

}
