import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { AuthService } from "../shared/services/auth.service";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons, NgbAlert, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  @ViewChild('socialLogin')
  private socialLogin: TemplateRef<any>;

  form: FormGroup;
  signUpForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,

  ) {
    let emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-z]{2,4}$";
    this.form = this.fb.group({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(emailPattern)
      ]),
      password: new FormControl(null, [
        Validators.required
      ]),
    });
  }

  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }

  ngOnInit() {
  }

  login() {
    if (this.form.invalid) {
      console.log("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const val = this.form.value;
    this.authService.emailLogin(val.email, val.password);
    localStorage.setItem('isLoggedin', 'true');
  }

  onClickFacebook() {
    this.authService.facebookLogin();
  }

  onClickGoogle() {
    this.authService.googleLogin();
  }

  signupClick() {
    this.router.navigate(['/signup']);
  }

  onClickQrCode() {
    this.router.navigate(['/qrcode']);
  }

  public open(content) {
    this.modalService.open(content, { centered: true });
  }

  forgotPassword(){
    console.log(this.form.value.email);
    if(this.form.value.email == undefined || this.form.value.email == '' || this.form.value.email == null ){
      this.toastr.warning("กรุณากรอก Email");
    }else{
      this.authService.resetPassword(this.form.value.email);    
    }
  }

}
