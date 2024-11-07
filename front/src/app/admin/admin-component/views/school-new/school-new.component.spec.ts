import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolNewComponent } from './school-new.component';

describe('SchoolNewComponent', () => {
  let component: SchoolNewComponent;
  let fixture: ComponentFixture<SchoolNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
