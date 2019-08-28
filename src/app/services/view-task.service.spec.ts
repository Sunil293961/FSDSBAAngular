import { TestBed } from '@angular/core/testing';

import { ViewTaskService } from './view-task.service';

describe('ViewTaskService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewTaskService = TestBed.get(ViewTaskService);
    expect(service).toBeTruthy();
  });
});
