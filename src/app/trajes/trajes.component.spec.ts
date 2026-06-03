import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrajesComponent } from './trajes.component';

describe('TrajesComponent', () => {
  let component: TrajesComponent;
  let fixture: ComponentFixture<TrajesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TrajesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
