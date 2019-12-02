import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';

import { AuthData } from './auth-data.model';

@Injectable()
export class AuthService {
    private token: string;
    private isAuthenticated: boolean = false;
    private authStatusListener: Subject<boolean> = new Subject<boolean>();
    private tokenTimer: any;

    constructor(
        private http: HttpClient,
        private router: Router
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

    public login(email: string, password: string): void {
        const authData: AuthData = { email, password };
        this.http.post<{ token: string, expiresIn: number }>(
            'http://localhost:3000/api/user/login',
            authData
        ).subscribe(({ token, expiresIn }: { token: string, expiresIn: number }) => {
            this.token = token;
            if(token) {
                this.setAuthTimer(expiresIn);
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                const now: Date = new Date();
                const expirationDate: Date = new Date(now.getTime() + (expiresIn * 1000));
                this.saveAuthData(token, expirationDate);
                this.router.navigate(['/']);
            }
        });
    }

    public autoAuthUser(): void {
        const authInformation: { token: string, expirationDate: Date } = this.getAuthData();
        if(!authInformation) {
            return;
        }
        const now: Date = new Date();
        const expiresIn: number = authInformation.expirationDate.getTime() - now.getTime();
        if(expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    public logout(): void {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date): void {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    private clearAuthData(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    }

    private getAuthData(): { token: string, expirationDate: Date } {
        const token: string = localStorage.getItem('token');
        const expirationDate: Date = new Date(localStorage.getItem('expiration'));
        if(!token || !expirationDate) {
            return;
        }
        return {
            token,
            expirationDate
        }
    }
}