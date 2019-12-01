import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
    public isLoading: boolean = false;

    public onSignup(form: NgForm): void {
        console.log(form.value);
    }
}