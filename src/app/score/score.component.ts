import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ReactionService } from '../shared/services/reaction/reaction.service';
import * as _ from "lodash";
import { MessageService } from '../shared/services/messageService';
import { Router, ParamMap, ActivatedRoute, } from '@angular/router';
import { CourseService } from "../shared/services/course/course.service";
import { DataService } from "../shared/services/data/data.service";
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from "../shared/services/auth.service";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {

  item: any;
  courseParam: String;
  objectKeys = Object.keys;
  scoreList: any;

  @Input() itemId: string;
  subscription: any;
  isError: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _courseService: CourseService,
    private data: DataService,
    private router: Router,
    private afDb: AngularFireDatabase,
    private authService: AuthService,
    private fb: FormBuilder,
    private reactionSvc: ReactionService,
    private toastr: ToastrService,
  ) {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.courseParam = params.get('id');
      this.data.currentMessage.subscribe(message => {
        this.item = message
      })
      if (this.item == 'default message')
        this.router.navigate(['/']);

      this.subscription = this.reactionSvc.getReactions(this.itemId)
        .valueChanges()
        .subscribe(reactions => { })
        
    })
  }

  ngOnInit() {
    let key = Object.keys(this.item.student);
    this.scoreList = [];
    let eventKey;
    let tempObj = {}
    let eventName;
    let warning;
    for (var i = 0; i < key.length; i++) {
      eventKey = String(key[i]);
      if (eventKey !== 'id' && eventKey !== 'name' && eventKey !== 'group') {
        let dateKey = Object.keys(this.item.student[eventKey])
        let sum = 0;
        let total = 0;
        let percent = 0;
        for (var j = 0; j < dateKey.length; j++) {
          sum = sum + this.item.student[eventKey][String(dateKey[j])].score;
          console.log(this.item.student[eventKey][String(dateKey[j])].score)
          
          // find totalScore
          if (eventKey == 'attendance') {
            total = Object.keys(this.item.student.attendance).length;
          } else {
            total = Number(total) + Number(this.item.course.schedule[eventKey][String(dateKey[j])].totalScore)
            console.log()
          }

          //find Percentage
          if(this.item.course.eventList == undefined){
            eventName = eventKey;
            percent = 0;
          }else{
            eventName = this.item.course.eventList[eventKey].name;
            let percentKey = String('percent' + this.item.course.eventList[eventKey].name);
            percent = Number(this.item.course[percentKey]);
          }
          
        }

        tempObj = {
          key: eventName,
          sumScore: sum,
          totalScore: total,
          percentage: percent,
          studentPercent: (sum*percent/total),
        }
        this.scoreList.push(tempObj)
      }
    }
    console.log(this.scoreList)

  }


}
