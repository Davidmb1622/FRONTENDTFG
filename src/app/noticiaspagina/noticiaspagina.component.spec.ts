import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NoticiaspaginaComponent } from './noticiaspagina.component';

describe('NoticiaspaginaComponent', () => {
  let component: NoticiaspaginaComponent;
  let fixture: ComponentFixture<NoticiaspaginaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoticiaspaginaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoticiaspaginaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
