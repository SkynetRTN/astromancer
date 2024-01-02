import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MetallicityComponent} from './metallicity.component';

describe('MetallicityComponent', () => {
    let component: MetallicityComponent;
    let fixture: ComponentFixture<MetallicityComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MetallicityComponent]
        });
        fixture = TestBed.createComponent(MetallicityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
