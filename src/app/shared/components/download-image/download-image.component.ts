// import { Component } from '@angular/core';
//
//
// @Component({
//   selector: 'my-app',
//   template: `
//     <button (click)="getImage()">Get Image</button>
//     <img src="{{data}}" *ngIf="data" alt="Your image" style="display: block" />
//   `
// })
// export class DownloadImageComponent  {
//   data: string;
//
//   constructor(private imageService: ImageService) {}
//
//   getImage() {
//     this.imageService.getData('https://picsum.photos/200/300/?random')
//       .subscribe(
//         imgData => this.data = imgData,
//         err => console.log(err)
//       );
//   }
//
// }
