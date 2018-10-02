// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  feedback: {
    apiKey: "AIzaSyCjWxtto3yAfu_OoM7RLBCH9i-SJt76lLM",
    authDomain: "sut-feedback.firebaseapp.com",
    databaseURL: "https://sut-feedback.firebaseio.com",
    projectId: "sut-feedback",
    storageBucket: "sut-feedback.appspot.com",
    messagingSenderId: "263122649175"
  }
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
