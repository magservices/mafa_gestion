import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayementPageComponent } from './payement-page.component';

describe('PayementPageComponent', () => {
  let component: PayementPageComponent;
  let fixture: ComponentFixture<PayementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayementPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
