import { Routes } from '@angular/router';
import {RegisterComponent} from './pages/register/register.component';
import {AppComponent} from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { StudentListComponent } from './pages/students/students-list/students-list.component';
import { StudentFormComponent } from './pages/students/student-form/student-form.component';
import { StudentDetailsComponent } from './pages/students/student-details/student-details.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'students',
    component: StudentListComponent 
  },
  { path: 'students/new',
    component: StudentFormComponent 
  },
  { path: 'students/:id/edit',
    component: StudentFormComponent 
  },
  { path: 'students/:id',
    component: StudentDetailsComponent 
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
