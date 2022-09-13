import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatelinkComponent } from './createlink.component';

describe('CreatelinkComponent', () => {
  let component: CreatelinkComponent;
  let fixture: ComponentFixture<CreatelinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatelinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatelinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
