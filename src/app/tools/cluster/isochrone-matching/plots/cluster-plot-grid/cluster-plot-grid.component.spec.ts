import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ClusterPlotGridComponent} from './cluster-plot-grid.component';

describe('ClusterPlotGridComponent', () => {
    let component: ClusterPlotGridComponent;
    let fixture: ComponentFixture<ClusterPlotGridComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ClusterPlotGridComponent]
        });
        fixture = TestBed.createComponent(ClusterPlotGridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
