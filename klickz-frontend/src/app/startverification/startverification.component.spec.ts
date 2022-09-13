import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartverificationComponent } from './startverification.component';

describe('StartverificationComponent', () => {
  let component: StartverificationComponent;
  let fixture: ComponentFixture<StartverificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartverificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartverificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
