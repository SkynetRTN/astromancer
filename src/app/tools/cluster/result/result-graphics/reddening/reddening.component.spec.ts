import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReddeningComponent} from './reddening.component';

describe('ReddeningComponent', () => {
    let component: ReddeningComponent;
    let fixture: ComponentFixture<ReddeningComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ReddeningComponent]
        });
        fixture = TestBed.createComponent(ReddeningComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
