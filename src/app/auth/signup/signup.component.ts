import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
    private isLoading: boolean = false;

    constructor(
        public authService: AuthService
    ) {}

    public onSignup(form: NgForm): void {
        if(form.invalid) {
            return;
        }
        
        this.authService.createUser(
            form.value.email,
            form.value.password
        );
    }
}