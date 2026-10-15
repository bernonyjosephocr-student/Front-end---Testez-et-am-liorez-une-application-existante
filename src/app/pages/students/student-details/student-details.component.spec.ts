import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { StudentDetailsComponent } from './student-details.component';

describe('StudentDetailsComponent', () => {
  let component: StudentDetailsComponent;
  let fixture: ComponentFixture<StudentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDetailsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { // Route configuration for testing, providing a mock ActivatedRoute with a paramMap and params observable
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' })),
            params: of({ id: '1' }),
            snapshot: {
              //observable paramMap and params are used in the component, so we need to provide them as observables
              paramMap: convertToParamMap({ id: '1' }),
              params: { id: '1' }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});