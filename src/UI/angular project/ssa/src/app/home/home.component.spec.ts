import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("testing html elements", ()=>{
    const data = fixture.nativeElement;
    expect(data.querySelector(".title").textContent).toContain("Structured Sentiment Analysis");
  })
  // it('should', fakeAsync( () => {
  //   spyOn(component, 'onEditButtonClick'); 
  // }))
});