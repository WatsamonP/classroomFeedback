import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AuthService } from "../auth.service";

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private db: AngularFireDatabase, private authService: AuthService){}

  insertFeedback(AttendanceId,courseId,rating, comment){
    if(comment == undefined || comment == '' || comment == null){
      comment = '';
    }
    this.db.object(`users/${this.authService.authInfo$.value.$uid}/feedback/${courseId}/${AttendanceId}`).update({
      AttendanceId: AttendanceId,
      comment: comment,
      rating: rating,
      date: Date(),
      isFeedback: true
    });
  }
  
}
