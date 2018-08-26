import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  item: Observable<any>;

  constructor(private authService: AuthService,private afDb: AngularFireDatabase){
    this.item = afDb.object(`users/${this.authService.authInfo$.value.$uid}/profile`).valueChanges();
  }

  ngOnInit(){}

  signout(){
    console.log('out')
    this.authService.logout();
  }

}
