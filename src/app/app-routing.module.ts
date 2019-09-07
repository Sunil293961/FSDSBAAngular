import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddProjectComponent } from './customComponents/add-project/add-project.component';
import { AddTaskComponent } from './customComponents/add-task/add-task.component';
import { ViewTaskComponent } from './customComponents/view-task/view-task.component';
import { AppComponent } from './app.component';
import { HomeComponentComponent } from './customComponents/home-component/home-component.component';
import { AddUserComponent } from './customComponents/add-user/add-user.component';

const routes: Routes = [
  // add routing details here..
  { path: 'add-project', component: AddProjectComponent },
  { path: 'add-task', component: AddTaskComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'editTask/:id', component: AddTaskComponent },
  { path: 'view-task', component: ViewTaskComponent },
  { path: '', redirectTo: '/add-user', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
