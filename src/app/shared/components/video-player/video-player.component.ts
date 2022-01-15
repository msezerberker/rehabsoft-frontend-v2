// vjs-player.component.ts
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import videojs from 'video.js';
import {AuthenticationService} from "../../../security/authentication.service";

// @ts-ignore
@Component({
  selector: 'video-player-component',
  template: `
    <video #target width="400" height="300" class="video-js" playsinline preload="auto" crossorigin="use-credentials" ></video>
  `,
  styleUrls: [
    './video-player.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('target', {static: true}) target;
  // see options: https://github.com/videojs/video.js/blob/mastertutorial-options.html
  @Input() options: {
    responsive: boolean,
    fluid: boolean,
    aspectRatio: string,
    autoplay: boolean,
    sources: {
      src: string,
      type: string
    }[],
    html5:any,
    controls: true
  };
  player: videojs.Player;
  token:string;

  @Input()
  set paused(val: boolean) {
    if(this.player!==undefined && val===true) {
      this.player.pause();
    }
  }

  constructor(
    private elementRef: ElementRef,
    private authenticationService:AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(user=>{
      this.token = user.token;
    });

  }

  ngOnInit() {
    // instantiate Video.js
    let tokenForHeader = this.token;
    // videojs.Hls.xhr.beforeRequest =  function(options){
    //   console.log('before XHR Call');
    //   console.log('options', options)
    //   return options;
    // };

    // videojs.hook('beforesetup', (videoEl, options) =>{
    //
    //   options.headers = options.headers || {};
    //   options.headers.Authorization = 'Bearer ggg';
    //   return options;
    // });

    // this.options.sources.forEach(source=>{
    //   source.withCredentials = true;
    // });
    // {
    //   hls: {
    //     withCredentials: true,
    //       overrideNative: true
    //   }
    // }
    this.player = videojs(this.target.nativeElement, this.options
      , function onPlayerReady() {
      console.log('onPlayerReady', this);
    });

    // this.player.src({
    //   src: "http://localhost:8080/video/stream/mp4/toystory",
    //   type: 'application/x-mpegURL',
    //   withCredentials: true
    // });
    console.log(this.player);

    // this.player.ready(function() {
    //   this.player.src({
    //     src: 'https://videos.example.com/#{@model.video_source_url}',
    //     type: 'application/dash+xml',
    //     withCredentials: true
    //   });

    var beforeSetupHooks = videojs.hooks('beforesetup');
    console.log("beforeSetupHooks: ",beforeSetupHooks);
  }

  ngOnDestroy() {
    // destroy player
    if (this.player) {
      this.player.dispose();
    }
  }
}
