import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { AuthService } from "../shared/services/auth.service";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  
  form:FormGroup;

  constructor(
    private fb:FormBuilder, 
    private authService: AuthService,
    private router:Router,
    private toastr: ToastrService
  ){
    this.form = this.fb.group({
      email: ['',Validators.required],
      password: ['',Validators.required]
  });
  }

  ngOnInit() {
  }

  login() {
    if(this.form.invalid) {
      console.log("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const formValue = this.form.value;
    this.authService.login(formValue.email, formValue.password)
      .subscribe(() => {
        this.toastr.success(formValue.email+' เข้าสู่ระบบสำเร็จ'),
        this.router.navigate(['/'])
      },
        err => this.toastr.error(err)
      );
  }

  signupClick(){
    this.router.navigate(['/signup']);
  }

  onClickQrCode(){
    this.router.navigate(['/qrcode']);
  }

}
