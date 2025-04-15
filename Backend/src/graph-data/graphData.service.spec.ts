import { Test, TestingModule } from '@nestjs/testing';
import { GraphDataService } from './graphData.service';

describe('GraphDataService', () => {
  let service: GraphDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraphDataService],
    }).compile();

    service = module.get<GraphDataService>(GraphDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
