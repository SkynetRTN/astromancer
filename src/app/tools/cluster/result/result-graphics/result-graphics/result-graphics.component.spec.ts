import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResultGraphicsComponent} from './result-graphics.component';

describe('ResultGraphicsComponent', () => {
    let component: ResultGraphicsComponent;
    let fixture: ComponentFixture<ResultGraphicsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ResultGraphicsComponent]
        });
        fixture = TestBed.createComponent(ResultGraphicsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
