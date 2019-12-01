import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    public isLoading: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    public async onLogin(form: NgForm): Promise<void> {
        if(form.invalid) {
            return;
        }
        
        this.isLoading = true;
        const isLoginSucceed: boolean = await this.authService.login(
            form.value.email, form.value.password
        );
        if(isLoginSucceed) {
            this.router.navigate(['/']);
        }
    }
}