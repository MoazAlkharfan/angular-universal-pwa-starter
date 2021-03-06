import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticatedUser } from '@interfaces/authenticated-user.interface';

import { AuthService } from '../../auth.service';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-account-management',
    templateUrl: './account-management.component.html',
})
export class AccountManagementComponent implements OnInit, OnDestroy {
    destroy: Subject<any> = new Subject();
    user: AuthenticatedUser;
    showChangePassword = false;
    hasEmailAndPasswordAuthProvider = false;
    hasGoogleAuthProvider = false;
    hasFacebookAuthProvider = false;

    constructor(public auth: AuthService, public router: Router) {}

    ngOnInit() {
        this.auth.user$.takeUntil(this.destroy).subscribe(user => {
            if (user === null || (this.auth.isAuthenticatedUser(user) && !user.email)) {
                return this.router.navigate(['/']);
            }
            if (this.auth.isAuthenticatedUser(user)) {
                this.user = user;
                this.hasEmailAndPasswordAuthProvider = user.authProviders.includes('emailAndPassword');
                this.hasGoogleAuthProvider = user.authProviders.includes('google');
                this.hasFacebookAuthProvider = user.authProviders.includes('facebook');
            }
        });
    }

    logout() {
        this.auth.logout();
    }

    disavowAllRefreshTokens() {
        this.auth.disavowAllRefreshTokens();
    }

    toggleShowChangePassword() {
        this.showChangePassword = !this.showChangePassword;
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}
