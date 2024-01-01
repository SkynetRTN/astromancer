import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HrdResultComponent} from './hrd-result.component';

describe('HrdResultComponent', () => {
    let component: HrdResultComponent;
    let fixture: ComponentFixture<HrdResultComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [HrdResultComponent]
        });
        fixture = TestBed.createComponent(HrdResultComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
