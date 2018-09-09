import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';

@Injectable()
export class MessageService {
    private _listners = new Subject<any>();

    listen(): Observable<any> {
       return this._listners.asObservable();
    }

    filter(filterBy: any) {
       this._listners.next(filterBy);
    }

}