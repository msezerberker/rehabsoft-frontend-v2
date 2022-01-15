import {Component, OnInit, OnDestroy} from "@angular/core";
import {AuthenticationService} from "../../security/authentication.service";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";
import {Role} from "../../models/role";
import notify from "devextreme/ui/notify";

@Component({
  templateUrl: 'join.component.html',
  styleUrls: [ './join.component.scss' ]
})
export class JoinComponent implements OnInit, OnDestroy{
  private peerConnection;
  private signalingWebsocket;

  // This object helps us to control the stream in our implemented methods. For ex: mute, stop video etc.
  private stream;

  ngOnInit() {

    /*
     * Setup 'leaveButton' button function.
     */
    const leaveButton = document.getElementById('leaveButton');
    leaveButton.addEventListener('click', this.leave);
    window.onload = this.muteLocalVideo;
  }

  ngOnDestroy(): void {
    console.log("stream bitti");
    this.closeLocalDevicesInLocal();
  }

  constructor(private authenticationService: AuthenticationService, private router:Router) {
    const currentUser = this.authenticationService.currentUserValue;
    /*
     * Prepare websocket for signaling server endpoint.
     */
    this.signalingWebsocket = new WebSocket(environment.API_BASE_PATH_WS+"/websocket/online-meeting",["access-token", currentUser.token]);
    this.signalingWebsocket.onmessage = (msg) => {
      console.log("Got message", msg.data);
      let signal = JSON.parse(msg.data);
      switch (signal.type) {
        case "offer":
          this.handleOffer(signal);
          break;
        case "answer":
          this.handleAnswer(signal);
          break;
        // In local network, ICE candidates might not be generated.
        case "candidate":
          this.handleCandidate(signal);
          break;
        default:
          break;
      }
    };
    this.signalingWebsocket.onopen = () => {
      console.log("Connected to signaling endpoint. Now initializing.");
      this.preparePeerConnection();
      this.displayLocalStreamAndSignal(true);
    };

  }


  leave = () => {
    console.log('Ending call');
    this.peerConnection.close();
    // bunu kullanmak gerek stream bititrmek icin
    // this.stream.getTracks()[0].stop();
    this.signalingWebsocket.close();
    this.closeLocalDevicesInLocal();
    this.navigateByRole();
  };

  private closeLocalDevicesInLocal = () =>{
    this.stream.getTracks().forEach(track => track.stop());
  }

  private closeLocalDevicesInStream = () =>{

  }

  private navigateByRole = ()=>{
    if(this.authenticationService.currentUserValue.role === Role.Doctor){
      this.router.navigate(['/doctor/online-meeting/list']);
    } else if(this.authenticationService.currentUserValue.role === Role.User){
      this.router.navigate(['/user/online-meeting/list']);
    }
  }

  sendSignal = (signal) => {
    if (this.signalingWebsocket.readyState == 1) {
      this.signalingWebsocket.send(JSON.stringify(signal));
    }
  };

  preparePeerConnection = () => {

    // Using free public google STUN server.
    const configuration =   {
      iceServers: [
        {
          urls: [
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
        {
          urls: [
            "stun:global.stun.twilio.com:3478?transport=udp",
          ],
        },
      ],
      iceCandidatePoolSize: 10,
    };

    // Prepare peer connection object
    this.peerConnection = new RTCPeerConnection(configuration);
    this.peerConnection.onnegotiationneeded = async () => {
      console.log('onnegotiationneeded');
      this.sendOfferSignal();
    };
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('onicecandidate');
        this.sendSignal(event);
      }
    };

    /*
	 * Track other participant's remote stream & display in UI when available.
	 *
	 * This is how other participant's video & audio will start showing up on my
	 * browser as soon as his local stream added to track of peer connection in
	 * his UI.
	 */
    this.peerConnection.addEventListener('track', this.displayRemoteStream);

  };

