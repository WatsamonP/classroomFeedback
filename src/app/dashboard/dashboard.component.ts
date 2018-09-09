import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
import { Router } from "@angular/router";
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from "rxjs";
import { CourseService } from "../shared/services/course/course.service";
import { DataService } from "../shared/services/data/data.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  authItem: any;
  authUid: String;
  student_id: String;
  teacherList: Observable<any>;
  courseList: Observable<any>;

  isNotFound: boolean = true;
  isLoader: boolean = true;
  studentlist: any;
  isClick: boolean = false;
  isClickIndex;

  constructor(
    private _afDb: AngularFireDatabase,
    private _courseService: CourseService,
    private authService: AuthService,
    private router: Router,
    private data: DataService
  ) {
    this.authUid = this.authService.authInfo$.value.$uid;
    _afDb.object(`users/${this.authUid}/profile`).valueChanges().subscribe((res) => {
      this.authItem = res;
      this.student_id = this.authItem.stdId;
      this.studentlist = [];

      let tempTeacher;
      this._courseService.getTeacher().subscribe((res) => {
        tempTeacher = Object.keys(res);
        for (var i = 0; i < tempTeacher.length; i++) {
          this._courseService.getCourse(tempTeacher[i], res[tempTeacher[i]]).subscribe((resCourse) => {
            this.getStudent(resCourse);
            setTimeout(() => { this.isLoader = false; }, 1500);
          })
        }
      })
    })
  }


  // res มี Object ของ Teacher และ Course
  getStudent(res) {
    //console.log(res)
    let courseKey = Object.keys(res.course)
    for (var i = 0; i < courseKey.length; i++) {
      this._courseService.getStudent(res.teacher, courseKey[i], res.course[courseKey[i]], this.student_id).subscribe((resStudent) => {
        if (resStudent.student !== null) {
          console.log(resStudent)
          this.studentlist.push(resStudent)
          this.isNotFound = false;
        }
      })
    }
    
  }


  ngOnInit() {

  }

  selectedCourse(index){
    this.isClickIndex = index;
    this.isClick = !this.isClick 
  }

  onClickCheckScore(item){
    this.data.changeMessage(item)
    this.router.navigate(['/score',item.course.id]);
  }

  onClickFeedback(item){
    this.data.changeMessage(item)
    this.router.navigate(['/feedback',item.course.id]);
  }


}
