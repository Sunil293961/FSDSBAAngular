import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddProjectComponent } from './customComponents/add-project/add-project.component';
import { AddTaskComponent } from './customComponents/add-task/add-task.component';
import { AddUserComponent } from './customComponents/add-user/add-user.component';
import { ViewTaskComponent } from './customComponents/view-task/view-task.component';
import { HeaderComponentComponent } from './sharedComponents/header-component/header-component.component';
import { FooterComponentComponent } from './sharedComponents/footer-component/footer-component.component';
import { HomeComponentComponent } from './customComponents/home-component/home-component.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AngularMaterial } from './sharedComponents/AMaterial/angular-material';
import { DatePipe } from '@angular/common';
import { UserDialogComponent } from './customComponents/user-dialog/user-dialog.component';
import { from } from 'rxjs';
import { MatSelectSearchModule } from './mat-select-search/mat-select-search.module';

@NgModule({
  declarations: [
    AppComponent,
    AddProjectComponent,
    AddTaskComponent,
    AddUserComponent,
    ViewTaskComponent,
    HeaderComponentComponent,
    FooterComponentComponent,
    HomeComponentComponent,
    UserDialogComponent,
],
  imports: [
    BrowserAnimationsModule,
    MatTabsModule,
    MatInputModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatIconModule,
    AngularMaterial,
    MatSelectSearchModule
  ],
  exports: [
    MatSelectSearchModule
  ],
  providers: [DatePipe],
  entryComponents: [
    UserDialogComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {


}
