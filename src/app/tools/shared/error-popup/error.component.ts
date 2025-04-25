import {Component, Inject} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
    protected readonly JSON = JSON;

    //Maybe remove the help email? 
    constructor(@Inject(MAT_DIALOG_DATA) public data: { error: HttpErrorResponse | null, title: string | null, message: string | null, emailSubject?: string }) {
        if(!data.emailSubject) data.emailSubject = "Astromancer Error"
    }
}
