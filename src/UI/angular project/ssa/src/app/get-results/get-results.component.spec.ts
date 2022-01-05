import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetResultsComponent } from './get-results.component';

describe('GetResultsComponent', () => {
  let component: GetResultsComponent;
  let fixture: ComponentFixture<GetResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
