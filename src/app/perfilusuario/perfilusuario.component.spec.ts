import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PerfilusuarioComponent } from './perfilusuario.component';

describe('PerfilusuarioComponent', () => {
  let component: PerfilusuarioComponent;
  let fixture: ComponentFixture<PerfilusuarioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PerfilusuarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilusuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
