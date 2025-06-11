import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContriesReachedComponent } from './contries-reached.component';

describe('ContriesReachedComponent', () => {
  let component: ContriesReachedComponent;
  let fixture: ComponentFixture<ContriesReachedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContriesReachedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContriesReachedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
