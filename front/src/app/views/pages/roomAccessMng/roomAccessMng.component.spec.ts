import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomAccessMngComponent } from './roomAccessMng.component';

describe('RoomAccessMngComponent', () => {
  let component: RoomAccessMngComponent;
  let fixture: ComponentFixture<RoomAccessMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomAccessMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomAccessMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
