import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTextComponent } from './upload-text.component';

describe('UploadTextComponent', () => {
  let component: UploadTextComponent;
  let fixture: ComponentFixture<UploadTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("should call alert", () => {
    spyOn(window, "alert");
    
    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.whenStable().then( () => {
      expect(window.alert).toHaveBeenCalledWith("");
    })
    
  })

  it('should upload text', () => {
    expect(component.uploadText).toBeTruthy();
  });
});
