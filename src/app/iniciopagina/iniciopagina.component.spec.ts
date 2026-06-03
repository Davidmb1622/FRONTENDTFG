import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IniciopaginaComponent } from './iniciopagina.component';

describe('IniciopaginaComponent', () => {
  let component: IniciopaginaComponent;
  let fixture: ComponentFixture<IniciopaginaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IniciopaginaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IniciopaginaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
