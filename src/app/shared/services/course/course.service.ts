import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CourseService {


  constructor(private _http: Http) { }

  getTeacher(): Observable<any> {
    return this._http
      .get('https://classattendence-c4e10.firebaseio.com/users/.json')
      .map(response => { 
        return response.json(); 
      });
  }

  getCourse(teacherUid, teacherData): Observable<any> {
    return this._http
      .get(`https://classattendence-c4e10.firebaseio.com/users/${teacherUid}/course.json`)
      .map(response => { 
        let obj = {teacher: {uid: teacherUid, data: teacherData}, course: response.json()}
        return obj; 
      });
  }

  getStudent(teacher, courseId, courseData, student_id): Observable<any> {
    return this._http
      .get(`https://classattendence-c4e10.firebaseio.com/users/${teacher.uid}/course/${courseId}/students/${student_id}.json`)
      .map(response => { 
        let obj = {teacher: teacher, course: courseData, student: response.json()}
        return obj; 
      });
  }
}
