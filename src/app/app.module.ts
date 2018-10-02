import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { Http, HttpModule} from '@angular/http'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
//
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { DashboardComponent } from './dashboard/dashboard.component';

//firebase
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';
// Shared
import { AuthGuard } from './shared/guard/auth.guard';
import { AuthService } from './shared/services/auth.service';
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireAuthModule } from "angularfire2/auth";
import { UserService } from './shared/services/user/user.service';
import { HeaderComponent } from './header/header.component';
import { ManualComponent } from './manual/manual.component';
import { LayoutComponent } from './layout/layout.component';
import { ScoreComponent } from './score/score.component';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { CourseService } from './shared/services/course/course.service'
import { MessageService } from './shared/services/messageService'
import { DataService } from './shared/services/data/data.service'
import { ReactionService } from './shared/services/reaction/reaction.service';
import { ProfileComponent } from './profile/profile.component'
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    SignupComponent,
    SigninComponent,
    DashboardComponent,
    HeaderComponent,
    ManualComponent,
    LayoutComponent,
    ScoreComponent,
    QrCodeComponent,
    FeedbackComponent,
    ProfileComponent,
    UpdateProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.feedback),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    HttpClientModule,
    HttpModule,
    NgbModule.forRoot(),
    NgbDropdownModule.forRoot(),
  ],
  providers: [AuthService, AuthGuard, UserService, AngularFireDatabase, CourseService, DataService,ReactionService, NgbRatingConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }
