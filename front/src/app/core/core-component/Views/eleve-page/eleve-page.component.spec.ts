import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElevePageComponent } from './eleve-page.component';

describe('ElevePageComponent', () => {
  let component: ElevePageComponent;
  let fixture: ComponentFixture<ElevePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElevePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElevePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
