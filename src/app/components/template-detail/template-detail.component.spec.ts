import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDetailComponent } from './template-detail.component';

describe('TemplateDetailComponent', () => {
  let component: TemplateDetailComponent;
  let fixture: ComponentFixture<TemplateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
