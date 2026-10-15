import { Routes } from '@angular/router';
import {RegisterComponent} from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { StudentListComponent } from './pages/students/students-list/students-list.component';
import { StudentFormComponent } from './pages/students/student-form/student-form.component';
import { StudentDetailsComponent } from './pages/students/student-details/student-details.component';
import { authGuard } from './core/guards/auth.guard';

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
    component: StudentListComponent,
    canActivate: [authGuard]
  },
  { path: 'students/new',
    component: StudentFormComponent,
    canActivate: [authGuard]
  },
  { path: 'students/:id/edit',
    component: StudentFormComponent,
    canActivate: [authGuard]
  },
  { path: 'students/:id',
    component: StudentDetailsComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
