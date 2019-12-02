import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
    public isLoading: boolean = false;
    
    private authStatusSubscription: Subscription;

    constructor(
        public authService: AuthService
    ) {}

    ngOnInit() {
        this.authStatusSubscription = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
            this.isLoading = false;
        });
    }

    ngOnDestroy() {
        this.authStatusSubscription.unsubscribe();
    }

    public onSignup(form: NgForm): void {
        if(form.invalid) {
            return;
        }
        
        this.isLoading = true;
        this.authService.createUser(
            form.value.email,
            form.value.password
        );
    }
}