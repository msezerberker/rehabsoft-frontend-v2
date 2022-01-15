import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
          // check if route is restricted by role

          if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
            console.log("role not authorised so redirect to home page-----");
              // role not authorised so redirect to home page
              this.router.navigate(['/']);
              return false;
          }

          // if(!currentUser.isGeneralInformationSaved
          //   || !currentUser.isPatientSaved
          //   && this.router.getCurrentNavigation().extractedUrl.toString() != '/general-evaluation-form'){
          //   console.log(this.router.getCurrentNavigation().extractedUrl.toString());
          //   this.router.navigate(['/general-evaluation-form']);
          //   return true;
          // }
          console.log("authorized oldu");
          // authorised so return true
          return true;
        }
        console.log("LOGINE YONLENDIR-----");
        // not logged in so redirect to login page with the return url
        // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        this.router.navigate(['/login']);
        return false;
    }
}
