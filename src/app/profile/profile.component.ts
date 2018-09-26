import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from "../shared/services/auth.service";
import { UserService } from "../shared/services/user/user.service";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {
    
    var str = this.authService.currentUserDisplayName;
    var stringArray = str.split(' ');
    let fName = stringArray[0];
    let lName = stringArray[1];
    let emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

    if(fName == " " || fName == ""){
      fName = null
    }
    if(lName == " " || lName == ""){
      lName = null
    }

    this.form = this.fb.group({
      email: new FormControl(this.authService.currentUserEmail, [
        Validators.required,
        Validators.pattern(emailPattern)
      ]),
      stdId: new FormControl(null, [
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

  ngOnInit() {
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
