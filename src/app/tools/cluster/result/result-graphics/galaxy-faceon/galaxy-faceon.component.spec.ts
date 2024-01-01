import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GalaxyFaceonComponent} from './galaxy-faceon.component';

describe('GalaxyFaceonComponent', () => {
    let component: GalaxyFaceonComponent;
    let fixture: ComponentFixture<GalaxyFaceonComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [GalaxyFaceonComponent]
        });
        fixture = TestBed.createComponent(GalaxyFaceonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
