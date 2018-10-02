import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.scss']
})
export class ManualComponent implements OnInit {
  authUid: String = null;
  isCheckScore: boolean = false;
  isFeedback: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    if(this.authService.authenticated){
      this.authUid = this.authService.currentUserId;
     }else{
      this.authUid = null;
     }
  }

  ngOnInit() {
  }

  onClickBack(){
    this.router.navigate(['/dashboard']);
  }

  public onClickCheckScore(){
    this.isCheckScore = !this.isCheckScore;
    this.isFeedback = false;
  }

  public onClickFeedback(){
    this.isFeedback = !this.isFeedback;
    this.isCheckScore = false;
  }

}
