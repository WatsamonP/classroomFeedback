import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  item: Observable<any>;
  authUid: String;
  authState: boolean;

  constructor(private authService: AuthService,private afDb: AngularFireDatabase,private router: Router){
    this.authUid = this.authService.currentUserId;
    this.authState = this.authService.authState;

    this.item = afDb.object(`users/${this.authUid}/profile`).valueChanges();
  }

  ngOnInit(){}

  signout(){
    //console.log('out')
    this.authService.signOut();
  }

  qrcode

  pushPage(path) {
    //console.log(this.authState)
    this.router.navigate(['/'+path]);
    //this.showDetail = !this.showDetail;
  }

  updateProfile(){
    this.router.navigate(['/profile'])
  }

}
