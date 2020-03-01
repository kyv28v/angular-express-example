import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMngComponent } from './userMng.component';

describe('UserMngComponent', () => {
  let component: UserMngComponent;
  let fixture: ComponentFixture<UserMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
