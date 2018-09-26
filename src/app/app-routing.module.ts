import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guard/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { ScoreComponent } from './score/score.component';
import { ManualComponent } from './manual/manual.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { FeedbackComponent } from './feedback/feedback.component'
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'feedback/:id', component: FeedbackComponent, canActivate: [AuthGuard]},
  { path: 'score/:id', component: ScoreComponent, canActivate: [AuthGuard]},
  { path: 'manual', component: ManualComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'signin', component: SigninComponent},
  { path: 'qrcode', component: QrCodeComponent},
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
