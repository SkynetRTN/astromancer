import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CmdFsrComponent} from './cmd-fsr.component';

describe('CmdFsrComponent', () => {
  let component: CmdFsrComponent;
  let fixture: ComponentFixture<CmdFsrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CmdFsrComponent]
    });
    fixture = TestBed.createComponent(CmdFsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
