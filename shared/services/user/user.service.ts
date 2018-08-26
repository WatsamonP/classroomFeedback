import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AuthService } from "../auth.service";

@Injectable()
export class UserService {

  //selectedUser: User = new User();
  userList: AngularFireObject<any>;
  currentUserId : string;

  constructor(private db: AngularFireDatabase, private authService: AuthService){ }

  setCurrentUserId(currentUserId : string){
    this.currentUserId = currentUserId;
  }
  

  getUserList(){
    this.userList = this.db.object(`users/${this.authService.authInfo$.value.$uid}/profile`);
    return this.userList;
  }

  insertUser(user : any){
    this.getUserList().set({
      email: user.email,
      firstName : user.firstName,
      lastName : user.lastName,
      stdId : user.stdId
    });
  }

  updateUser(user : any){
    this.getUserList().update({
      email: user.email,
      firstName : user.firstName,
      lastName : user.lastName,
      stdId : user.stdId
    });
  }

  deleteUser(uid : string){
    this.getUserList().remove();
  }

}
