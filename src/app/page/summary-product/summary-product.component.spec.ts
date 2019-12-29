import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryProductComponent } from './summary-product.component';

describe('SummaryProductComponent', () => {
  let component: SummaryProductComponent;
  let fixture: ComponentFixture<SummaryProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
