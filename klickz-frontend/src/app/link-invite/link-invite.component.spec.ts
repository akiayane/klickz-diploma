import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkInviteComponent } from './link-invite.component';

describe('LinkInviteComponent', () => {
  let component: LinkInviteComponent;
  let fixture: ComponentFixture<LinkInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkInviteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
