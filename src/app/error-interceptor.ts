import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material';

import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private dialog: MatDialog
    ) {}

    public intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                this.dialog.open(ErrorComponent);
                return throwError(error);
            })
        );
    }
}