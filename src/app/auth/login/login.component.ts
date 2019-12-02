import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    public isLoading: boolean = false;

    constructor(
        private authService: AuthService
    ) {}

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