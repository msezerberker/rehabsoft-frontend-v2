import {Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from "@angular/core";
import { switchMap,map } from 'rxjs/operators';

import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-asyn-image-component',
  template: `
    <img #image [src]="dataUrl$|async" [alt]="'asa'"
         style="height: auto;width: auto;max-width: 100%;max-height: 100%;display: block;margin-left: auto;margin-right: auto;">
  `
})
export class AsynImageComponent  implements OnChanges, OnInit {
  @ViewChild('image', { static: false }) imageElement: ElementRef;

  @Input()
  src:string;
  private src$: BehaviorSubject<any>;
  imageBlob: Blob;

// this stream will contain the actual url that our img tag will load
  // everytime the src changes, the previous call would be canceled and the
  // new resource would be loaded
  dataUrl$:Observable<any>;

  constructor(private httpClient: HttpClient, private domSanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    console.log("asyn image comstructor:",this.src);
    this.src$ = new BehaviorSubject(this.src);
    this.dataUrl$ = this.src$.pipe(switchMap(url => this.loadImage(url)));
    this.src$.next(this.src);
  }

  private loadImage(url: string): Observable<any> {
    let imageObservable = this.httpClient.get(url, {responseType: 'blob'});
    imageObservable.subscribe((imageBlob)=>{
      this.imageBlob = imageBlob;
    });
    return imageObservable
      // create an object url of that blob that we can use in the src attribute
      .pipe(map(e => this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(e))));
  }

  ngOnChanges(): void {
    this.ngOnInit();
  }

  getImageDimension = ()=>{
    return {
      width:(this.imageElement.nativeElement as HTMLImageElement).naturalWidth,
      height:(this.imageElement.nativeElement as HTMLImageElement).naturalHeight
    }
  }

}
