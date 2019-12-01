import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';

@Injectable()
export class AuthService {
    constructor(
        private http: HttpClient
    ) {}

    public createUser(email: string, password: string): void {
        const authData: AuthData = { email, password };
        this.http.post(
            'http://localhost:3000/api/user/signup',
            authData
        ).subscribe();
    }

    public login(email: string, password: string): void {
        const authData: AuthData = { email, password };
        this.http.post(
            'http://localhost:3000/api/user/login',
            authData
        ).subscribe();
    }
}