import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {FormFieldDefaultValue} from '../../../../../../models/dynamicform/formfielddefaultvalue';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-default-value-data-griddd',
  templateUrl: './default-value-data-griddd.component.html',
  styleUrls: ['./default-value-data-griddd.component.scss']
})
export class DefaultValueDataGridddComponent implements AfterViewInit {

  @Input()
  formFieldDefaultValueMap: any;

  @Input()
  key:number;

  @Input()
  dataSource: FormFieldDefaultValue[];
  defaultValue : FormFieldDefaultValue;

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
