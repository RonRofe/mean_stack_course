import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
    private authListenerSubscription: Subscription;
    public isAuthenticated: boolean;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        this.isAuthenticated = this.authService.getIsAuth();
        this.authListenerSubscription = this.authService
            .getAuthStatusListener()
            .subscribe((isAuthenticated: boolean) => {
                this.isAuthenticated = isAuthenticated;
            });
    }

    ngOnDestroy() {
        this.authListenerSubscription.unsubscribe();
    }

    public onLogout(): void {
        this.authService.logout();
        this.router.navigate(['/']);
    }
}