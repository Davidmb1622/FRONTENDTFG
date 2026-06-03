import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CarritopaginaComponent } from './carritopagina.component';

describe('CarritopaginaComponent', () => {
  let component: CarritopaginaComponent;
  let fixture: ComponentFixture<CarritopaginaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CarritopaginaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarritopaginaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
