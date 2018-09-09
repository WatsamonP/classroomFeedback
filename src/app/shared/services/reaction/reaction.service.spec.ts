import { TestBed, inject } from '@angular/core/testing';

import { ReactionService } from './reaction.service';

describe('ReactionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReactionService]
    });
  });

  it('should be created', inject([ReactionService], (service: ReactionService) => {
    expect(service).toBeTruthy();
  }));
});
