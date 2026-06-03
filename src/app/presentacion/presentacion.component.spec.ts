import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PresentacionComponent } from './presentacion.component';

describe('PresentacionComponent', () => {
  let component: PresentacionComponent;
  let fixture: ComponentFixture<PresentacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PresentacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PresentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
