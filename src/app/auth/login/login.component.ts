import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    public isLoading: boolean = false;

    public onLogin(form: NgForm): void {
        console.log(form.value);
    }
}