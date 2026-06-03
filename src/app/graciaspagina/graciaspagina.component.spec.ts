import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GraciaspaginaComponent } from './graciaspagina.component';

describe('GraciaspaginaComponent', () => {
  let component: GraciaspaginaComponent;
  let fixture: ComponentFixture<GraciaspaginaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [GraciaspaginaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GraciaspaginaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
