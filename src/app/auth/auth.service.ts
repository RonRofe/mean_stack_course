import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';

@Injectable()
export class AuthService {
    private token: string;

    constructor(
        private http: HttpClient
    ) {}

    public getToken(): string {
        return this.token;
    }

    public createUser(email: string, password: string): void {
        const authData: AuthData = { email, password };
        this.http.post(
            'http://localhost:3000/api/user/signup',
            authData
        ).subscribe();
    }

    public login(email: string, password: string): void {
        const authData: AuthData = { email, password };
        this.http.post<{ token: string }>(
            'http://localhost:3000/api/user/login',
            authData
        ).subscribe(({ token }: { token: string }) => {
            this.token = token;
        });
    }
}