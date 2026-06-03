import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaginaeventosComponent } from './paginaeventos.component';

describe('PaginaeventosComponent', () => {
  let component: PaginaeventosComponent;
  let fixture: ComponentFixture<PaginaeventosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PaginaeventosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaeventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
