import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryCategoryComponent } from './summary-category.component';

describe('SummaryCategoryComponent', () => {
  let component: SummaryCategoryComponent;
  let fixture: ComponentFixture<SummaryCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
