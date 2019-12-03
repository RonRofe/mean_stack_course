import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

import { AuthService } from './auth.service';

import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        FormsModule
    ],
    providers: [
        AuthService
    ]
})
export class AuthModule {

}