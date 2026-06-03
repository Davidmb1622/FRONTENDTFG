import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductodetalleComponent } from './productodetalle.component';

describe('ProductodetalleComponent', () => {
  let component: ProductodetalleComponent;
  let fixture: ComponentFixture<ProductodetalleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ProductodetalleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductodetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
