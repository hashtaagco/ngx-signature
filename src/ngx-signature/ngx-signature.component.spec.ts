import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSignatureComponent } from './ngx-signature.component';

describe('NgxSignatureComponent', () => {
  let component: NgxSignatureComponent;
  let fixture: ComponentFixture<NgxSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
