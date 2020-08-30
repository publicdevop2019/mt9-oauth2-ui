import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableBooleanComponent } from './editable-boolean.component';

describe('EditableBooleanComponent', () => {
  let component: EditableBooleanComponent;
  let fixture: ComponentFixture<EditableBooleanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditableBooleanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableBooleanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
