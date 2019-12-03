import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';

import { AuthData } from './auth-data.model';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable()
export class AuthService {
    private token: string;
    private isAuthenticated: boolean = false;
    private userId: string;
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

    public getUserId(): string {
        return this.userId;
    }

    public getAuthStatusListener(): Observable<boolean> {
        return this.authStatusListener.asObservable();
    }

    public createUser(email: string, password: string): void {
        const authData: AuthData = { email, password };
        this.http.post(BACKEND_URL + 'signup', authData).subscribe(() => {
            this.router.navigate(['/']);
        }, () => {
            this.authStatusListener.next(false);
        });
    }

    public login(email: string, password: string): void {
        const authData: AuthData = { email, password };
        this.http.post<{ token: string, expiresIn: number, userId: string }>(
            BACKEND_URL + 'login',
            authData
        ).subscribe(({ token, expiresIn, userId }: { token: string, expiresIn: number, userId: string }) => {
            this.token = token;
            if(token) {
                this.setAuthTimer(expiresIn);
                this.isAuthenticated = true;
                this.userId = userId;
                this.authStatusListener.next(true);
                const now: Date = new Date();
                const expirationDate: Date = new Date(now.getTime() + (expiresIn * 1000));
                this.saveAuthData(token, expirationDate, userId);
                this.router.navigate(['/']);
            }
        }, () => {
            this.authStatusListener.next(false);
        });
    }

    public autoAuthUser(): void {
        const authInformation: { token: string, expirationDate: Date, userId: string } = this.getAuthData();
        if(!authInformation) {
            return;
        }
        const now: Date = new Date();
        const expiresIn: number = authInformation.expirationDate.getTime() - now.getTime();
        if(expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    public logout(): void {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.userId = null;
        this.clearAuthData();
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string): void {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    private clearAuthData(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    private getAuthData(): { token: string, expirationDate: Date, userId: string } {
        const token: string = localStorage.getItem('token');
        const expirationDate: Date = new Date(localStorage.getItem('expiration'));
        const userId = localStorage.getItem('userId');
        if(!token || !expirationDate) {
            return;
        }
        return {
            token,
            expirationDate,
            userId
        }
    }
}