import { TestBed } from '@angular/core/testing';

import { D3ChartService } from './d3-chart.service';

describe('D3ChartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: D3ChartService = TestBed.get(D3ChartService);
    expect(service).toBeTruthy();
  });
});
