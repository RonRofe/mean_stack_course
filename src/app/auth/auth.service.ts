import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

import { AuthData } from './auth-data.model';

@Injectable()
export class AuthService {
    private token: string;
    private isAuthenticated: boolean = false;
    private authStatusListener: Subject<boolean> = new Subject<boolean>();

    constructor(
        private http: HttpClient
    ) {}

    public getToken(): string {
        return this.token;
    }

    public getIsAuth(): boolean {
        return this.isAuthenticated;
    }

    public getAuthStatusListener(): Observable<boolean> {
        return this.authStatusListener.asObservable();
    }

    public createUser(email: string, password: string): void {
        const authData: AuthData = { email, password };
        this.http.post(
            'http://localhost:3000/api/user/signup',
            authData
        ).subscribe();
    }

    public async login(email: string, password: string): Promise<boolean> {
        const authData: AuthData = { email, password };
        await this.http.post<{ token: string }>(
            'http://localhost:3000/api/user/login',
            authData
        ).subscribe(({ token }: { token: string }) => {
            this.token = token;
            if(token) {
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
            }
        });
        return this.isAuthenticated;
    }

    public logout(): void {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
    }
}