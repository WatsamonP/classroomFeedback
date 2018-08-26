import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  testId: string = 'B5800018';
  stdId: string = '';
  found: boolean;
  myData: any[];

  constructor(private httpClient: HttpClient, private http: Http){}

  fetchData(){
    //return this.http.get('https://classattendence-c4e10.firebaseio.com/users/.json').map(res:Response) => res.json().data);
    return this.httpClient.get('https://classattendence-c4e10.firebaseio.com/users/.json')
  }

  fetchFeedback(){
    return this.httpClient.get('https://classroomfeedback-57c36.firebaseio.com/.json')
  }
}
