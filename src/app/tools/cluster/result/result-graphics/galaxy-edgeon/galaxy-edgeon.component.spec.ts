import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GalaxyEdgeonComponent} from './galaxy-edgeon.component';

describe('GalaxyEdgeonComponent', () => {
    let component: GalaxyEdgeonComponent;
    let fixture: ComponentFixture<GalaxyEdgeonComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [GalaxyEdgeonComponent]
        });
        fixture = TestBed.createComponent(GalaxyEdgeonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
