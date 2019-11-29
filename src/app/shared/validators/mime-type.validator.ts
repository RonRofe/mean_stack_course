import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeType = (
    control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
    if(typeof(control.value) === 'string') {
        return of(null);
    }
    const file: File = control.value as File;
    const reader: FileReader = new FileReader();
    const reader$: Observable<{ [key: string]: any }> = Observable.create((observer: Observer<{ [key: string]: any }>) => {
        reader.onload = () => {
            const arr: Uint8Array = new Uint8Array(reader.result as ArrayBuffer).subarray(0,4);
            let header: string = '';
            let isValid: boolean = false;
            for(let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }
            switch(header) {
                case '89504e47':
                    isValid = true;
                    break;
                case 'ffd8ffe0':
                    isValid = true;
                    break;
                default:
                    isValid = false;
            }
            if(isValid) {
                observer.next(null);
            } else {
                observer.next({ InvalidMimeType: true });
            }
            observer.complete();
        };
        reader.readAsArrayBuffer(file);
    });
    return reader$;
};