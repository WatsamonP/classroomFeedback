import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ReactionService } from '../shared/services/reaction/reaction.service';
import * as _ from "lodash";
import { Router, ParamMap, ActivatedRoute, } from '@angular/router';
import { CourseService } from "../shared/services/course/course.service";
import { DataService } from "../shared/services/data/data.service";
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from "../shared/services/auth.service";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  authUid: String;
  item: any;
  courseParam: String;
  objectKeys = Object.keys;
  itemFeedback: any;
  stdFeedback: any;
  feedbackRatingBox: boolean = false
  feedbackCommentBox: boolean = false
  feedbackRating: any;
  feedbackComment: String;
  feedbackForm: FormGroup;
  ///////////////////////////
  @Input() itemId: string;

  showEmojis = false;
  emojiList: string[];

  reactionCount: any;
  userReaction: any;

  subscription: any;
  hoverIndex: Number;
  clickIndex: Number;

  reactFeeling: String
  reactFeelingIndex: Number;
  isReactFeeling: boolean = false
  attendanceSelected: any;
  attendanceSelectedDate: any;
  attendanceSelectedKey: any;
  dateString: String = 'กรุณาเลือกวันที่';
  //currentRate = 0;
  //ratingList: any;
  ratingList = [
    { index: 1, topic: "เอกสารและสื่อประกอบการสอน", currentRate: 0 },
    { index: 2, topic: "ประสิทธิภาพการสอน", currentRate: 0 },
    { index: 3, topic: "ความครบถ้วนของเนื้อหา", currentRate: 0 },
    { index: 4, topic: "คุณภาพของความรู้ที่ได้รับ", currentRate: 0 },
    { index: 5, topic: "ความเป็นครูและการเป็นแบบอย่าง (Role Model)", currentRate: 0 },
  ]

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
    config: NgbRatingConfig
  ) {
    this.authUid = this.authService.currentUserId;
    config.max = 5;
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.courseParam = params.get('id');
      this.data.currentMessage.subscribe(message => {
        this.item = message
      })
      if (this.item == 'default message')
        this.router.navigate(['/']);
      else
        this.itemFeedback = this.afDb.object(`users/${this.authUid}/feedback/${this.courseParam}`).valueChanges();

      this.emojiList = this.reactionSvc.emojiList;

      this.subscription = this.reactionSvc.getReactions(this.itemId)
        .valueChanges()
        .subscribe(reactions => {
          //this.reactionCount = this.reactionSvc.countReactions(reactions)
          //this.userReaction = this.reactionSvc.userReaction(reactions)
        })
    })
  }

  ngOnInit() {
    this.feedbackForm = this.fb.group({
      feedback: new FormControl(null, [
        Validators.required
      ]),
    });

    this.stdFeedback = {};
    this.itemFeedback.subscribe(
      res => {
        if (res == undefined) {
          return false
        }
        this.stdFeedback = res;
        console.log(this.stdFeedback)
      })
  }

  clearContent() {
    this.isReactFeeling = false;
    this.feedbackCommentBox = false
    this.reactFeelingIndex = null;
    this.reactFeeling = null;
    this.feedbackForm.patchValue({ feedback: null })
  }

  // เลือกวันที่
  onClickSelectedAttendance(item, key) {
    this.feedbackRatingBox = true;
    this.attendanceSelected = item;
    this.attendanceSelectedKey = key;
    this.dateString = moment(item.student.attendance[key].date).format("DD/MM/YYYY");
  }

  onClickReactFeel(index) {
    this.isReactFeeling = true; // แสดงบนกล่องว่าเลือก ?
    this.feedbackCommentBox = true;
    this.reactFeelingIndex = index;
    if (index == 0) {
      this.reactFeeling = 'ยากมาก';  // ข้อความ
    } else if (index == 1) {
      this.reactFeeling = 'ยาก';  // ข้อความ
    } else if (index == 2) {
      this.reactFeeling = 'ไม่โอเค';  // ข้อความ
    } else if (index == 3) {
      this.reactFeeling = 'โอเค';  // ข้อความ
    } else if (index == 4) {
      this.reactFeeling = 'ดี';  // ข้อความ
    } else if (index == 5) {
      this.reactFeeling = 'ดีมาก';  // ข้อความ
    } else if (index == 6) {
      this.reactFeeling = 'น่าเบื่อ';  // ข้อความ
    } else if (index == 7) {
      this.reactFeeling = 'ง่วง';  // ข้อความ
    }
  }

  onClickReachFeedback() {
    this.feedbackCommentBox = true;
  }

  onClickSave() {
    if (this.reactFeelingIndex == null) {
      this.toastr.error('กรุณาเลือกความรู้สึก', 'ผิดพลาด')
      return false;
    }
    console.log('รู้สึก ', this.reactFeeling, this.reactFeelingIndex)
    console.log('feedback ', this.feedbackForm.value.feedback)

    this.afDb.object(`users/${this.authUid}/feedback/${this.courseParam}/${this.attendanceSelectedKey}`).update({
      attendanceId: this.attendanceSelectedKey,
      comment: this.feedbackForm.value.feedback,
      rating: this.reactFeelingIndex,
      feeling: this.reactFeeling,
      date: Date(),
      isFeedback: true
    });
    this.toastr.success('บันทึกผลการประเมินแล้ว', 'สำเร็จ')
  }

  toggleShow() {
    this.showEmojis = !this.showEmojis
  }


  emojiPath(emoji) {
    return `assets/reactions/${emoji}.svg`
  }

  emojiPathPng(emoji) {
    return `assets/reactions/${emoji}.png`
  }

  public pushpage(path) {
    console.log(this.item)
    if (path == 'score') {
      this.data.changeMessage(this.item)
      this.router.navigate(['/score', this.item.course.id]);
    } else if (path == 'dashboard') {
      //this.data.changeMessage(this.item)
      this.router.navigate(['/dashboard']);
    }
  }


















  onClickRating(score, item) {

    this.feedbackRating = score;
    this.feedbackCommentBox = true;
  }

  react(val, index) {
    this.clickIndex = val;
    this.feedbackCommentBox = true;
    /*
    if (this.userReaction === val) {
      console.log(this.itemId,'remove')
      this.reactionSvc.removeReaction(this.itemId)
    } else {
      console.log(this.itemId,'update')
      this.reactionSvc.updateReaction(this.itemId, val)
    }*/
  }



  hasReactions(index) {
    return _.get(this.reactionCount, index.toString())
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
