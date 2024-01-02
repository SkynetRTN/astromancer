import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NumberOfStarsComponent} from './number-of-stars.component';

describe('NumberOfStarsComponent', () => {
    let component: NumberOfStarsComponent;
    let fixture: ComponentFixture<NumberOfStarsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [NumberOfStarsComponent]
        });
        fixture = TestBed.createComponent(NumberOfStarsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
