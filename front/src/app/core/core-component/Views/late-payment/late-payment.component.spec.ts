import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatePaymentComponent } from './late-payment.component';

describe('LatePaymentComponent', () => {
  let component: LatePaymentComponent;
  let fixture: ComponentFixture<LatePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatePaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
