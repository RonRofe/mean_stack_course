import { Component } from '@angular/core';

@Component({
    templateUrl: './error.component.html'
})
export class ErrorComponent {
    public message: string = 'An unknown error occurred!';

}