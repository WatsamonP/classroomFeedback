import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from "../shared/services/auth.service";
import { UserService } from "../shared/services/user/user.service";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {

  form: FormGroup;
  authUid: String;

  constructor(
    private _afDb: AngularFireDatabase,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.authUid = this.authService.currentUserId;
    let stdId,fName,lName;
    this._afDb.object(`users/${this.authUid}/profile`).valueChanges().subscribe(res => {
      let ob: any = res;
      stdId = ob.stdId;
      fName = ob.firstName;
      lName = ob.lastName;

      this.buildForm(stdId,fName,lName)
    })

    
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: new FormControl(),
      stdId: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl()
    });
  }

  buildForm(stdId,fName,lName){
    let emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-z]{2,4}$";

    this.form = this.fb.group({
      email: new FormControl(this.authService.currentUserEmail, [
        Validators.required,
        Validators.pattern(emailPattern)
      ]),
      stdId: new FormControl(stdId, [
        Validators.required,
        Validators.pattern("[B|M|D]\\d{7}")
      ]),
      firstName: new FormControl(fName, [
        Validators.required
      ]),
      lastName: new FormControl(lName, [
        Validators.required
      ])
    });
  }

  public updateProfile() {
    this.authService.updateUser(this.form.value);
    this.router.navigate(['/'])
  }

  get email() {
    return this.form.get('email');
  }
  get firstName() {
    return this.form.get('firstName');
  }
  get lastName() {
    return this.form.get('lastName');
  }
  get stdId() {
    return this.form.get('stdId');
  }

}
