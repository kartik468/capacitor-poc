import { TestBed } from '@angular/core/testing';

import { SpinnerUiService } from './spinner-ui.service';

describe('SpinnerUiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpinnerUiService = TestBed.get(SpinnerUiService);
    expect(service).toBeTruthy();
  });
});