  /*
   * Display my local webcam & audio on UI.
   */
  displayLocalStreamAndSignal = async (firstTime) => {
    console.log('Requesting local stream');
    const localVideo = <HTMLVideoElement>(document.getElementById('localVideo'));

    let localStream;
    try {
      // Capture local video & audio stream & set to local <video> DOM
      // element
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });
      console.log('Received local stream');
      localVideo.srcObject = this.stream;
      localStream = this.stream;
      this.logVideoAudioTrackInfo(localStream);
      localVideo.muted =true;

      // For first time, add local stream to peer connection.
      if (firstTime) {
        setTimeout(
          () => {
            this.addLocalStreamToPeerConnection(localStream);
          }, 2000);
      }

      // Send offer signal to signaling server endpoint.
      this.sendOfferSignal();
      this.muteLocalVideo();

    } catch (e) {
      alert(`getUserMedia() error: ${e.name}`);
      throw e;
    }
    console.log('Start complete');
  };

  /*
 * Add local webcam & audio stream to peer connection so that other
 * participant's UI will be notified using 'track' event.
 *
 * This is how my video & audio is sent to other participant's UI.
 */
  addLocalStreamToPeerConnection = async (localStream) => {
    console.log('Starting addLocalStreamToPeerConnection');
    localStream.getTracks().forEach(track => this.peerConnection.addTrack(track, localStream));
    console.log('localStream tracks added');
    this.muteLocalVideo();
  };

  /*
 * Display remote webcam & audio in UI.
 */
  displayRemoteStream = (e) => {
    console.log('displayRemoteStream');
    const remoteVideo = <HTMLVideoElement>(document.getElementById('remoteVideo'));
    if (remoteVideo.srcObject !== e.streams[0]) {
      remoteVideo.srcObject = e.streams[0];
      console.log('pc2 received remote stream');
    }
  };

  /*
   * Send offer to signaling server. This is kind of telling server that my webcam &
   * audio is ready, so notify other participant of my information so that he can
   * view & hear me using 'track' event.
   */
  sendOfferSignal = () => {
    this.peerConnection.createOffer((offer) => {
      this.sendSignal(offer);
      console.log("offer atiliyor")
      this.peerConnection.setLocalDescription(offer);
    }, (error) => {
      alert("Error creating an offer");
    });
  };


  /*
   * Handle the offer sent by other participant & send back answer to complete the
   * handshake.
   */
  handleOffer = (offer) => {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // create and send an answer to an offer
    this.peerConnection.createAnswer((answer) => {
      this.peerConnection.setLocalDescription(answer);
      this.sendSignal(answer);
    }, function(error) {
      alert("Error creating an answer");
    });
  };

  /*
   * Finish the handshake by receiving the answer. Now Peer-to-peer connection is
   * established between my browser & other participant's browser. Since both
   * participants are tracking each others stream, they both will be able to view &
   * hear each other.
   */
  handleAnswer = (answer) => {
    console.log("answer handle edilcek peerConnection: ",this.peerConnection);
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer)).then(()=>{
      console.log("connection established successfully!!");
    });
  };

  /*
   * Add received ICE candidate to connection. ICE candidate has information about
   * how to connect to remote participant's browser. In local LAN connection, ICE
   * candidate might not be generated.
   */
  handleCandidate = (candidate) => {
    alert("handleCandidate");
    this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  };

  /*
   * Logs names of your webcam & microphone to console just for FYI.
   */
  logVideoAudioTrackInfo = (localStream) => {
    const videoTracks = localStream.getVideoTracks();
    const audioTracks = localStream.getAudioTracks();
    if (videoTracks.length > 0) {
      console.log(`Using video device: ${videoTracks[0].label}`);
    }
    if (audioTracks.length > 0) {
      console.log(`Using audio device: ${audioTracks[0].label}`);
    }
  };

  // To prevent your sound echo to yourself
  muteLocalVideo = () => {
    let element: any = <HTMLVideoElement> document.getElementById('localVideo');
    element.muted = true;
  }

  // Mute your voice
  muteYourStream = () => {
    this.stream.getTracks().forEach(track => track.enabled = !track.enabled);
  }

}

