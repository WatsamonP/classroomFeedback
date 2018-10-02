import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from "../shared/services/auth.service";
import { ToastrService } from 'ngx-toastr';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Router } from "@angular/router";

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit {
  qrcode = "https://chart.googleapis.com/chart?cht=qr&chl=Hello+World&chs=220x220&chld=L|0";
  uForm: FormGroup;
  isSubmit = null;
  docDefinition = {
    content: [],
    defaultStyle: { alignment: 'justify' },
    pageSize: 'A4',
    anotherStyle: { italics: true, alignment: 'centered' }
  };
  authUid: String = null;

  constructor(private toastr: ToastrService, private authService: AuthService, private router: Router) { 
   if(this.authService.authenticated){
    this.authUid = this.authService.currentUserId;
   }else{
    this.authUid = null;
   }
  }

  ngOnInit() {
    this.uForm = new FormGroup({
      content: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[B|M|D]\\d{7}$")
      ])
    });
  }

  get content() {
    return this.uForm.get('content');
  }

  onClickBack(){
    this.router.navigate(['/dashboard']);
  }

  onGen() {
    this.isSubmit = true;
    if (this.uForm.invalid) {
      return;
    }
    this.qrcode = "https://chart.googleapis.com/chart?cht=qr&chl=" + this.uForm.value.content + "&chs=220x220&chld=L|0";
    console.log(this.qrcode);

  }

  onDownload() {
    this.isSubmit = true;
    if (this.uForm.invalid) {
      return;
    }
    this.qrcode = "https://chart.googleapis.com/chart?cht=qr&chl=" + this.uForm.value.content + "&chs=220x220&chld=L|0";
    console.log(this.qrcode);
    this.docDefinition.content = [
      {
        style: 'tableExample',
        color: 'black',   // font color
        table: {
          heights: ['auto', 'auto', 'auto', 'auto', 'auto', 650],
          widths: ['60%', '20%', '20%'],
          body: [
            [{ border: [true, true, true, false], text: '' },
            { border: [true, true, true, true], rowSpan: 5, text: 'POINT', bold: true, alignment: 'center' },
            { border: [true, true, true, false], rowSpan: 4, qr: this.uForm.value.content, fit: 85, alignment: 'center' }],
            [{ border: [true, false, true, false], text: '' }, '', ''],
            [{ border: [true, false, true, false], text: '' }, '', ''],
            [{ border: [true, false, true, true], rowSpan: 2, text: '' }, '',],
            ['', '', { border: [true, false, true, true], text: this.uForm.value.content, alignment: 'center' }],
            [{ border: [true, true, true, true], colSpan: 3, text: ' ' }]
          ]
        },
        layout: {
          defaultBorder: false,
        }
      }
    ]
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(this.docDefinition).download('QR_' + this.uForm.value.content + '.pdf');
    //pdfMake.createPdf(this.docDefinition).download();
    this.toastr.success("ดาวน์โหลด " + 'QR_' + this.uForm.value.content + '.pdf');
  }

}
