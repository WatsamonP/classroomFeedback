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

  constructor(private authService: AuthService,private afDb: AngularFireDatabase,private router: Router,){
    this.item = afDb.object(`users/${this.authService.authInfo$.value.$uid}/profile`).valueChanges();
  }

  ngOnInit(){}

  signout(){
    console.log('out')
    this.authService.logout();
  }

  pushPageManual() {
    this.router.navigate(['/manual']);
    //this.showDetail = !this.showDetail;
  }

  pushPageScore() {
    this.router.navigate(['/score']);
    //this.showDetail = !this.showDetail;
  }

  pushDashboard() {
    this.router.navigate(['/']);
    //this.showDetail = !this.showDetail;
  }


}
