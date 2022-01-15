// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_BASE_PATH:"http://localhost:8080/api",
  API_BASE_PATH_WS:"ws://localhost:8080/api",
  firebase: {
    apiKey: "AIzaSyB_wVRX6Zy8t8OC5-XTMyrhupnGpDSaCs8",
    authDomain: "hacettepe-rehabsoft.firebaseapp.com",
    projectId: "hacettepe-rehabsoft",
    storageBucket: "hacettepe-rehabsoft.appspot.com",
    messagingSenderId: "587391793988",
    appId: "1:587391793988:web:da61147f487344f206b511",
    measurementId: "G-PMNQT97CCE"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
