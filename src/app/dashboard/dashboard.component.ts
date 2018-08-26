import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
import { FeedbackService } from "../shared/services/user/feedback.service";
import { DataService } from "../shared/services/data/data.service";
import { Router } from "@angular/router";
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from "rxjs";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
//import moment from 'moment';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  item: Observable<any>;
  itemFeedback: Observable<any>;
  userTemp: any;
  courseTemp: any;
  stdTemp: any;
  stdFeedback: any;
  currentStudentId: String;
  studentCourse: any;
  courseDate: any;
  imgSrc1: string = "assets/images/emotions/1-1.png";
  imgSrc2: string = "assets/images/emotions/2-1.png";
  imgSrc3: string = "assets/images/emotions/3-1.png";
  imgSrc4: string = "assets/images/emotions/4-1.png";
  imgSrc5: string = "assets/images/emotions/5-1.png";
  attendanceKey: any;
  objectKeys = Object.keys;
  ratingNo: Number;
  form:FormGroup;
  foundCourse: boolean = false;
  showDetail: boolean = false;
  selectedAttendanceId: String;
  serverData: JSON;
  employeeData: JSON;

  constructor(
    private authService: AuthService,
    private router:Router,
    private afDb: AngularFireDatabase,
    private dataService: DataService,
    private fb:FormBuilder,
    private toastr: ToastrService,
    private feedbackService: FeedbackService,
    private httpClient: HttpClient
  ){
    this.item = afDb.object(`users/${this.authService.authInfo$.value.$uid}/profile`).valueChanges();
    this.form = this.fb.group({
      comment: ['',Validators.required]
    });
  }

  ngOnInit() {
    this.getAllEmployees();
    this.studentCourse = [];
    this.item.subscribe(item => { 
      this.dataService.fetchData()
      .subscribe(data => {
        this.userTemp = Object.keys(data);
        for(var i=0; i<this.userTemp.length; i++){
          if(data[this.userTemp[i]].course == undefined || data[this.userTemp[i]].course == null ){
            continue;
          }
          this.courseTemp = Object.keys(data[this.userTemp[i]].course);
          for(var j=0; j<this.courseTemp.length; j++){
            //console.log(data[this.userTemp[i]].course[this.courseTemp[j]].students)
            this.stdTemp = Object.keys(data[this.userTemp[i]].course[this.courseTemp[j]].students);
            let countStudent = this.stdTemp.length;
            for(var k=0; k<this.stdTemp.length; k++){
              let stdIdFetch = data[this.userTemp[i]].course[this.courseTemp[j]].students[this.stdTemp[k]];
              //console.log(data[this.userTemp[i]].course[this.courseTemp[j]].schedule.attendance)
              if(String(item.stdId) == String(stdIdFetch.id)){
                this.foundCourse = true;
                this.attendanceKey = Object.keys(stdIdFetch.attendance);
                //console.log(this.attendanceKey);
                this.courseDate = Object.keys(data[this.userTemp[i]].course[this.courseTemp[j]].schedule.attendance);
                  this.studentCourse.push({
                    cId: data[this.userTemp[i]].course[this.courseTemp[j]].id,
                    cName: data[this.userTemp[i]].course[this.courseTemp[j]].name,
                    cGroup: data[this.userTemp[i]].course[this.courseTemp[j]].groupNo,
                    cTeacher: String(data[this.userTemp[i]].profile.firstName + ' ' +data[this.userTemp[i]].profile.lastName),
                    isClick: false,   //แสดงวันที่
                    isClick2: false,  //แสดง Rating
                    isClick3: false,  //แสดงกล่อง comment + ปุ่ม
                    attendance: data[this.userTemp[i]].course[this.courseTemp[j]].students[this.stdTemp[k]].attendance,
                    //[""0""].couseAttendance.schedule.attendance[""2018-08-09-08-02-26""]
                    //[1].couseAttendance.schedule.attendance[""2018-07-08-13-00-43""]
                    couseAttendance: data[this.userTemp[i]].course[this.courseTemp[j]].schedule,
                    selectedAttendance: String('เลือกวันที่'),
                  })
                console.log(this.studentCourse);
              }
            }
          }
        }
      });
    });
  }

  ayHi() {
    this.httpClient.get('http://127.0.0.1:5002/').subscribe(data => {
      this.serverData = data as JSON;
      console.log(this.serverData);
    })
  }

  getAllEmployees() {
    this.httpClient.get('http://127.0.0.1:5002/employees').subscribe(data => {
      this.employeeData = data as JSON;
      console.log(this.employeeData);
    })
  }

  signout(){
    console.log('out')
    this.authService.logout();
  }

  pushPageManual(){
    this.router.navigate(['/manual']);
    //this.showDetail = !this.showDetail;
  }

  selectedCourse(item){
    this.stdFeedback = {};
    item.isClick = !item.isClick;
    for(var i=0; i<this.studentCourse.length; i++){
      if(this.studentCourse[i] == item){
        console.log('คลิกตัวเอง')
        this.itemFeedback = this.afDb.object(`users/${this.authService.authInfo$.value.$uid}/feedback/${item.cId}`).valueChanges();
        this.itemFeedback.subscribe(feedback => {
          if(feedback == undefined){
            return false
          }
          this.stdFeedback = feedback;
          console.log(this.stdFeedback)
        })
      }else{
        console.log('ปิดอันอื่น')
        this.studentCourse[i].isClick = false;
        this.studentCourse[i].isClick2 = false;
        this.studentCourse[i].isClick3 = false;
        this.studentCourse[i].selectedAttendance = String('เลือกวันที่');
        this.resetImg();
      }
    }
    console.log(item)
  }

  onClickSelectedAttendance(item, attDate, key){
    var dateTemp = moment(attDate).format("DD/MM/YYYY"); 
    item.selectedAttendance = dateTemp;
    this.selectedAttendanceId = key;
    item.isClick2 = !item.isClick2;
  }

  onClickSave(courseId){
    const attendanceId = this.selectedAttendanceId;
    console.log(attendanceId);
    if(this.ratingNo == undefined || this.ratingNo == null){
      this.toastr.warning('กรุณาเลือก Rating');
      return false;
    }
    console.log(this.ratingNo);
    console.log(this.form.value.comment);
    console.log(attendanceId)
    this.feedbackService.insertFeedback(attendanceId,courseId,this.ratingNo, this.form.value.comment);
    this.toastr.success('บันทึกการประเมินสำเร็จ');
  }

  ////////////////////////////////////////////////////////////////

  onMouseOver(rate){
    if(rate == 1){
      this.imgSrc1 = "assets/images/emotions/1-2.png";
    }else if(rate == 2){
      this.imgSrc2 = "assets/images/emotions/2-2.png";
    }else if(rate == 3){
      this.imgSrc3 = "assets/images/emotions/3-2.png";
    }else if(rate == 4){
      this.imgSrc4 = "assets/images/emotions/4-2.png";
    }else if(rate == 5){
      this.imgSrc5 = "assets/images/emotions/5-2.png";
    }
  }
  onMouseOut(rate){
    if(rate == 1){
      this.imgSrc1 = "assets/images/emotions/1-1.png";
    }else if(rate == 2){
      this.imgSrc2 = "assets/images/emotions/2-1.png";
    }else if(rate == 3){
      this.imgSrc3 = "assets/images/emotions/3-1.png";
    }else if(rate == 4){
      this.imgSrc4 = "assets/images/emotions/4-1.png";
    }else if(rate == 5){
      this.imgSrc5 = "assets/images/emotions/5-1.png";
    }
  }
  onMouseClickRate(rate,item){
    console.log(rate)
    item.isClick3 = true;
    this.ratingNo = rate;
    if(rate == 1){
      this.imgSrc1 = "assets/images/emotions/1-2.png";
      this.imgSrc2 = "assets/images/emotions/2-1.png";
      this.imgSrc3 = "assets/images/emotions/3-1.png";
      this.imgSrc4 = "assets/images/emotions/4-1.png";
      this.imgSrc5 = "assets/images/emotions/5-1.png";
    }else if(rate == 2){
      this.imgSrc1 = "assets/images/emotions/1-1.png";
      this.imgSrc2 = "assets/images/emotions/2-2.png";
      this.imgSrc3 = "assets/images/emotions/3-1.png";
      this.imgSrc4 = "assets/images/emotions/4-1.png";
      this.imgSrc5 = "assets/images/emotions/5-1.png";
    }else if(rate == 3){
      this.imgSrc1 = "assets/images/emotions/1-1.png";
      this.imgSrc2 = "assets/images/emotions/2-1.png";
      this.imgSrc3 = "assets/images/emotions/3-2.png";
      this.imgSrc4 = "assets/images/emotions/4-1.png";
      this.imgSrc5 = "assets/images/emotions/5-1.png";
    }else if(rate == 4){
      this.imgSrc1 = "assets/images/emotions/1-1.png";
      this.imgSrc2 = "assets/images/emotions/2-1.png";
      this.imgSrc3 = "assets/images/emotions/3-1.png";
      this.imgSrc4 = "assets/images/emotions/4-2.png";
      this.imgSrc5 = "assets/images/emotions/5-1.png";
    }else if(rate == 5){
      this.imgSrc1 = "assets/images/emotions/1-1.png";
      this.imgSrc2 = "assets/images/emotions/2-1.png";
      this.imgSrc3 = "assets/images/emotions/3-1.png";
      this.imgSrc4 = "assets/images/emotions/4-1.png";
      this.imgSrc5 = "assets/images/emotions/5-2.png";
    }
  }

  resetImg(){
    this.imgSrc1 = "assets/images/emotions/1-1.png";
    this.imgSrc2 = "assets/images/emotions/2-1.png";
    this.imgSrc3 = "assets/images/emotions/3-1.png";
    this.imgSrc4 = "assets/images/emotions/4-1.png";
    this.imgSrc5 = "assets/images/emotions/5-1.png";
  }
  //-------------------------------------------------

  

}
