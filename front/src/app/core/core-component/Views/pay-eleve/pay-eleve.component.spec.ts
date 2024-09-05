import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayEleveComponent } from './pay-eleve.component';

describe('PayEleveComponent', () => {
  let component: PayEleveComponent;
  let fixture: ComponentFixture<PayEleveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayEleveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayEleveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
