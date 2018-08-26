import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  form:FormGroup;

  constructor(
    private fb:FormBuilder, 
    private authService: AuthService,
    private userService: UserService,
    private router:Router,
    private toastr: ToastrService
  ){
    this.form = this.fb.group({
      email: ['',Validators.required],
      password: ['',Validators.required],
      firstName: ['',Validators.required],
      lastName: ['',Validators.required],
      stdId: ['',Validators.required],
  });
  }

  ngOnInit() {}

  signUp() {
    if(this.form.invalid) {
      console.log("กรุณากรอกข้อมูลให้ครบ");
      //this.toastr.error("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    
    const val = this.form.value;

    this.authService.signUp(val.email, val.password)
    .subscribe(
        () => {
          this.userService.insertUser(val),
          alert('User created successfully !');
          this.router.navigateByUrl('/');
        },
        err => alert(err)
    );
  }

  gotoLogin(){
    this.router.navigate(['/signin']);
  }

}