import { Test, TestingModule } from '@nestjs/testing';
import { GraphDataController } from './graphData.controller';

describe('GraphDataController', () => {
  let controller: GraphDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraphDataController],
    }).compile();

    controller = module.get<GraphDataController>(GraphDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
