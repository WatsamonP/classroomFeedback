import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from "../shared/services/auth.service";
import { UserService } from "../shared/services/user/user.service";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {
    let emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

    this.form = this.fb.group({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-z]{2,4}$")
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25)
      ]),
      stdId: new FormControl(null, [
        Validators.required,
        Validators.pattern("[B|M|D]\\d{7}")
      ]),
      firstName: new FormControl(null, [
        Validators.required
      ]),
      lastName: new FormControl(null, [
        Validators.required
      ])
    });
  }

  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
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

  ngOnInit() { }

  signUp() {
    if (this.form.invalid) {
      console.log("กรุณากรอกข้อมูลให้ครบ");
      //this.toastr.error("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    const val = this.form.value;
    this.authService.emailSignUp(val);
  }

  gotoLogin() {
    this.router.navigate(['/signin']);
  }

}