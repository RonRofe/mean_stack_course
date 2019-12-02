import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    public isLoading: boolean = false;

    private authStatusSubscription: Subscription;

    constructor(
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.authStatusSubscription = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
            this.isLoading = false;
        });
    }

    ngOnDestroy() {
        this.authStatusSubscription.unsubscribe();
    }

    public onLogin(form: NgForm): void {
        if(form.invalid) {
            return;
        }
        
        this.isLoading = true;
        this.authService.login(
            form.value.email, form.value.password
        );
    }
}